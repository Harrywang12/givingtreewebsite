import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction, ADMIN_SECURITY_HEADERS } from '@/lib/admin';
import logger from '@/lib/logger';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const { id: donorId } = await params;
    const body = await request.json();
    const { name, isAnonymous, amount, message, isActive } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Donor name is required' },
        { status: 400, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Update donor
    const donor = await prisma.donor.update({
      where: { id: donorId },
      data: {
        name: name.trim(),
        isAnonymous: isAnonymous || false,
        amount: amount ? parseFloat(amount) : null,
        message: message?.trim() || null,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    // Log admin action
    await logAdminAction(admin.id, 'DONOR_UPDATE', 'donors', {
      donorId: donor.id,
      donorName: donor.name
    });

    return NextResponse.json({ 
      donor: donor,
      message: 'Donor updated successfully'
    });

  } catch (error) {
    logger.error('Update donor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const { id: donorId } = await params;

    // Soft delete by setting isActive to false
    const donor = await prisma.donor.update({
      where: { id: donorId },
      data: { isActive: false }
    });

    // Log admin action
    await logAdminAction(admin.id, 'DONOR_DELETE', 'donors', {
      donorId: donor.id,
      donorName: donor.name
    });

    return NextResponse.json({ 
      message: 'Donor removed successfully'
    });

  } catch (error) {
    logger.error('Delete donor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}
