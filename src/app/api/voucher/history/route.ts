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

    const vouchers = await prisma.voucher.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        voucherType: true,
        voucherCode: true,
        nominal: true,
        pointsUsed: true,
        isRedeemed: true,
        redeemedAt: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error('Voucher history error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
