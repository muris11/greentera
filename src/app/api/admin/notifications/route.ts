import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all notifications (admin view)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');

    const where = type ? { type: type as any } : {};

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ]);

    const stats = await prisma.notification.groupBy({
      by: ['type'],
      _count: { id: true },
    });

    return NextResponse.json({
      notifications,
      total,
      stats: stats.reduce((acc, s) => ({ ...acc, [s.type]: s._count.id }), {}),
    });
  } catch (error) {
    console.error('Admin notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Send announcement to all users (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, message, targetUserIds } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    let userIds: string[] = targetUserIds;

    // If no specific users targeted, send to all users
    if (!userIds || userIds.length === 0) {
      const allUsers = await prisma.user.findMany({
        where: { role: 'USER' },
        select: { id: true },
      });
      userIds = allUsers.map(u => u.id);
    }

    // Create notifications for all targeted users
    const notifications = await prisma.notification.createMany({
      data: userIds.map(userId => ({
        userId,
        type: 'ADMIN_ANNOUNCEMENT' as const,
        title,
        message,
        isRead: false,
      })),
    });

    return NextResponse.json({
      success: true,
      count: notifications.count,
    });
  } catch (error) {
    console.error('Admin announcement error:', error);
    return NextResponse.json(
      { error: 'Failed to send announcement' },
      { status: 500 }
    );
  }
}
