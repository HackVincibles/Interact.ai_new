// Gemini & LangGraph AI Interview Controller
import { InterviewService } from '../services/interviewService.js';
import { LangGraphInterviewService } from '../services/langgraphInterviewService.js';
import { InterviewModel } from '../models/interviewModel.js';

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

export const getNextAdaptiveQuestion = async (req, res, next) => {
  try {
    const result = await LangGraphInterviewService.generateNextAdaptiveQuestion(req.body);
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

export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interview = await InterviewModel.getInterviewById(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    let report = null;
    if (interview.feedback) {
      try {
        report = JSON.parse(interview.feedback);
      } catch (e) {
        console.warn('Failed to parse feedback json', e);
      }
    }
    res.json({
      success: true,
      report: report,
      interview: interview
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.query.userId || 1; // Fallback to 1 if not provided for testing
    const history = await InterviewModel.getHistoryByUserId(userId);
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};
