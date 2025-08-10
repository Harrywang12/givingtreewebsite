import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction, ADMIN_SECURITY_HEADERS } from '@/lib/admin';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Event id is required' },
        { status: 400, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      await logAdminAction('unknown', 'FAILED_EVENT_DELETE', 'events', { reason: 'Invalid admin access', eventId: id });
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Ensure event exists
    const existing = await prisma.event.findUnique({
      where: { id },
      select: { id: true, title: true }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Delete event (comments and likes cascade per schema)
    await prisma.event.delete({ where: { id } });

    await logAdminAction(admin.id, 'DELETE_EVENT', 'events', { eventId: id, title: existing.title });

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200, headers: ADMIN_SECURITY_HEADERS }
    );
  } catch (error) {
    console.error('Admin event delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}


