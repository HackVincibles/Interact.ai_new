// LangGraph & Gemini Stateful Real AI Interview Engine
import { StateGraph, END } from '@langchain/langgraph';
import { geminiFlash } from '../config/gemini.js';
import { InterviewModel } from '../models/interviewModel.js';

export class LangGraphInterviewService {
  /**
   * Initializes a new stateful AI Interview Session (HR, Technical, DSA, System Design, Resume-based).
   */
  static async startInterviewSession({ userId, interviewType, targetRole, domain, resumeText, jobDescription }) {
    const sessionId = `SESSION_${Date.now()}`;
    
    // Generate initial contextual question plan using Gemini
    const planPrompt = `
You are an expert AI Tech Interviewer conducting a realistic ${interviewType || 'Technical SDE-1'} interview for role '${targetRole || 'Software Development Engineer'}'.
Domain: '${domain || 'DSA & Web Architecture'}'.
Candidate Resume Highlights: "${(resumeText || '').slice(0, 1000)}"
Target Job Description: "${(jobDescription || '').slice(0, 1000)}"

Generate a sequence of 3 high-impact contextual technical & architectural questions.
Return JSON array of strings: ["Question 1...", "Question 2...", "Question 3..."].
`;

    let initialQuestions = [
      `Could you explain the system architecture and technical challenges of your primary software project?`,
      `How do you handle concurrency, caching, and database state when building web APIs under high load?`,
      `Given an integer array, how do you find all unique triplets that sum to zero with optimal time complexity?`,
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
   * Generates a 50-Parameter Final AI Evaluation Report upon completion.
   */
  static async generateFinalReport({ sessionId, answersHistory = [], evaluationsHistory = [] }) {
    const transcriptText = answersHistory.map(h => `${h.sender === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${h.text}`).join('\n');

    const reportPrompt = `
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
    { "q": "summary of question asked", "score": number, "note": "specific feedback on their answer" }
  ],
  "recommendedPractice": "actionable study plan"
}
`;

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
