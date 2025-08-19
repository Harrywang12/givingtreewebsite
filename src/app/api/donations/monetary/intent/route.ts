import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse request body
    const { amount, donationId, redirectUrl } = await request.json();

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Create or update donation record with PENDING status
    const donation = await prisma.donation.upsert({
      where: {
        id: donationId || 'new-donation', // If donationId is provided, update that record
      },
      update: {
        amount: amount,
        redirectUrl: redirectUrl,
        status: 'PENDING',
        type: 'MONETARY',
        notes: 'Redirected to Mackenzie Health donation page',
      },
      create: {
        userId: userId,
        amount: amount,
        redirectUrl: redirectUrl,
        status: 'PENDING',
        type: 'MONETARY',
        notes: 'Redirected to Mackenzie Health donation page',
      },
    });

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      message: 'Donation intent recorded successfully',
    });
  } catch (error) {
    console.error('Error recording donation intent:', error);
    return NextResponse.json(
      { error: 'Failed to record donation intent' },
      { status: 500 }
    );
  }
}
