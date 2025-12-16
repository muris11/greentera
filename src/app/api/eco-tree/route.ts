import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get user's eco tree data
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
        ecoXp: true,
        treeStage: true,
        treesGrown: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate if can claim (Eco XP >= 1000)
    const canClaim = user.ecoXp >= 1000;

    return NextResponse.json({
      ecoXp: user.ecoXp,
      treeStage: user.treeStage,
      treesGrown: user.treesGrown,
      canClaim,
    });
  } catch (error) {
    console.error('Eco tree error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
