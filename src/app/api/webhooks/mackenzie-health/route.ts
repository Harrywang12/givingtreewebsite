import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This is a secret key that should be set in your environment variables
// and shared with Mackenzie Health for webhook verification
const WEBHOOK_SECRET = process.env.MACKENZIE_HEALTH_WEBHOOK_SECRET || 'your-webhook-secret';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature from headers
    const signature = request.headers.get('x-webhook-signature');
    if (!signature || signature !== WEBHOOK_SECRET) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the webhook payload
    const payload = await request.json();
    const { 
      // donation_id, // Unused but may be needed in the future
      external_id, 
      amount, 
      status, 
      receipt_number,
      donation_date,
      // donor_email, // Unused but may be needed in the future
      // donor_name   // Unused but may be needed in the future
    } = payload;

    // Validate required fields
    if (!external_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the donation in our system
    const donation = await prisma.donation.findUnique({
      where: { id: external_id },
    });

    if (!donation) {
      console.error(`Donation not found: ${external_id}`);
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Update the donation status based on the webhook
    const updatedDonation = await prisma.donation.update({
      where: { id: external_id },
      data: {
        status: status === 'completed' ? 'COMPLETED' : 
               status === 'failed' ? 'FAILED' : 
               status === 'pending' ? 'PROCESSING' : 
               status === 'cancelled' ? 'CANCELLED' : 
               donation.status,
        amount: amount ? parseFloat(amount) : donation.amount,
        transactionId: receipt_number || donation.transactionId,
        confirmedAt: status === 'completed' ? new Date() : donation.confirmedAt,
        notes: `Updated via webhook: ${status}${receipt_number ? `, Receipt: ${receipt_number}` : ''}${donation_date ? `, Date: ${donation_date}` : ''}`
      },
      include: {
        user: true
      }
    });

    // If donation is completed, update the user's total donated amount
    if (status === 'completed' && updatedDonation.user) {
      await prisma.user.update({
        where: { id: updatedDonation.userId },
        data: {
          totalDonated: {
            increment: updatedDonation.amount
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      donation_id: updatedDonation.id,
      status: updatedDonation.status
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
