import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const { donationId, status, reason } = await request.json();
    
    // Validate required fields
    if (!donationId) {
      return NextResponse.json({ error: 'Donation ID is required' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'INVALIDATED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      }, { status: 400 });
    }

    // Find the donation
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { user: true }
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // If changing from COMPLETED to another status, adjust user's totalDonated
    let userData = {};
    if (donation.status === 'COMPLETED' && status !== 'COMPLETED' && donation.userId && donation.userId !== 'anonymous') {
      userData = {
        totalDonated: {
          decrement: donation.amount
        }
      };
    }
    // If changing to COMPLETED from another status, increment user's totalDonated
    else if (donation.status !== 'COMPLETED' && status === 'COMPLETED' && donation.userId && donation.userId !== 'anonymous') {
      userData = {
        totalDonated: {
          increment: donation.amount
        }
      };
    }

    // Update donation status
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: status,
        notes: reason ? 
          `${donation.notes ? donation.notes + ' | ' : ''}Status changed to ${status} by admin. Reason: ${reason}` : 
          `${donation.notes ? donation.notes + ' | ' : ''}Status changed to ${status} by admin.`,
        // Set or clear confirmedAt based on status
        confirmedAt: status === 'COMPLETED' ? 
          (donation.confirmedAt || new Date()) : 
          (status === 'INVALIDATED' || status === 'CANCELLED' || status === 'FAILED' ? null : donation.confirmedAt)
      }
    });

    // Update user's totalDonated if needed
    if (Object.keys(userData).length > 0 && donation.userId && donation.userId !== 'anonymous') {
      await prisma.user.update({
        where: { id: donation.userId },
        data: userData
      });
    }

    return NextResponse.json({
      success: true,
      message: `Donation status updated to ${status}`,
      donation: {
        id: updatedDonation.id,
        status: updatedDonation.status,
        amount: updatedDonation.amount,
        updatedAt: updatedDonation.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error updating donation status:', error);
    return NextResponse.json(
      { error: 'Failed to update donation status' },
      { status: 500 }
    );
  }
}
