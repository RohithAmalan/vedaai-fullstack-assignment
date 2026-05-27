import Redis from 'ioredis';
import { Queue } from 'bullmq';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Upstash uses rediss:// (TLS) — ioredis needs tls option enabled for it
const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  ...(redisUrl.startsWith('rediss://') ? { tls: {} } : {}),
});

export const questionGenerationQueue = new Queue('question-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export { redisConnection };
