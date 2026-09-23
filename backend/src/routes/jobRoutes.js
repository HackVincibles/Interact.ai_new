// Job & Internship Routes
import express from 'express';
import { getJobs, getFundingRadar, triggerWebScan, checkSystemHealth } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/funding-radar', getFundingRadar);
router.post('/scan', triggerWebScan);
router.get('/health', checkSystemHealth);

export default router;
