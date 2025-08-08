import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import getRedisClient from '@/lib/redis';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection (optional)
    let redisStatus = 'not_configured';
    try {
      const redisClient = await getRedisClient();
      if (redisClient) {
        await redisClient.ping();
        redisStatus = 'connected';
      }
    } catch (error) {
      redisStatus = 'error';
      console.error('Redis health check failed:', error);
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: redisStatus,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
} 