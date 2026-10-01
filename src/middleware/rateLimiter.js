import Redis from 'ioredis';
import { config } from '../config.js';

export const redis = new Redis(config.redisUrl);

export async function rateLimiter(req, res, next) {
  const tenantId = req.headers['x-tenant-id'] || req.ip;
  const key = `ratelimit:${tenantId}`;

  try {
    const requests = await redis.incr(key);
    if (requests === 1) {
      await redis.expire(key, Math.floor(config.rateLimitWindowMs / 1000));
    }

    if (requests > config.rateLimitMaxRequests) {
      return res.status(429).json({ error: 'Rate limit exceeded. Data sovereignty quota reached.' });
    }
    next();
  } catch (err) {
    // If Redis fails, log and bypass to prevent complete system outage
    console.error('Redis Rate Limiter Error:', err);
    next();
  }
}
