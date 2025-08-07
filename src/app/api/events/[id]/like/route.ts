import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Check if user already liked this event
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: params.id
        }
      }
    })

    if (existingLike) {
      // Unlike the event
      await prisma.like.delete({
        where: {
          userId_eventId: {
            userId: decoded.userId,
            eventId: params.id
          }
        }
      })

      return NextResponse.json({
        message: 'Event unliked successfully',
        liked: false
      })
    } else {
      // Like the event
      await prisma.like.create({
        data: {
          userId: decoded.userId,
          eventId: params.id
        }
      })

      return NextResponse.json({
        message: 'Event liked successfully',
        liked: true
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
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ liked: false })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ liked: false })
    }

    // Check if user liked this event
    const like = await prisma.like.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: params.id
        }
      }
    })

    return NextResponse.json({ liked: !!like })

  } catch (error) {
    console.error('Check like error:', error)
    return NextResponse.json({ liked: false })
  }
} 