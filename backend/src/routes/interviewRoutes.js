import express from 'express';
import { generateQuestions, startInterview, submitAnswer, getNextAdaptiveQuestion, getReport, getReportById, getHistory, autosaveCodingSession, restoreCodingSession } from '../controllers/interviewController.js';

const router = express.Router();

router.post('/questions', generateQuestions);
router.post('/start', startInterview);
router.post('/answer', submitAnswer);
router.post('/next-question', getNextAdaptiveQuestion);
router.post('/report', getReport);
router.post('/session/autosave', autosaveCodingSession);
router.get('/session/:sessionId', restoreCodingSession);
router.get('/:id/report', getReportById);
router.get('/history', getHistory);

export default router;
