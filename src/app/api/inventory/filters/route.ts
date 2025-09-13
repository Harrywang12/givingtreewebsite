import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all active and available inventory items to extract unique categories and conditions
    const items = await prisma.inventoryItem.findMany({
      where: {
        isActive: true,
        isAvailable: true
      },
      select: {
        category: true,
        condition: true
      }
    })

    // Extract unique categories and conditions
    const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean))).sort()
    const conditions = Array.from(new Set(items.map(item => item.condition).filter(Boolean))).sort()

    return NextResponse.json({ 
      categories,
      conditions
    })

  } catch (error) {
    console.error('Get inventory filters error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
