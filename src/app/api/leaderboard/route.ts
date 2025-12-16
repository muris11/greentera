import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const period = searchParams.get('period') || 'alltime'; // weekly, monthly, alltime

    // Calculate date filter based on period
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: monthAgo } };
    }

    const users = await prisma.user.findMany({
      where: {
        role: 'USER', // Exclude admins
        ...dateFilter,
      },
      orderBy: { points: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        image: true,
        level: true,
        points: true,
        treesGrown: true,
        totalWaste: true,
      },
    });

    // Add rank to each user
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({
      leaderboard: rankedUsers,
      period,
      total: rankedUsers.length,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
