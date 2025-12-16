import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET - Get user profile
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
        image: true,
        location: true,
        points: true,
        level: true,
        totalWaste: true,
        treesGrown: true,
        ecoXp: true,
        treeStage: true,
        streak: true,
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

    // Get leaderboard rank
    const usersAbove = await prisma.user.count({
      where: { points: { gt: user.points }, role: 'USER' },
    });
    const rank = usersAbove + 1;

    return NextResponse.json({
      ...user,
      rank,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').optional(),
  location: z.string().min(3, 'Lokasi minimal 3 karakter').optional(),
});

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, location } = validation.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
