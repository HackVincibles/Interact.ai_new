import express from 'express';
import { generateQuestions, startInterview, submitAnswer, getReport } from '../controllers/interviewController.js';

const router = express.Router();

router.post('/questions', generateQuestions);
router.post('/start', startInterview);
router.post('/answer', submitAnswer);
router.post('/report', getReport);

export default router;
