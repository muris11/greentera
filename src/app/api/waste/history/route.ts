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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [deposits, total] = await Promise.all([
      prisma.wasteDeposit.findMany({
        where: { userId: session.user.id },
        orderBy: { depositDate: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          wasteType: true,
          amount: true,
          pointsEarned: true,
          ecoXpEarned: true,
          scanMethod: true,
          depositDate: true,
        },
      }),
      prisma.wasteDeposit.count({
        where: { userId: session.user.id },
      }),
    ]);

    // Calculate totals
    const totals = await prisma.wasteDeposit.aggregate({
      where: { userId: session.user.id },
      _sum: {
        amount: true,
        pointsEarned: true,
      },
      _count: { id: true },
    });

    return NextResponse.json({
      deposits,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      totals: {
        count: totals._count.id || 0,
        weight: totals._sum.amount || 0,
        points: totals._sum.pointsEarned || 0,
      },
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
