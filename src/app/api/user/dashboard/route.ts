import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        totalDonated: true,
        itemsDonated: true,
        memberSince: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get recent donations (monetary)
    const recentDonations = await prisma.donation.findMany({
      where: {
        userId: decoded.userId,
        type: 'MONETARY'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Get recent item donations
    const recentItemDonations = await prisma.itemDonation.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Get donation statistics
    const donationStats = await prisma.$transaction([
      prisma.donation.aggregate({
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        },
        _count: {
          id: true
        }
      }),
      prisma.itemDonation.aggregate({
        where: {
          userId: decoded.userId,
          status: 'SOLD'
        },
        _count: {
          id: true
        }
      }),
      prisma.itemDonation.aggregate({
        where: {
          userId: decoded.userId,
          status: 'PENDING'
        },
        _count: {
          id: true
        }
      })
    ])

    const stats = {
      totalMonetary: donationStats[0]._sum.amount || 0,
      totalMonetaryDonations: donationStats[0]._count.id,
      totalItemsSold: donationStats[1]._count.id,
      pendingItems: donationStats[2]._count.id
    }

    return NextResponse.json({
      user,
      recentDonations,
      recentItemDonations,
      stats
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 