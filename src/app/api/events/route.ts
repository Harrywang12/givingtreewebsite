import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EventType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')

    const whereClause: {
      isActive: boolean;
      type?: EventType;
    } = {
      isActive: true
    }

    if (type && Object.values(EventType).includes(type as EventType)) {
      whereClause.type = type as EventType
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        comments: {
          where: {
            user: {
              isActive: true
            }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Limit initial comments loaded
        },
        likes: {
          where: {
            user: {
              isActive: true
            }
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Format events for public consumption
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      content: event.content,
      date: event.date,
      type: event.type,
      location: event.location,
      imageUrl: event.imageUrl,
      author: {
        name: event.author.name,
        isAdmin: event.author.role === 'ADMIN' || event.author.role === 'SUPER_ADMIN'
      },
      comments: event.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user
      })),
      commentCount: event._count.comments,
      likeCount: event._count.likes,
      userLiked: false, // Will be updated if user is authenticated
      createdAt: event.createdAt
    }))

    return NextResponse.json({ 
      events: formattedEvents,
      count: formattedEvents.length,
      hasMore: events.length === limit
    })

  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Event creation is now handled by admin-only endpoint at /api/admin/events
// This ensures only verified admins can create events 