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

    // Get top donors by monetary donations only
    const topDonors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        memberSince: true,
        donations: {
          where: {
            status: {
              in: ['PENDING', 'PROCESSING', 'COMPLETED']
            },
            type: 'MONETARY'
          },
          select: {
            amount: true
          }
        }
      },
      where: {
        donations: {
          some: {
            status: {
              in: ['PENDING', 'PROCESSING', 'COMPLETED']
            },
            type: 'MONETARY',
            amount: {
              gt: 0
            }
          }
        }
      },
      orderBy: {
        totalDonated: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Calculate total monetary donations and add rank to each donor
    const donorsWithRank = topDonors
      .map((donor) => {
        const totalDonated = donor.donations.reduce((sum, donation) => sum + donation.amount, 0);
        return {
          id: donor.id,
          name: donor.name,
          totalDonated,
          itemsDonated: 0, // Not shown on leaderboard anymore, but kept for interface compatibility
          memberSince: donor.memberSince,
          rank: 0 // Will be set after sorting
        };
      })
      .sort((a, b) => b.totalDonated - a.totalDonated)
      .map((donor, index) => ({
        ...donor,
        rank: offset + index + 1
      }))

    // Get total count for pagination (users with monetary donations)
    const totalCount = await prisma.user.count({
      where: {
        donations: {
          some: {
            status: {
              in: ['PENDING', 'PROCESSING', 'COMPLETED']
            },
            type: 'MONETARY',
            amount: {
              gt: 0
            }
          }
        }
      }
    })

    // Get overall statistics (monetary donations only)
    const stats = await prisma.$transaction([
      prisma.donation.aggregate({
        _sum: {
          amount: true
        },
        _count: {
          id: true
        },
        where: {
          status: {
            in: ['PENDING', 'PROCESSING', 'COMPLETED']
          },
          type: 'MONETARY'
        }
      }),
      prisma.user.count({
        where: {
          donations: {
            some: {
              status: {
                in: ['PENDING', 'PROCESSING', 'COMPLETED']
              },
              type: 'MONETARY',
              amount: {
                gt: 0
              }
            }
          }
        }
      }),
      prisma.itemDonation.aggregate({
        _count: {
          id: true
        },
        where: {
          status: 'SOLD'
        }
      })
    ])

    const overallStats = {
      totalRaised: stats[0]._sum.amount || 0,
      totalDonors: stats[1],
      totalItemsSold: stats[2]._count.id,
      totalDonations: stats[0]._count.id
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