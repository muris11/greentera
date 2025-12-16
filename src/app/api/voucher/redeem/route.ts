import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Legacy config for backwards compatibility
const LEGACY_VOUCHER_CONFIG: Record<string, { points: number; nominal: number }> = {
  PULSA_10K: { points: 100, nominal: 10000 },
  PULSA_20K: { points: 200, nominal: 20000 },
  PULSA_50K: { points: 500, nominal: 50000 },
  DISCOUNT_10: { points: 50, nominal: 10 },
  DISCOUNT_25: { points: 100, nominal: 25 },
  DISCOUNT_50: { points: 200, nominal: 50 },
};

const redeemSchema = z.object({
  templateId: z.string().optional(),
  voucherType: z.string().optional(), // Legacy support
}).refine(data => data.templateId || data.voucherType, {
  message: 'Either templateId or voucherType is required',
});

function generateVoucherCode(): string {
  return 'GT-' + randomBytes(4).toString('hex').toUpperCase();
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
    const validation = redeemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { templateId, voucherType } = validation.data;

    // Get user points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let pointsCost: number;
    let nominal: number;
    let templateRef: string | null = null;
    let voucherTypeName: string;

    // Template-based redemption (new system)
    if (templateId) {
      const template = await prisma.voucherTemplate.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        return NextResponse.json(
          { error: 'Template tidak ditemukan' },
          { status: 404 }
        );
      }

      if (!template.isActive) {
        return NextResponse.json(
          { error: 'Voucher tidak tersedia' },
          { status: 400 }
        );
      }

      if (template.stock === 0) {
        return NextResponse.json(
          { error: 'Voucher habis' },
          { status: 400 }
        );
      }

      pointsCost = template.pointsCost;
      nominal = template.nominal;
      templateRef = template.id;
      voucherTypeName = template.name;

      // Decrement stock if not unlimited
      if (template.stock > 0) {
        await prisma.voucherTemplate.update({
          where: { id: templateId },
          data: { stock: { decrement: 1 } },
        });
      }
    } 
    // Legacy voucher type (backwards compatibility)
    else if (voucherType && LEGACY_VOUCHER_CONFIG[voucherType]) {
      const config = LEGACY_VOUCHER_CONFIG[voucherType];
      pointsCost = config.points;
      nominal = config.nominal;
      voucherTypeName = voucherType;
    } else {
      return NextResponse.json(
        { error: 'Invalid voucher type' },
        { status: 400 }
      );
    }

    // Check if user has enough points
    if (user.points < pointsCost) {
      return NextResponse.json(
        { error: `Poin tidak cukup. Butuh ${pointsCost}, saat ini ${user.points}` },
        { status: 400 }
      );
    }

    // Generate unique voucher code
    let voucherCode = generateVoucherCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.voucher.findUnique({
        where: { voucherCode },
      });
      if (!existing) break;
      voucherCode = generateVoucherCode();
      attempts++;
    }

    // Get settings for expiry days
    let expiryDays = 30; // default
    try {
      const settings = await prisma.appSettings.findUnique({
        where: { id: 'settings' },
      });
      if (settings?.config && (settings.config as any).voucherConfig?.expiryDays) {
        expiryDays = (settings.config as any).voucherConfig.expiryDays;
      }
    } catch {}

    // Use transaction for atomicity
    const [voucher] = await prisma.$transaction([
      prisma.voucher.create({
        data: {
          userId: session.user.id,
          voucherCode,
          pointsUsed: pointsCost,
          nominal,
          isRedeemed: false,
          expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
          templateId: templateRef,
          // voucherType is optional now - only set if using legacy
          ...(voucherType && !templateId ? { voucherType: voucherType as any } : {}),
        },
        include: {
          template: { select: { name: true, icon: true } },
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          points: user.points - pointsCost,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Voucher berhasil ditukar',
      id: voucher.id,
      voucherCode: voucher.voucherCode,
      nominal: voucher.nominal,
      template: voucher.template,
      expiresAt: voucher.expiresAt,
      remainingPoints: user.points - pointsCost,
    });
  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
