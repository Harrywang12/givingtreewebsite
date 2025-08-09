import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, logAdminAction } from '@/lib/admin';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];
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
        status: status as any,
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
      decoded.userId,
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
