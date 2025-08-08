import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

      return NextResponse.json({
        message: 'Event unliked successfully',
        liked: false
      })
    } else {
      // Like the event
      await prisma.like.create({
        data: {
          userId: decoded.userId,
          eventId: id
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

    // Check if user liked the event
    const like = await prisma.like.findFirst({
      where: {
        userId: decoded.userId,
        eventId: id
      }
    })

    return NextResponse.json({
      liked: !!like
    })

  } catch (error) {
    console.error('Get like status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 