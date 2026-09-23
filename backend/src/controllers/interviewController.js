// Gemini & LangGraph AI Interview Controller
import { InterviewService } from '../services/interviewService.js';
import { LangGraphInterviewService } from '../services/langgraphInterviewService.js';

export const generateQuestions = async (req, res, next) => {
  try {
    const { domain, targetRole } = req.body;
    const userId = req.user?.id;
    const result = await InterviewService.generateQuestions(domain, targetRole, userId);
    res.json({
      success: true,
      questions: result.questions,
      aiText: result.aiText,
    });
  } catch (error) {
    next(error);
  }
};

export const startInterview = async (req, res, next) => {
  try {
    const result = await LangGraphInterviewService.startInterviewSession(req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const result = await LangGraphInterviewService.submitAnswer(req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const result = await LangGraphInterviewService.generateFinalReport(req.body);
    res.json({
      success: true,
      report: result,
    });
  } catch (error) {
    next(error);
  }
};
