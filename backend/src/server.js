import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startReminderWorker } from './workers/reminderWorker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors());
app.use(express.json());

import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/schedules', scheduleRoutes);

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Interact.ai Backend API',
    endpoints: ['/api/auth', '/api/leaderboard', '/api/payment', '/api/email', '/api/interview', '/api/jobs', '/api/resume'],
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Middleware
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Interact.ai Backend API running on http://localhost:${PORT}`);
    startReminderWorker();
  });
}

export default app;
