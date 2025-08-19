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
    const { donationId, receiptNumber, amount, donationDate } = await request.json();

    // Validate required fields
    if (!donationId || !receiptNumber) {
      return NextResponse.json({ error: 'Donation ID and receipt number are required' }, { status: 400 });
    }

    // Find the donation record
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { user: true }
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Verify that the user matches if token is provided
    if (userId && donation.userId !== userId && donation.userId !== 'anonymous') {
      return NextResponse.json({ error: 'Unauthorized to verify this donation' }, { status: 403 });
    }

    // Update donation with verification details
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: 'COMPLETED',
        confirmedAt: new Date(),
        transactionId: receiptNumber,
        // Update amount if provided
        ...(amount ? { amount: parseFloat(amount) } : {}),
        notes: `Verified with receipt number: ${receiptNumber}${donationDate ? ` on ${donationDate}` : ''}`
      }
    });

    // Update user's totalDonated amount if this is a user-associated donation
    if (donation.userId && donation.userId !== 'anonymous') {
      await prisma.user.update({
        where: { id: donation.userId },
        data: {
          totalDonated: {
            increment: updatedDonation.amount
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Donation verified successfully',
      donation: {
        id: updatedDonation.id,
        amount: updatedDonation.amount,
        status: updatedDonation.status,
        confirmedAt: updatedDonation.confirmedAt
      }
    });
    
  } catch (error) {
    console.error('Error verifying donation:', error);
    return NextResponse.json(
      { error: 'Failed to verify donation' },
      { status: 500 }
    );
  }
}
