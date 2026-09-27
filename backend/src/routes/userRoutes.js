import express from 'express';
import { updateAvatar } from '../controllers/userController.js';

const router = express.Router();

router.post('/avatar', updateAvatar);

export default router;
