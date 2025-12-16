import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const CLAIM_BONUS_POINTS = 200;
const CLAIM_XP_THRESHOLD = 1000;

export async function POST(request: NextRequest) {
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
        points: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if can claim
    if (user.ecoXp < CLAIM_XP_THRESHOLD) {
      return NextResponse.json(
        { error: `Eco XP belum cukup. Butuh ${CLAIM_XP_THRESHOLD}, saat ini ${user.ecoXp}` },
        { status: 400 }
      );
    }

    if (user.treeStage === 'SEED') {
      return NextResponse.json(
        { error: 'Pohon belum tumbuh. Kumpulkan Eco XP untuk menumbuhkan pohon.' },
        { status: 400 }
      );
    }

    // Calculate new level based on new points
    const newPoints = user.points + CLAIM_BONUS_POINTS;
    let newLevel: 'BRONZE' | 'SILVER' | 'GOLD' = 'BRONZE';
    if (newPoints >= 1000) newLevel = 'GOLD';
    else if (newPoints >= 500) newLevel = 'SILVER';

    // Claim tree - reset XP and stage, increment trees grown
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ecoXp: 0,
        treeStage: 'SEED',
        treesGrown: user.treesGrown + 1,
        points: newPoints,
        level: newLevel,
      },
      select: {
        points: true,
        treesGrown: true,
        ecoXp: true,
        treeStage: true,
        level: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Selamat! Anda berhasil menanam pohon dan mendapat +${CLAIM_BONUS_POINTS} poin bonus!`,
      bonusPoints: CLAIM_BONUS_POINTS,
      newStats: updatedUser,
    });
  } catch (error) {
    console.error('Claim error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
