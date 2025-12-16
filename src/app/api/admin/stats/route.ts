import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get overall stats
    const [
      totalUsers,
      totalDeposits,
      totalWaste,
      totalPoints,
      totalVouchers,
      todayDeposits,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.wasteDeposit.count(),
      prisma.wasteDeposit.aggregate({ _sum: { amount: true } }),
      prisma.user.aggregate({ _sum: { points: true } }),
      prisma.voucher.count(),
      prisma.wasteDeposit.count({
        where: {
          depositDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Get waste type distribution
    const wasteByType = await prisma.wasteDeposit.groupBy({
      by: ['wasteType'],
      _sum: { amount: true },
      _count: { id: true },
    });

    // Get user level distribution
    const usersByLevel = await prisma.user.groupBy({
      by: ['level'],
      _count: { id: true },
      where: { role: 'USER' },
    });

    // Get recent deposits
    const recentDeposits = await prisma.wasteDeposit.findMany({
      orderBy: { depositDate: 'desc' },
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalDeposits,
        totalWaste: totalWaste._sum.amount || 0,
        totalPoints: totalPoints._sum.points || 0,
        totalVouchers,
        todayDeposits,
      },
      wasteByType,
      usersByLevel,
      recentDeposits,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }
}
