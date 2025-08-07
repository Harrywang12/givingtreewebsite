import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// Connect to Redis
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

export default redisClient;

// Cache utility functions
export const cache = {
  async get(key: string) {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key: string, value: unknown, ttl?: number) {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  },

  async del(key: string) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  },

  async exists(key: string) {
    try {
      return await redisClient.exists(key);
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }
};

// Rate limiting utility
export const rateLimit = {
  async check(key: string, limit: number, window: number): Promise<boolean> {
    try {
      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.expire(key, window);
      }
      return current <= limit;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow if Redis fails
    }
  }
}; 