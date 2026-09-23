// Resume Scanner Routes
import express from 'express';
import { scanResume } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/scan', scanResume);

export default router;
