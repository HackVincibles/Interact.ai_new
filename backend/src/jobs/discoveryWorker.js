// BullMQ Background Worker for Web Discovery and Extraction
import { Worker } from 'bullmq';
import { WebIntelligenceService } from '../services/webIntelligenceService.js';
import dotenv from 'dotenv';
dotenv.config();

export function startDiscoveryWorker() {
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
        console.warn('⚠️ [BullMQ Worker] Invalid REDIS_URL:', e.message);
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
      return null;
    }

    return {
      host: 'localhost',
      port: 6379,
    };
  };

  const connection = getRedisConnection();
  if (!connection) {
    console.warn('⚠️ [BullMQ Worker] Discovery worker disabled: REDIS_URL/REDIS_HOST missing in production.');
    return;
  }

  try {
    const worker = new Worker(
      'job-discovery',
      async (job) => {
        console.log(`[BullMQ Worker] Processing discovery job: ${job.name}`);
        const { url } = job.data;
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
