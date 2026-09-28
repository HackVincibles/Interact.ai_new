import express from 'express';
import { createSchedule, getUserSchedules, reschedule, cancelSchedule } from '../controllers/scheduleController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All schedule routes require authentication
router.use(requireAuth);

router.post('/', createSchedule);
router.get('/', getUserSchedules);
router.put('/:id', reschedule);
router.put('/:id/cancel', cancelSchedule);

export default router;
