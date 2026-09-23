import express from 'express';
import { registerUser, loginUser, adminLogin, getProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/profile', getProfile);

export default router;
