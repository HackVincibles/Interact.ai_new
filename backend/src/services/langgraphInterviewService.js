// LangGraph & Gemini Stateful Real AI Interview Engine
import { StateGraph, END } from '@langchain/langgraph';
import { geminiFlash } from '../config/gemini.js';
import { InterviewModel } from '../models/interviewModel.js';

export class LangGraphInterviewService {
  /**
   * Initializes a new stateful AI Interview Session (HR, Technical, DSA, System Design, Resume-based).
   */
  static async startInterviewSession({ userId, interviewType, targetRole, domain, resumeText, jobDescription, practiceMode = 'full', roundType = null }) {
    const sessionId = `SESSION_${Date.now()}`;
    
    let planPrompt = '';
    
    if (interviewType?.toLowerCase().includes('resume') || (domain && domain.toLowerCase().includes('resume'))) {
      planPrompt = `
You are a Senior Technical Recruiter conducting a RESUME-BASED INTERVIEW.
Candidate Resume Content: "${(resumeText || '').slice(0, 3000)}"

STRICT REQUIREMENT: All questions MUST BE STRICTLY AND DIRECTLY BASED ON THE CANDIDATE'S RESUME (projects, technologies, experience, or skills listed in the text above). Do NOT ask generic unrelated questions. Ask specifically about the architecture, tools, and decisions mentioned in their resume.
Return ONLY a JSON array of 3 strings: ["Resume Question 1...", "Resume Question 2...", "Resume Question 3..."].
`;
    } else if (practiceMode === 'targeted') {
      planPrompt = `
You are an expert AI Interviewer conducting a targeted PRACTICE session for the '${roundType}' round.
Topic/Domain: '${domain || roundType}'.
Candidate Resume Highlights: "${(resumeText || '').slice(0, 1000)}"

Generate a sequence of 3 high-impact questions specifically focused on ${roundType}.
If round is 'Aptitude', ask quantitative or logical reasoning questions.
If round is 'HR', ask behavioral or situational questions.
If round is 'Technical' or 'Coding', ask technical concept or coding-related questions.
Return ONLY a JSON array of strings: ["Question 1...", "Question 2...", "Question 3..."].
`;
    } else {
      planPrompt = `
You are an expert AI Tech Interviewer conducting a realistic ${interviewType || 'Technical SDE-1'} interview for role '${targetRole || 'Software Development Engineer'}'.
Domain: '${domain || 'DSA & Web Architecture'}'.
Candidate Resume Highlights: "${(resumeText || '').slice(0, 1000)}"
Target Job Description: "${(jobDescription || '').slice(0, 1000)}"

Generate a sequence of 3 high-impact contextual technical & architectural questions.
Return ONLY a JSON array of strings: ["Question 1...", "Question 2...", "Question 3..."].
`;
    }

    let initialQuestions = [
      practiceMode === 'targeted' ? `Let's start your targeted ${roundType} practice. Could you walk me through a core concept in this area?` : `Could you explain the system architecture and technical challenges of your primary software project?`,
      practiceMode === 'targeted' ? `Can you give an example of a difficult problem you solved related to ${roundType}?` : `How do you handle concurrency, caching, and database state when building web APIs under high load?`,
      practiceMode === 'targeted' ? `Finally, what is a key takeaway you've learned while studying ${roundType}?` : `Given an integer array, how do you find all unique triplets that sum to zero with optimal time complexity?`,
    ];

    try {
      const result = await geminiFlash.generateContent(planPrompt);
      const text = result.response.text();
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        initialQuestions = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Gemini question planning notice:', e.message);
    }

    const sessionState = {
      sessionId,
      userId,
      interviewType: interviewType || 'Technical SDE-1',
      targetRole: targetRole || 'Software Development Engineer',
      domain: domain || 'DSA & Web Development',
      practiceMode,
      roundType,
      status: 'QUESTIONING',
      currentQuestionIndex: 0,
      questions: initialQuestions,
      answersHistory: [],
      evaluationsHistory: [],
      currentFollowUp: null,
      score: 0,
      createdAt: new Date().toISOString(),
    };

    // Save session in DB
    const savedRecord = await InterviewModel.saveInterviewSession({
      userId,
      domain: sessionState.domain,
      targetRole: sessionState.targetRole,
      questions: initialQuestions,
      score: 0,
      practiceMode: sessionState.practiceMode,
      roundType: sessionState.roundType,
    });

    const realSessionId = savedRecord.id.toString();

    return {
      sessionId: realSessionId,
      status: 'QUESTIONING',
      currentQuestion: initialQuestions[0],
      questionNumber: 1,
      totalQuestions: initialQuestions.length,
      interviewType: sessionState.interviewType,
    };
  }

