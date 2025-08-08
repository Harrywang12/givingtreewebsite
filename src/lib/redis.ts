import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;
let isConnecting = false;

// Lazy initialization of Redis client
const getRedisClient = async (): Promise<RedisClientType | null> => {
  // If Redis URL is not provided, return null
  if (!process.env.REDIS_URL) {
    return null;
  }

  // If client already exists and is connected, return it
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // If already connecting, wait
  if (isConnecting) {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (redisClient && redisClient.isOpen) {
          resolve(redisClient);
        } else if (!isConnecting) {
          resolve(null);
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  // Create new client
  try {
    isConnecting = true;
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await redisClient.connect();
    isConnecting = false;
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    isConnecting = false;
    return null;
  }
};

// Cache utility functions
export const cache = {
  async get(key: string) {
    try {
      const client = await getRedisClient();
      if (!client) return null;
      
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key: string, value: unknown, ttl?: number) {
    try {
      const client = await getRedisClient();
      if (!client) return;
      
      const serialized = JSON.stringify(value);
      if (ttl) {
        await client.setEx(key, ttl, serialized);
      } else {
        await client.set(key, serialized);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  },

  async del(key: string) {
    try {
      const client = await getRedisClient();
      if (!client) return;
      
      await client.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  },

  async exists(key: string) {
    try {
      const client = await getRedisClient();
      if (!client) return false;
      
      return await client.exists(key);
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
      const client = await getRedisClient();
      if (!client) return true; // Allow if Redis is not available
      
      const current = await client.incr(key);
      if (current === 1) {
        await client.expire(key, window);
      }
      return current <= limit;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow if Redis fails
    }
  }
};

// Export a function to close Redis connection (useful for cleanup)
export const closeRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
};

// For backward compatibility, export a default client getter
export default getRedisClient; 