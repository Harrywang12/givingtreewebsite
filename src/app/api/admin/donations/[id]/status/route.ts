import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction } from '@/lib/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Verify admin authentication
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const;
    type DonationStatus = typeof validStatuses[number];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Find the donation
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            totalDonated: true
          }
        }
      }
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const oldStatus = donation.status;

    // Update donation status
    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: { 
        status: status as DonationStatus,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // If changing from non-completed to completed, update user's total
    // If changing from completed to non-completed, subtract from user's total
    if (oldStatus !== 'COMPLETED' && status === 'COMPLETED') {
      // Add to user's total donated
      await prisma.user.update({
        where: { id: donation.user.id },
        data: {
          totalDonated: {
            increment: donation.amount
          }
        }
      });
    } else if (oldStatus === 'COMPLETED' && status !== 'COMPLETED') {
      // Subtract from user's total donated
      await prisma.user.update({
        where: { id: donation.user.id },
        data: {
          totalDonated: {
            decrement: donation.amount
          }
        }
      });
    }

    // Log admin action
    await logAdminAction(
      admin.id,
      'UPDATE_DONATION_STATUS',
      `Changed donation ${id} status from ${oldStatus} to ${status}`,
      { donationId: id, oldStatus, newStatus: status, amount: donation.amount }
    );

    return NextResponse.json({
      message: 'Donation status updated successfully',
      donation: updatedDonation
    });

  } catch (error) {
    console.error('Update donation status error:', error);
    return NextResponse.json(
      { error: 'Failed to update donation status' },
      { status: 500 }
    );
  }
}
