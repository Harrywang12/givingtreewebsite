import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import logger from '@/lib/logger';

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
    const { amount } = await request.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Create donation record
    let donation;
    
    if (userId) {
      // Create donation with user association
      donation = await prisma.donation.create({
        data: {
          userId,
          amount,
          type: 'MONETARY',
          status: 'PENDING',
          notes: 'Initiated monetary donation'
        }
      });
      
    } else {
      // Create anonymous donation (not associated with a user)
      donation = await prisma.donation.create({
        data: {
          // Use a placeholder user or track as anonymous
          userId: 'anonymous', // You might need to adjust this based on your schema
          amount,
          type: 'MONETARY',
          status: 'PENDING',
          notes: 'Anonymous monetary donation'
        }
      });
    }

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      message: 'Donation initiated successfully'
    });
    
  } catch (error) {
    logger.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}