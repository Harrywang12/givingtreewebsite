import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction, ADMIN_SECURITY_HEADERS } from '@/lib/admin';
import { uploadImage } from '@/lib/supabase';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const items = await prisma.inventoryItem.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      items: items,
      count: items.length
    });

  } catch (error) {
    logger.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('imageFile') as File;

    // Validate required fields
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    let imageUrl = '';

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadImage(imageFile, 'inventory');
      } catch (imageError) {
        logger.error('Image upload error:', imageError);
        // Continue without image if upload fails
      }
    }

    // Generate a random name
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const randomName = `Image_${timestamp}`;
    
    // Create inventory item
    const item = await prisma.inventoryItem.create({
      data: {
        name: randomName,
        description: null,
        category: null,
        condition: null,
        imageUrl: imageUrl || null
      }
    });

    // Log admin action
    await logAdminAction(admin.id, 'INVENTORY_ITEM_CREATE', 'inventory', {
      itemId: item.id,
      itemName: randomName
    });

    return NextResponse.json({ 
      item: item,
      message: 'Inventory item added successfully'
    });

  } catch (error) {
    logger.error('Create inventory item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}
