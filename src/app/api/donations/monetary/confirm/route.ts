import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get authentication token if available
    const token = request.headers.get('authorization')?.split(' ')[1];
    let userId: string | null = null;
    
    // Verify user if token is provided
    if (token) {
      userId = await verifyAuth(token);
      if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Parse request body
    const { donationId, amount } = await request.json();

    // Validate required fields
    if (!donationId) {
      return NextResponse.json({ error: 'Donation ID is required' }, { status: 400 });
    }

    // Find the donation record
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { user: true }
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Update donation status to COMPLETED
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: 'COMPLETED',
        confirmedAt: new Date(),
        // If amount is provided and different, update it
        ...(amount && amount !== donation.amount ? { amount } : {})
      }
    });

    // Update user's totalDonated amount
    if (userId && userId === donation.userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalDonated: {
            increment: updatedDonation.amount
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Donation confirmed successfully'
    });
    
  } catch (error) {
    console.error('Error confirming donation:', error);
    return NextResponse.json(
      { error: 'Failed to confirm donation' },
      { status: 500 }
    );
  }
}
