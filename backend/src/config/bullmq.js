// BullMQ Queue Configuration
import { Queue, Worker } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const jobDiscoveryQueue = new Queue('job-discovery', { connection });
export const interviewReportQueue = new Queue('interview-report', { connection });

console.log('⚡ BullMQ Queues initialized asynchronously');
