import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'
import logger from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verify event exists and is active
    const event = await prisma.event.findFirst({
      where: { 
        id,
        isActive: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    const comments = await prisma.comment.findMany({
      where: {
        eventId: id,
        user: {
          isActive: true // Only show comments from active users
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
      }
    })

    return NextResponse.json({ 
      comments,
      count: comments.length
    })

  } catch (error) {
    logger.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content } = await request.json()
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Rate limiting for comments
    const rateLimitKey = `comment_${decoded.userId}`;
    const isAllowed = await rateLimit.check(rateLimitKey, 10, 600); // 10 comments per 10 minutes
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many comments. Please wait before commenting again.' },
        { status: 429 }
      );
    }

    // Validate comment content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be 1000 characters or less' },
        { status: 400 }
      )
    }

    // Verify user exists and is active
    const user = await prisma.user.findFirst({
      where: { 
        id: decoded.userId,
        isActive: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found or inactive' },
        { status: 403 }
      )
    }

    // Verify event exists and is active
    const event = await prisma.event.findFirst({
      where: { 
        id,
        isActive: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Sanitize comment content
    const sanitizedContent = content.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        userId: decoded.userId,
        eventId: id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Comment created successfully',
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user
      }
    }, { status: 201 })

  } catch (error) {
    logger.error('Add comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 