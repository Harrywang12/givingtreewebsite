import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    // Rate limiting for likes
    const rateLimitKey = `like_${decoded.userId}`;
    const isAllowed = await rateLimit.check(rateLimitKey, 30, 600); // 30 likes per 10 minutes
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many like actions. Please wait before trying again.' },
        { status: 429 }
      );
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

    // Check if user already liked the event
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: decoded.userId,
        eventId: id
      }
    })

    if (existingLike) {
      // Unlike the event
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: {
          eventId: id,
          user: {
            isActive: true
          }
        }
      })

      return NextResponse.json({
        message: 'Event unliked successfully',
        liked: false,
        likeCount
      })
    } else {
      // Like the event
      const like = await prisma.like.create({
        data: {
          userId: decoded.userId,
          eventId: id
        }
      })

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: {
          eventId: id,
          user: {
            isActive: true
          }
        }
      })

      return NextResponse.json({
        message: 'Event liked successfully',
        liked: true,
        likeCount,
        like: {
          id: like.id,
          createdAt: like.createdAt
        }
      })
    }

  } catch (error) {
    console.error('Like event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
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

    // Get total like count (public information)
    const likeCount = await prisma.like.count({
      where: {
        eventId: id,
        user: {
          isActive: true
        }
      }
    })

    let userLiked = false

    // Check if current user liked the event (if authenticated)
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        const userLike = await prisma.like.findFirst({
          where: {
            userId: decoded.userId,
            eventId: id
          }
        })
        userLiked = !!userLike
      }
    }

    return NextResponse.json({
      likeCount,
      userLiked
    })

  } catch (error) {
    console.error('Get like status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}