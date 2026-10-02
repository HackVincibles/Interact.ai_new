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
    const { sessionId, answersHistory = [], interviewConfig = {}, codingMetrics = null } = req.body;

    console.log('[REPORT API] POST /api/interview/report called');
    console.log('[REPORT API] sessionId:', sessionId);
    console.log('[REPORT API] answersHistory entries:', answersHistory.length);
    console.log('[REPORT API] codingMetrics:', codingMetrics);

    const result = await LangGraphInterviewService.generateFinalReport({
      sessionId,
      answersHistory,
      interviewConfig,
      codingMetrics,
    });

    res.json({
      success: true,
      report: result,
    });
  } catch (error) {
    console.error('[REPORT ERROR]', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      report: null,
    });
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

export const autosaveCodingSession = async (req, res, next) => {
  try {
    const { sessionId, codingState } = req.body;
    const userId = req.user?.id;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }
    const saved = await InterviewModel.saveCodingSessionState(sessionId, codingState, userId);
    if (!saved) {
      return res.status(404).json({ success: false, message: 'Session state not found' });
    }
    res.json({
      success: true,
      sessionId,
      savedAt: new Date().toISOString(),
      state: saved,
    });
  } catch (error) {
    next(error);
  }
};

export const restoreCodingSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    const state = await InterviewModel.getCodingSessionState(sessionId, userId);
    if (!state) {
      return res.status(404).json({ success: false, message: 'Session state not found' });
    }
    res.json({
      success: true,
      sessionId,
      state,
    });
  } catch (error) {
    next(error);
  }
};
