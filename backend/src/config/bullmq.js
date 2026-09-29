// BullMQ Queue Configuration
import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

const getRedisConnection = () => {
  if (process.env.REDIS_URL) {
    try {
      const url = new URL(process.env.REDIS_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port || '6379'),
        username: url.username || undefined,
        password: url.password || undefined,
        tls: url.protocol === 'rediss:' ? {} : undefined,
      };
    } catch (e) {
      console.warn('⚠️ Invalid REDIS_URL provided:', e.message);
    }
  }

  if (process.env.REDIS_HOST) {
    return {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    };
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ [BullMQ] REDIS_URL / REDIS_HOST not configured for BullMQ in production. Queue creation skipped.');
    return null;
  }

  return {
    host: 'localhost',
    port: 6379,
  };
};

const connection = getRedisConnection();

export const jobDiscoveryQueue = connection ? new Queue('job-discovery', { connection }) : null;
export const interviewReportQueue = connection ? new Queue('interview-report', { connection }) : null;

if (connection) {
  console.log('⚡ BullMQ Queues initialized successfully');
}
