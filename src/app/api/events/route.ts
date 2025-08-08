import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { EventType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
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

    return NextResponse.json({ events })

  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, date, type, location } = await request.json()
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

    // Validate input
    if (!title || !description || !date || !type) {
      return NextResponse.json(
        { error: 'Title, description, date, and type are required' },
        { status: 400 }
      )
    }

    // Validate event type
    if (!Object.values(EventType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        type: type as EventType,
        location: location || null,
      }
    })

    return NextResponse.json({
      message: 'Event created successfully',
      event
    }, { status: 201 })

  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 