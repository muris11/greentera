import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Generate unique voucher code
function generateVoucherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'GT-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const now = new Date();
    
    let whereClause: any = {};
    if (status === 'redeemed') {
      whereClause.isRedeemed = true;
    } else if (status === 'active') {
      whereClause.isRedeemed = false;
      whereClause.expiresAt = { gt: now };
    } else if (status === 'expired') {
      whereClause.expiresAt = { lt: now };
    }

    const vouchers = await prisma.voucher.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true, points: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.voucher.count({ where: whereClause });

    const stats = await prisma.voucher.aggregate({
      _sum: { nominal: true, pointsUsed: true },
      _count: { id: true },
    });

    const redeemedCount = await prisma.voucher.count({ where: { isRedeemed: true } });

    // Also fetch users for the create form
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: { id: true, name: true, email: true, points: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      vouchers,
      users,
      total,
      stats: {
        totalVouchers: stats._count.id,
        totalValue: stats._sum.nominal || 0,
        totalPointsUsed: stats._sum.pointsUsed || 0,
        redeemedCount,
      },
    });
  } catch (error) {
    console.error('Admin vouchers error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}

// POST - Create new voucher
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, voucherType, nominal, pointsUsed, expiresAt, deductPoints } = body;

    if (!userId || !voucherType || !nominal || !pointsUsed) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user has enough points if deducting
    if (deductPoints) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      if (user.points < pointsUsed) {
        return NextResponse.json({ error: 'User does not have enough points' }, { status: 400 });
      }

      // Deduct points from user
      await prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: pointsUsed } },
      });
    }

    // Generate unique voucher code
    let voucherCode = generateVoucherCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.voucher.findUnique({ where: { voucherCode } });
      if (!existing) break;
      voucherCode = generateVoucherCode();
      attempts++;
    }

    const voucher = await prisma.voucher.create({
      data: {
        userId,
        voucherType,
        voucherCode,
        nominal: parseInt(nominal),
        pointsUsed: parseInt(pointsUsed),
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, voucher });
  } catch (error) {
    console.error('Create voucher error:', error);
    return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
  }
}

// PUT - Update voucher
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { voucherId, voucherType, nominal, pointsUsed, expiresAt, isRedeemed } = body;

    if (!voucherId) {
      return NextResponse.json({ error: 'Voucher ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (voucherType !== undefined) updateData.voucherType = voucherType;
    if (nominal !== undefined) updateData.nominal = parseInt(nominal);
    if (pointsUsed !== undefined) updateData.pointsUsed = parseInt(pointsUsed);
    if (expiresAt !== undefined) updateData.expiresAt = new Date(expiresAt);
    if (isRedeemed !== undefined) {
      updateData.isRedeemed = isRedeemed;
      if (isRedeemed) updateData.redeemedAt = new Date();
    }

    const voucher = await prisma.voucher.update({
      where: { id: voucherId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, voucher });
  } catch (error) {
    console.error('Update voucher error:', error);
    return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
  }
}

// DELETE - Delete voucher
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const voucherId = searchParams.get('id');

    if (!voucherId) {
      return NextResponse.json({ error: 'Voucher ID required' }, { status: 400 });
    }

    // Optional: Refund points to user if voucher not redeemed
    const voucher = await prisma.voucher.findUnique({ where: { id: voucherId } });
    if (voucher && !voucher.isRedeemed) {
      await prisma.user.update({
        where: { id: voucher.userId },
        data: { points: { increment: voucher.pointsUsed } },
      });
    }

    await prisma.voucher.delete({ where: { id: voucherId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete voucher error:', error);
    return NextResponse.json({ error: 'Failed to delete voucher' }, { status: 500 });
  }
}
