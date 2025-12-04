import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin status
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is an admin
    const isUserAdmin = await isAdmin(userId);
    if (!isUserAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const sort = url.searchParams.get('sort') || 'createdAt';
    const direction = url.searchParams.get('direction') || 'desc';
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search');

    // Build query filters
    const filters: Record<string, unknown> = {};
    if (status) {
      filters.status = status;
    }
    if (type) {
      filters.type = type;
    }
    if (search) {
      filters.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          transactionId: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Fetch donations with pagination and sorting
    const donations = await prisma.donation.findMany({
      where: filters,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sort]: direction,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Count total donations matching filters
    const totalDonations = await prisma.donation.count({
      where: filters,
    });

    return NextResponse.json({
      donations,
      pagination: {
        total: totalDonations,
        page,
        limit,
        pages: Math.ceil(totalDonations / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}