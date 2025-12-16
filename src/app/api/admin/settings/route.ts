import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Default settings
const DEFAULT_SETTINGS = {
  pointsPerKg: {
    PLASTIC: 10,
    PAPER: 8,
    ORGANIC: 5,
    METAL: 15,
  },
  levelThresholds: {
    SILVER: 500,
    GOLD: 1000,
  },
  ecoTreeConfig: {
    claimXpThreshold: 1000,
    bonusPoints: 200,
  },
  voucherConfig: {
    expiryDays: 30,
  },
};

// GET - Load settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.appSettings.findUnique({
      where: { id: 'settings' },
    });

    if (!settings) {
      // Create default settings if not exists
      settings = await prisma.appSettings.create({
        data: {
          id: 'settings',
          config: DEFAULT_SETTINGS,
        },
      });
    }

    return NextResponse.json({ settings: settings.config });
  } catch (error) {
    console.error('Get settings error:', error);
    // Return default settings if DB error
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

// PUT - Save settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const settings = await prisma.appSettings.upsert({
      where: { id: 'settings' },
      update: { config: body },
      create: { id: 'settings', config: body },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved',
      settings: settings.config 
    });
  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
