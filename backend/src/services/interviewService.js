// Interview AI Service
import { geminiFlash } from '../config/gemini.js';
import { InterviewModel } from '../models/interviewModel.js';

export class InterviewService {
  static async generateQuestions(domain, targetRole, userId) {
    const prompt = `Generate 3 technical interview questions for a candidate applying for '${targetRole || 'SDE-1'}' in domain '${domain || 'DSA'}'. Return JSON format with fields: id, title, prompt.`;

    let generatedText = null;
    try {
      const result = await geminiFlash.generateContent(prompt);
      generatedText = result.response.text();
    } catch (e) {
      console.warn('Gemini Flash API fallback:', e.message);
    }

    const fallbackQuestions = [
      {
        id: 1,
        title: 'Question 1: Data Structures & Hash Maps',
        prompt: 'Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that nums[i] + nums[j] + nums[k] == 0.',
      },
      {
        id: 2,
        title: 'Question 2: System Architecture & Caching',
        prompt: 'How do you prevent cache stampede/thundering herd problem using Redis in high-concurrency Node.js web applications?',
      },
    ];

    // Persist to Postgres database asynchronously
    await InterviewModel.saveInterviewSession({
      userId,
      domain: domain || 'DSA',
      targetRole: targetRole || 'SDE-1',
      questions: fallbackQuestions,
      score: 85,
    });

    return {
      questions: fallbackQuestions,
      aiText: generatedText,
    };
  }
}
