import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { 
      itemDescription, 
      itemCondition, 
      estimatedValue, 
      pickupPreference, 
      additionalNotes,
      images 
    } = await request.json()
    
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
    if (!itemDescription || !itemCondition) {
      return NextResponse.json(
        { error: 'Item description and condition are required' },
        { status: 400 }
      )
    }

    // Create item donation
    const itemDonation = await prisma.itemDonation.create({
      data: {
        userId: decoded.userId,
        itemDescription,
        itemCondition,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        pickupPreference,
        additionalNotes: additionalNotes || null,
        images: images || [],
        status: 'PENDING',
      }
    })

    // Update user's items donated count
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        itemsDonated: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      message: 'Item donation created successfully',
      itemDonation
    }, { status: 201 })

  } catch (error) {
    console.error('Item donation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    // Get user's item donations
    const itemDonations = await prisma.itemDonation.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ itemDonations })

  } catch (error) {
    console.error('Get item donations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 