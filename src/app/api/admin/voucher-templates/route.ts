import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - List all voucher templates
export async function GET() {
  try {
    const session = await auth();
    
    // For admin - return all, for users - return only active
    const isAdmin = session?.user?.role === 'ADMIN';
    
    const templates = await prisma.voucherTemplate.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { pointsCost: 'asc' },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Fetch templates error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST - Create new template (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon, category, nominal, pointsCost, stock, isActive } = body;

    if (!name || !nominal || !pointsCost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if name already exists
    const existing = await prisma.voucherTemplate.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: 'Template with this name already exists' }, { status: 400 });
    }

    const template = await prisma.voucherTemplate.create({
      data: {
        name,
        description: description || null,
        icon: icon || '🎁',
        category: category || 'PULSA',
        nominal: parseInt(nominal),
        pointsCost: parseInt(pointsCost),
        stock: stock !== undefined ? parseInt(stock) : -1,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Create template error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create template', details: message }, { status: 500 });
  }
}

// PUT - Update template (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, icon, category, nominal, pointsCost, stock, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (category !== undefined) updateData.category = category;
    if (nominal !== undefined) updateData.nominal = parseInt(nominal);
    if (pointsCost !== undefined) updateData.pointsCost = parseInt(pointsCost);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (isActive !== undefined) updateData.isActive = isActive;

    const template = await prisma.voucherTemplate.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

// DELETE - Delete template (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Check if template has vouchers
    const voucherCount = await prisma.voucher.count({ where: { templateId: id } });
    if (voucherCount > 0) {
      // Soft delete - just deactivate
      await prisma.voucherTemplate.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true, message: 'Template has vouchers, deactivated instead' });
    }

    await prisma.voucherTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
