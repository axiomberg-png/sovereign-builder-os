import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiEndpoint: process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
  localModelEndpoint: process.env.LOCAL_MODEL_ENDPOINT || 'http://localhost:11434/v1/chat/completions',
  rateLimitWindowMs: 60 * 1000,
  rateLimitMaxRequests: 100
};