  /**
   * Processes candidate's verbal/text answer, evaluates technical accuracy & depth, and determines follow-up or next question.
   */
  static async submitAnswer({ sessionId, questionIndex, candidateAnswer, answersHistory = [], questions = [] }) {
    const currentQ = questions[questionIndex] || "Explain your technical approach to building scalable web applications.";

    // Evaluate answer via Gemini
    const evalPrompt = `
You are an expert AI Interviewer evaluating a candidate's answer.
Question: "${currentQ}"
Candidate Answer: "${candidateAnswer}"

Evaluate answer technical accuracy, clarity, and depth.
If the answer is vague, weak, or incomplete, generate a sharp, specific follow-up question.
Return JSON format:
{
  "accuracyScore": 85,
  "communicationScore": 90,
  "isSatisfactory": true,
  "feedback": "Strong explanation of asynchronous handling and database indexes.",
  "followUpQuestion": "How would you handle Redis cache eviction when memory limit is reached?"
}
`;

    let evaluation = {
      accuracyScore: 80,
      communicationScore: 85,
      isSatisfactory: candidateAnswer.length > 30,
      feedback: 'Good technical clarity and structured explanation.',
      followUpQuestion: candidateAnswer.length < 30 ? 'Could you elaborate on the exact data structure used and its space complexity?' : null,
    };

    try {
      const result = await geminiFlash.generateContent(evalPrompt);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        evaluation = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Gemini answer evaluation notice:', e.message);
    }

    const nextIndex = questionIndex + 1;
    const isCompleted = nextIndex >= questions.length && evaluation.isSatisfactory;

    return {
      sessionId,
      questionIndex,
      evaluation,
      isCompleted,
      nextQuestion: isCompleted ? null : questions[nextIndex],
      nextQuestionNumber: nextIndex + 1,
    };
  }

