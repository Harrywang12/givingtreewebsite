import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction, validateEventData, ADMIN_SECURITY_HEADERS } from '@/lib/admin';
import { rateLimit } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for admin event creation
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `admin_event_${clientIp}`;
    const isAllowed = await rateLimit.check(rateLimitKey, 10, 3600); // 10 events per hour
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many event creation attempts. Please try again later.' },
        { status: 429, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      await logAdminAction('unknown', 'FAILED_EVENT_CREATE', 'events', { reason: 'Invalid admin access' });
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Parse and validate request data
    const requestData = await request.json();
    const validation = validateEventData(requestData);
    
    if (!validation.isValid) {
      await logAdminAction(admin.id, 'FAILED_EVENT_CREATE', 'events', { 
        reason: 'Validation failed', 
        errors: validation.errors 
      });
      return NextResponse.json(
        { error: 'Invalid event data', details: validation.errors },
        { status: 400, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Create event in database
    const event = await prisma.event.create({
      data: {
        ...validation.sanitized!,
        authorId: admin.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    // Log successful admin action
    await logAdminAction(admin.id, 'CREATE_EVENT', 'events', {
      eventId: event.id,
      title: event.title,
      type: event.type
    });

    return NextResponse.json({
      message: 'Event created successfully',
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        content: event.content,
        date: event.date,
        type: event.type,
        location: event.location,
        imageUrl: event.imageUrl,
        isActive: event.isActive,
        author: event.author,
        commentCount: event._count.comments,
        likeCount: event._count.likes,
        createdAt: event.createdAt
      }
    }, { 
      status: 201,
      headers: ADMIN_SECURITY_HEADERS
    });

  } catch (error) {
    console.error('Admin event creation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access for getting all events (including inactive)
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Get all events with admin details
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    await logAdminAction(admin.id, 'VIEW_ALL_EVENTS', 'events', { count: events.length });

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      content: event.content,
      date: event.date,
      type: event.type,
      location: event.location,
      imageUrl: event.imageUrl,
      isActive: event.isActive,
      author: event.author,
      commentCount: event._count.comments,
      likeCount: event._count.likes,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    return NextResponse.json({
      events: formattedEvents
    }, {
      headers: ADMIN_SECURITY_HEADERS
    });

  } catch (error) {
    console.error('Admin get events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}
