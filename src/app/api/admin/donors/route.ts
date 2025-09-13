import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction, ADMIN_SECURITY_HEADERS } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const donors = await prisma.donor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      donors: donors,
      count: donors.length
    });

  } catch (error) {
    console.error('Get donors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const body = await request.json();
    const { name, isAnonymous, amount, itemDonated, message } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Donor name is required' },
        { status: 400, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Create donor
    const donor = await prisma.donor.create({
      data: {
        name: name.trim(),
        isAnonymous: isAnonymous || false,
        amount: amount ? parseFloat(amount) : null,
        itemDonated: itemDonated?.trim() || null,
        message: message?.trim() || null
      }
    });

    // Log admin action
    await logAdminAction(admin.id, 'DONOR_CREATE', 'donors', {
      donorId: donor.id,
      donorName: donor.name,
      isAnonymous: donor.isAnonymous
    });

    return NextResponse.json({ 
      donor: donor,
      message: 'Donor added successfully'
    });

  } catch (error) {
    console.error('Create donor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}
