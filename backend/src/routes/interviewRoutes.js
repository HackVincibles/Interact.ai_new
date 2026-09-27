import express from 'express';
import { generateQuestions, startInterview, submitAnswer, getReport, getReportById } from '../controllers/interviewController.js';

const router = express.Router();

router.post('/questions', generateQuestions);
router.post('/start', startInterview);
router.post('/answer', submitAnswer);
router.post('/report', getReport);
router.get('/:id/report', getReportById);

export default router;
