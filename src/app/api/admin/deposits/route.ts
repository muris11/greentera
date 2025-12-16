import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const wasteType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause = wasteType ? { wasteType: wasteType as any } : {};

    const deposits = await prisma.wasteDeposit.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { depositDate: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.wasteDeposit.count({ where: whereClause });

    const stats = await prisma.wasteDeposit.aggregate({
      _sum: { amount: true, pointsEarned: true },
      _count: { id: true },
    });

    return NextResponse.json({
      deposits,
      total,
      stats: {
        totalDeposits: stats._count.id,
        totalWeight: stats._sum.amount || 0,
        totalPoints: stats._sum.pointsEarned || 0,
      },
    });
  } catch (error) {
    console.error('Admin deposits error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}
