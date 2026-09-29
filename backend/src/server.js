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
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { startReminderWorker } from './workers/reminderWorker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configured production CORS origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean).flatMap(url => url.split(',').map(u => u.trim()));

// Core Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, mobile, backend-to-backend)
    if (!origin) return callback(null, true);

    // Development origin check (localhost & 127.0.0.1)
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Explicit production origin match
    if (allowedOrigins.length > 0 && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
      return callback(null, true);
    }

    // Fallback permit for non-production environments when FRONTEND_URL is not set
    if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    callback(new Error(`CORS Error: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

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

// Simple Healthcheck Endpoints (Cloud Platform Ready)
const handleHealthCheck = (req, res) => {
  res.json({
    status: 'online',
    service: 'Interact.ai Backend API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);

// 404 for unmatched /api/* routes
app.use('/api', notFoundHandler);

// Centralized error middleware
app.use(errorHandler);

// Log environment startup readiness safely without printing secret values
const logEnvironmentStatus = () => {
  console.log('--------------------------------------------------');
  console.log('📋 Production Environment Readiness Audit Status:');
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'CONFIGURED' : '⚠️ MISSING'}`);
  console.log(`- GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'CONFIGURED' : '⚠️ MISSING'}`);
  console.log(`- TINYFISH_API_KEY: ${process.env.TINYFISH_API_KEY ? 'CONFIGURED' : '⚠️ MISSING'}`);
  console.log(`- FIRECRAWL_API_KEY: ${process.env.FIRECRAWL_API_KEY ? 'CONFIGURED' : '⚠️ MISSING'}`);
  console.log(`- BREVO_SMTP_USER: ${process.env.BREVO_SMTP_USER ? 'CONFIGURED' : '⚠️ MISSING'}`);
  console.log(`- UPSTASH_REDIS_REST_URL: ${process.env.UPSTASH_REDIS_REST_URL ? 'CONFIGURED' : '⚠️ MISSING'}`);
  console.log(`- FRONTEND_URL / CORS: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'LOCAL DEV FALLBACK'}`);
  console.log('--------------------------------------------------');
};

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Interact.ai Backend API listening on port ${PORT}`);
    logEnvironmentStatus();
    startReminderWorker();
  });
}

export default app;
