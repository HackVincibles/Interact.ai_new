import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { 
  checkAndIssueInterviewCertificates, 
  getMyCertificates, 
  verifyCertificate 
} from '../controllers/certificateController.js';

const router = express.Router();

router.post('/issue/interview', requireAuth, checkAndIssueInterviewCertificates);
router.get('/me', requireAuth, getMyCertificates);
router.get('/verify/:verificationId', verifyCertificate);

export default router;
