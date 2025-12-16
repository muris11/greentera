import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Default settings (fallback if DB not available)
const DEFAULT_WASTE_POINTS: Record<string, number> = {
  ORGANIC: 5,
  PLASTIC: 10,
  METAL: 15,
  PAPER: 8,
};

const DEFAULT_LEVEL_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 1000,
};

// XP multiplier
const XP_MULTIPLIER = 2;

// Tree stage thresholds
const TREE_STAGE_THRESHOLDS = {
  SEED: 0,
  SPROUT: 200,
  SMALL: 400,
  MEDIUM: 600,
  LARGE: 800,
};

const depositSchema = z.object({
  wasteType: z.enum(['ORGANIC', 'PLASTIC', 'METAL', 'PAPER']),
  amount: z.number().min(0.1, 'Berat minimal 0.1 kg'),
  scanMethod: z.enum(['MANUAL', 'AI_SCAN']).default('MANUAL'),
});

// Get settings from database
async function getSettings() {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: 'settings' },
    });
    return settings?.config as any || null;
  } catch {
    return null;
  }
}

function calculateLevel(points: number, thresholds: typeof DEFAULT_LEVEL_THRESHOLDS): 'BRONZE' | 'SILVER' | 'GOLD' {
  if (points >= thresholds.GOLD) return 'GOLD';
  if (points >= thresholds.SILVER) return 'SILVER';
  return 'BRONZE';
}

function calculateTreeStage(ecoXp: number): 'SEED' | 'SPROUT' | 'SMALL' | 'MEDIUM' | 'LARGE' {
  if (ecoXp >= TREE_STAGE_THRESHOLDS.LARGE) return 'LARGE';
  if (ecoXp >= TREE_STAGE_THRESHOLDS.MEDIUM) return 'MEDIUM';
  if (ecoXp >= TREE_STAGE_THRESHOLDS.SMALL) return 'SMALL';
  if (ecoXp >= TREE_STAGE_THRESHOLDS.SPROUT) return 'SPROUT';
  return 'SEED';
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = depositSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { wasteType, amount, scanMethod } = validation.data;

    // Get settings from database
    const settings = await getSettings();
    const wastePoints = settings?.pointsPerKg || DEFAULT_WASTE_POINTS;
    const levelThresholds = settings?.levelThresholds || DEFAULT_LEVEL_THRESHOLDS;

    // Calculate points and XP
    const pointsEarned = Math.round(amount * (wastePoints[wasteType] || DEFAULT_WASTE_POINTS[wasteType]));
    const ecoXpEarned = pointsEarned * XP_MULTIPLIER;

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        points: true,
        totalWaste: true,
        ecoXp: true,
        lastDepositDate: true,
        streak: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate new values
    const newPoints = user.points + pointsEarned;
    const newTotalWaste = user.totalWaste + amount;
    const newEcoXp = user.ecoXp + ecoXpEarned;
    const newLevel = calculateLevel(newPoints, { BRONZE: 0, SILVER: levelThresholds.SILVER || 500, GOLD: levelThresholds.GOLD || 1000 });
    const newTreeStage = calculateTreeStage(newEcoXp);

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDeposit = user.lastDepositDate ? new Date(user.lastDepositDate) : null;
    let newStreak = user.streak;

    if (lastDeposit) {
      lastDeposit.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastDeposit.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
      // If same day, keep streak
    } else {
      newStreak = 1;
    }

    // Use transaction to ensure data consistency
    const [deposit] = await prisma.$transaction([
      prisma.wasteDeposit.create({
        data: {
          userId: session.user.id,
          wasteType,
          amount,
          pointsEarned,
          ecoXpEarned,
          scanMethod,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          points: newPoints,
          totalWaste: newTotalWaste,
          ecoXp: newEcoXp,
          level: newLevel,
          treeStage: newTreeStage,
          streak: newStreak,
          lastDepositDate: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Setoran berhasil dicatat',
      deposit: {
        id: deposit.id,
        wasteType,
        amount,
        pointsEarned,
        ecoXpEarned,
      },
      newStats: {
        points: newPoints,
        totalWaste: newTotalWaste,
        ecoXp: newEcoXp,
        level: newLevel,
        treeStage: newTreeStage,
        streak: newStreak,
      },
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
