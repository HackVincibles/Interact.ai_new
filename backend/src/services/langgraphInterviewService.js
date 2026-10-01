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
   * Generates a comprehensive AI Evaluation Report from the actual Vapi transcript.
   * @param {object} params
   * @param {string} params.sessionId
   * @param {Array}  params.answersHistory - [{sender: 'interviewer'|'candidate', text, time}]
   * @param {object} [params.interviewConfig] - optional config with roundType, practiceMode etc.
   */
  static async generateFinalReport({ sessionId, answersHistory = [], interviewConfig = {} }) {
    const candidateLines = answersHistory.filter(h => (h.sender === 'candidate' || h.role === 'user') && h.text?.trim());
    const totalChars = answersHistory.map(h => h.text || '').join('').length;

    console.log('[REPORT API] Received transcript entries:', answersHistory.length);
    console.log('[REPORT API] Candidate responses:', candidateLines.length);
    console.log('[REPORT API] Transcript characters:', totalChars);

    let practiceMode = interviewConfig?.practiceMode || 'full';
    let roundType = interviewConfig?.roundType || null;
    let interviewDomain = interviewConfig?.type || '';

    // Load session metadata from DB if a real session ID was saved
    if (sessionId && !sessionId.startsWith('SESSION_')) {
      try {
        const interview = await InterviewModel.getInterviewById(sessionId);
        if (interview) {
          practiceMode = interview.practice_mode || practiceMode;
          roundType = interview.round_type || roundType;
          interviewDomain = interview.domain || interviewDomain;
          console.log('[REPORT API] Loaded session from DB. domain:', interviewDomain, 'roundType:', roundType);
        }
      } catch (dbErr) {
        console.warn('[REPORT API] Could not load session from DB:', dbErr.message);
      }
    }

    // Build normalized transcript text from Vapi messages
    const normalizedLines = answersHistory
      .filter(h => h && h.text && h.text.trim().length > 0)
      .map(h => `${(h.sender === 'interviewer' || h.role === 'assistant') ? 'Interviewer' : 'Candidate'}: ${h.text.trim()}`);

    const transcriptText = normalizedLines.join('\n');

    if (normalizedLines.length === 0 || candidateLines.length === 0) {
      console.warn('[REPORT API] Transcript is empty — returning empty transcript error report');
      return {
        overallScore: null,
        technicalKnowledge: null,
        communication: null,
        problemSolving: null,
        strengths: [],
        weaknesses: ['No interview transcript was captured. The candidate may not have spoken or the session ended prematurely.'],
        topicsToImprove: ['Ensure microphone is active during the interview.'],
        questionFeedback: [],
        recommendedPractice: 'Report generation failed: No interview transcript was available.',
        _error: 'empty_transcript',
      };
    }

    console.log('[REPORT AI] Preparing evaluation');
    console.log('[REPORT AI] Interview type:', interviewDomain || roundType || 'Technical');
    console.log('[REPORT AI] Transcript entries:', normalizedLines.length);
    console.log('[REPORT AI] Transcript characters:', transcriptText.length);

    const reportPrompt = `You are an expert AI Interviewer tasked with evaluating a candidate's interview performance.
Interview Context: Domain="${interviewDomain || 'General'}", PracticeMode="${practiceMode}", RoundType="${roundType || 'General'}".

Evaluation instructions per round type:
- If HR/General round: Evaluate communication, behavioral clarity, situational judgment, and relevance.
- If Technical round: Evaluate domain knowledge, technical terminology accuracy, and logic.
- If Coding round: Evaluate problem-solving approach, algorithmic thinking, and structural code breakdown.

Evaluate the candidate's ACTUAL responses below. Do NOT use generic feedback. Reference specific details the candidate mentioned.
If the transcript has fewer than 3 candidate turns, give appropriate scores reflecting the limited participation.

Interview Transcript:
${transcriptText}

Return ONLY a single valid JSON object with EXACTLY this schema (no markdown, no explanation, just JSON):
{
  "overallScore": <integer 0-100>,
  "technicalKnowledge": <integer 0-100>,
  "communication": <integer 0-100>,
  "problemSolving": <integer 0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "topicsToImprove": ["<topic 1>", "<topic 2>"],
  "questionFeedback": [
    {
      "q": "<the full question asked by the interviewer>",
      "score": <integer 0-100>,
      "note": "<specific feedback referencing what the candidate actually said>",
      "userAnswer": "<concise summary of what the candidate said>",
      "idealAnswer": "<concise model answer>"
    }
  ],
  "recommendedPractice": "<actionable 2-3 sentence study recommendation>"
}`;

    let rawText = '';
    try {
      const result = await geminiFlash.generateContent(reportPrompt);
      rawText = result.response.text();
      console.log('[REPORT AI] Raw Gemini response length:', rawText.length);
    } catch (geminiErr) {
      console.error('[REPORT AI] Gemini generateContent failed:', geminiErr.message);
      throw new Error(`AI evaluation failed: ${geminiErr.message}`);
    }

    // Safe JSON extraction — handles plain JSON, markdown-fenced JSON, or embedded JSON
    let report = null;
    try {
      report = JSON.parse(rawText.trim());
    } catch (_) {
      const stripped = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      try {
        report = JSON.parse(stripped);
      } catch (_2) {
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          try {
            report = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
          } catch (parseErr) {
            console.error('[REPORT AI] All JSON parsing attempts failed. Raw text snippet:', rawText.slice(0, 400));
            throw new Error(`Failed to parse AI evaluation JSON: ${parseErr.message}`);
          }
        } else {
          console.error('[REPORT AI] No JSON object found in Gemini response. Raw text snippet:', rawText.slice(0, 400));
          throw new Error('AI evaluation returned no parseable JSON.');
        }
      }
    }

    // Validate required fields
    if (!report || typeof report !== 'object' || typeof report.overallScore !== 'number') {
      console.error('[REPORT AI] Validation failed — overallScore is missing or not a number:', report);
      throw new Error('AI evaluation returned invalid report: overallScore missing.');
    }

    console.log('[REPORT AI] Evaluation generated successfully');
    console.log('[REPORT AI] Overall score:', report.overallScore);
    console.log('[REPORT AI] Technical score:', report.technicalKnowledge);
    console.log('[REPORT AI] Communication score:', report.communication);
    console.log('[REPORT AI] Problem solving score:', report.problemSolving);

    // Persist to DB if a session ID is available
    if (sessionId) {
      console.log('[REPORT DB] Saving report');
      console.log('[REPORT DB] Interview ID:', sessionId);
      console.log('[REPORT DB] Overall score:', report.overallScore);
      try {
        const saved = await InterviewModel.updateInterviewReport(sessionId, report);
        if (saved) {
          console.log('[REPORT DB] Save successful');
        } else {
          console.warn('[REPORT DB] Save update returned no row (ID fallback created)');
        }
      } catch (dbSaveErr) {
        console.error('[REPORT DB] Failed to save report to DB:', dbSaveErr.message);
      }
    }

    return report;
  }

}
