import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const condition = searchParams.get('condition')
    const search = searchParams.get('search')

    const whereClause: {
      isActive: boolean;
      isAvailable: boolean;
      category?: string;
      condition?: string;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      isActive: true,
      isAvailable: true
    }

    if (category) {
      whereClause.category = category
    }

    if (condition) {
      whereClause.condition = condition
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const items = await prisma.inventoryItem.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      items: items,
      count: items.length
    })

  } catch (error) {
    console.error('Get inventory error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
