import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        points: true,
        level: true,
        totalWaste: true,
        treesGrown: true,
        ecoXp: true,
        treeStage: true,
        streak: true,
        lastDepositDate: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get recent deposits
    const recentDeposits = await prisma.wasteDeposit.findMany({
      where: { userId: session.user.id },
      orderBy: { depositDate: 'desc' },
      take: 5,
      select: {
        id: true,
        wasteType: true,
        amount: true,
        pointsEarned: true,
        depositDate: true,
        scanMethod: true,
      },
    });

    // Calculate monthly stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyDeposits = await prisma.wasteDeposit.aggregate({
      where: {
        userId: session.user.id,
        depositDate: { gte: startOfMonth },
      },
      _count: { id: true },
      _sum: { pointsEarned: true },
    });

    // Count available (unredeemed) vouchers
    const availableVouchers = await prisma.voucher.count({
      where: {
        userId: session.user.id,
        isRedeemed: false,
      },
    });

    return NextResponse.json({
      user,
      recentDeposits,
      monthlyStats: {
        deposits: monthlyDeposits._count.id || 0,
        points: monthlyDeposits._sum.pointsEarned || 0,
      },
      availableVouchers,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
