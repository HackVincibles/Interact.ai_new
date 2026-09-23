// BullMQ Background Worker for Web Discovery and Extraction
import { Worker } from 'bullmq';
import { WebIntelligenceService } from '../services/webIntelligenceService.js';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export function startDiscoveryWorker() {
  try {
    const worker = new Worker(
      'job-discovery',
      async (job) => {
        console.log(`[BullMQ Worker] Processing discovery job: ${job.name}`);
        const { url, query } = job.data;
        if (url) {
          const fetchResult = await WebIntelligenceService.fetchWebpageContent(url);
          console.log(`[BullMQ Worker] Fetched content via ${fetchResult.provider}`);
        }
      },
      { connection }
    );

    worker.on('completed', (job) => {
      console.log(`[BullMQ Worker] Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
      console.warn(`[BullMQ Worker] Job ${job.id} failed:`, err.message);
    });
  } catch (err) {
    console.warn('BullMQ Worker connection notice:', err.message);
  }
}
