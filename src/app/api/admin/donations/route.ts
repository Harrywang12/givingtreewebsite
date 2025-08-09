import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get donations with user information
    const donations = await prisma.donation.findMany({
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        transactionId: true,
        notes: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to most recent 50 donations
    });

    return NextResponse.json({
      donations,
      total: donations.length
    });

  } catch (error) {
    console.error('Admin donations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
