import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction, ADMIN_SECURITY_HEADERS } from '@/lib/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const { id: itemId } = await params;
    const body = await request.json();
    const { name, description, price, category, condition, isAvailable, isActive } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Update inventory item
    const item = await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: price ? parseFloat(price) : null,
        category: category?.trim() || null,
        condition: condition?.trim() || null,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    // Log admin action
    await logAdminAction(admin.id, 'INVENTORY_ITEM_UPDATE', 'inventory', {
      itemId: item.id,
      itemName: item.name
    });

    return NextResponse.json({ 
      item: item,
      message: 'Inventory item updated successfully'
    });

  } catch (error) {
    console.error('Update inventory item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    const { id: itemId } = await params;

    // Soft delete by setting isActive to false
    const item = await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { isActive: false }
    });

    // Log admin action
    await logAdminAction(admin.id, 'INVENTORY_ITEM_DELETE', 'inventory', {
      itemId: item.id,
      itemName: item.name
    });

    return NextResponse.json({ 
      message: 'Inventory item removed successfully'
    });

  } catch (error) {
    console.error('Delete inventory item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}
