import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethod, notes } = await request.json()
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
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // Create donation
    const donation = await prisma.donation.create({
      data: {
        userId: decoded.userId,
        amount: parseFloat(amount),
        type: 'MONETARY',
        status: 'PENDING',
        paymentMethod: paymentMethod || null,
        notes: notes || null,
      }
    })

    // Update user's total donated
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        totalDonated: {
          increment: parseFloat(amount)
        }
      }
    })

    return NextResponse.json({
      message: 'Donation created successfully',
      donation
    }, { status: 201 })

  } catch (error) {
    console.error('Donation error:', error)
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

    // Get user's donations
    const donations = await prisma.donation.findMany({
      where: {
        userId: decoded.userId,
        type: 'MONETARY'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ donations })

  } catch (error) {
    console.error('Get donations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 