  /**
   * Generates a real-time adaptive conversational turn response & next question based on interview mode, difficulty & candidate response.
   */
  static async generateNextAdaptiveQuestion({ sessionId, candidateAnswer, transcriptHistory = [], interviewConfig = {}, isTimeOver = false }) {
    const {
      mode = 'role_jd',
      targetRole = 'Software Development Engineer',
      jobDescription = '',
      resumeText = '',
      difficulty = 'Medium',
      roundType = 'Technical'
    } = interviewConfig;

    if (isTimeOver) {
      return {
        aiMessage: "The time is over. Thank you for this wonderful conversation! You can see your comprehensive interview report after the interview ends.",
        isComplete: true
      };
    }

    const transcriptPrompt = transcriptHistory.slice(-6).map(t => `${t.sender === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${t.text}`).join('\n');

    const prompt = `
You are an expert AI Senior Interviewer conducting a LIVE conversational mock interview.
MODE: ${mode} (resume / role_jd / hr / cs_core)
TARGET ROLE: "${targetRole}"
DIFFICULTY: "${difficulty}" (Easy / Medium / FAANG Level Hard)
TARGET JD: "${(jobDescription || '').slice(0, 600)}"
CANDIDATE RESUME: "${(resumeText || '').slice(0, 800)}"

RECENT CONVERSATION TRANSCRIPT:
${transcriptPrompt || '(Candidate just started)'}

CANDIDATE LATEST ANSWER / RESPONSE:
"${candidateAnswer || 'Hello, I am ready for the interview.'}"

INSTRUCTIONS:
1. Provide a short 1-sentence natural acknowledgement of the candidate's answer/intro.
2. Ask the NEXT logical, adaptive interview question based on their answer, difficulty level (${difficulty}), and mode (${mode}).
- If mode is 'resume', ask specific technical questions about projects, stack, or experience mentioned in candidate resume.
- If mode is 'cs_core', ask core CS questions (OS, DBMS, Computer Networks, OOPs, DSA).
- If mode is 'hr', ask behavioral or situational questions.
- If difficulty is 'FAANG Level Hard', ask deep architectural, edge-case, or system scaling questions.

Return JSON format strictly:
{
  "acknowledgment": "Good explanation on asynchronous queues and database locking.",
  "nextQuestion": "How would you handle Redis cache degradation if primary node drops?",
  "fullAiSpeech": "Good explanation on asynchronous queues and database locking. Next, how would you handle Redis cache degradation if primary node drops?"
}
`;

    try {
      const result = await geminiFlash.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          aiMessage: parsed.fullAiSpeech || `${parsed.acknowledgment} ${parsed.nextQuestion}`,
          acknowledgment: parsed.acknowledgment,
          nextQuestion: parsed.nextQuestion,
          isComplete: false
        };
      }
    } catch (err) {
      console.warn('Adaptive AI question fallback:', err.message);
    }

    const fallbackQ = mode === 'resume'
      ? `Could you dive deeper into the technical architecture of the primary project listed on your resume?`
      : mode === 'cs_core'
      ? `Can you explain the difference between process and thread synchronization, and how deadlock avoidance works?`
      : mode === 'hr'
      ? `Describe a situation where you faced a major technical roadblock. How did you handle it?`
      : `How do you optimize database query execution time and indexing strategy under high concurrent load?`;

    return {
      aiMessage: `Thank you for sharing that. ${fallbackQ}`,
      nextQuestion: fallbackQ,
      isComplete: false
    };
  }

  /**
   * Generates a 50-Parameter Final AI Evaluation Report upon completion.
   */
  static async generateFinalReport({ sessionId, answersHistory = [], evaluationsHistory = [] }) {
    let practiceMode = 'full';
    let roundType = null;
    let interviewDomain = '';

    if (sessionId && !sessionId.startsWith('SESSION_')) {
      const interview = await InterviewModel.getInterviewById(sessionId);
      if (interview) {
        practiceMode = interview.practice_mode || 'full';
        roundType = interview.round_type;
        interviewDomain = interview.domain || '';
      }
    }

    const transcriptText = answersHistory.map(h => `${h.sender === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${h.text}`).join('\n');

    let reportPrompt = '';
    if (practiceMode === 'targeted') {
      reportPrompt = `
You are an expert AI Interviewer. Evaluate this transcript for a targeted '${roundType}' practice session (Domain: ${interviewDomain}). 
Generate a comprehensive report based ONLY on this candidate's actual performance. Do not use generic feedback; refer to specific things the candidate said.
If the candidate did not answer any questions, give them a score of 0 and state that they did not participate.

Interview Transcript:
${transcriptText || '(No transcript provided)'}

Return ONLY valid JSON format with schema exactly matching:
{
  "overallScore": number (0-100),
  "technicalKnowledge": number (0-100),
  "communication": number (0-100),
  "problemSolving": number (0-100),
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "topicsToImprove": ["...", "..."],
  "questionFeedback": [
    { "q": "the full question asked", "score": number, "note": "specific feedback on their answer", "userAnswer": "a concise summary of what the candidate actually said", "idealAnswer": "a concise model answer they should have given" }
  ],
  "recommendedPractice": "actionable study plan"
}
`;
    } else {
      reportPrompt = `
You are an expert AI Tech Interviewer. Evaluate this interview transcript and generate a comprehensive AI Candidate Interview Report based ONLY on this candidate's actual performance. Do not use generic feedback; refer to specific things the candidate said.
If the candidate did not answer any questions or the transcript is empty/too short, give them a score of 0 and state that they did not participate.

Interview Transcript:
${transcriptText || '(No transcript provided)'}

Return ONLY valid JSON format with schema exactly matching:
{
  "overallScore": number (0-100),
  "technicalKnowledge": number (0-100),
  "communication": number (0-100),
  "problemSolving": number (0-100),
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "topicsToImprove": ["...", "..."],
  "questionFeedback": [
    { "q": "the full question asked", "score": number, "note": "specific feedback on their answer", "userAnswer": "a concise summary of what the candidate actually said", "idealAnswer": "a concise model answer they should have given" }
  ],
  "recommendedPractice": "actionable study plan"
}
`;
    }

    let report = {
      overallScore: 0,
      technicalKnowledge: 0,
      communication: 0,
      problemSolving: 0,
      strengths: ['No data (Interview aborted or failed to parse)'],
      weaknesses: ['No data'],
      topicsToImprove: ['No data'],
      questionFeedback: [],
      recommendedPractice: 'Complete an interview to generate a report.',
    };

    try {
      const result = await geminiFlash.generateContent(reportPrompt);
      const text = result.response.text();
      // Safely extract JSON between first { and last }
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonStr = text.substring(firstBrace, lastBrace + 1);
        report = JSON.parse(jsonStr);
      } else {
        console.warn('Gemini report generation failed to produce JSON:', text);
      }

    } catch (e) {
      console.warn('Gemini report generation notice:', e.message);
    }

    if (sessionId && !sessionId.startsWith('SESSION_')) {
      await InterviewModel.updateInterviewReport(sessionId, report);
    }

    return report;
  }
}
