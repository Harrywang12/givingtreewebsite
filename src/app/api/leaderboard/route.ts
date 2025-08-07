import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Try to get from cache first
    const cacheKey = `leaderboard:${limit}:${offset}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    // Get top donors by total donated amount
    const topDonors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        totalDonated: true,
        itemsDonated: true,
        memberSince: true,
        _count: {
          select: {
            donations: {
              where: {
                status: 'COMPLETED'
              }
            },
            itemDonations: {
              where: {
                status: 'SOLD'
              }
            }
          }
        }
      },
      where: {
        totalDonated: {
          gt: 0
        }
      },
      orderBy: {
        totalDonated: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Add rank to each donor
    const donorsWithRank = topDonors.map((donor, index) => ({
      ...donor,
      rank: offset + index + 1
    }))

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: {
        totalDonated: {
          gt: 0
        }
      }
    })

    // Get overall statistics
    const stats = await prisma.$transaction([
      prisma.user.aggregate({
        _sum: {
          totalDonated: true
        },
        _count: {
          id: true
        }
      }),
      prisma.itemDonation.aggregate({
        _count: {
          id: true
        },
        where: {
          status: 'SOLD'
        }
      }),
      prisma.donation.aggregate({
        _count: {
          id: true
        },
        where: {
          status: 'COMPLETED'
        }
      })
    ])

    const overallStats = {
      totalRaised: stats[0]._sum.totalDonated || 0,
      totalDonors: stats[0]._count.id,
      totalItemsSold: stats[1]._count.id,
      totalDonations: stats[2]._count.id
    }

    const result = {
      donors: donorsWithRank,
      stats: overallStats,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    }

    // Cache for 5 minutes
    await cache.set(cacheKey, result, 300)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 