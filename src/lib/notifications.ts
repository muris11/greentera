import prisma from '@/lib/prisma';

type NotificationType =
  | 'POINTS_EARNED'
  | 'LEVEL_UP'
  | 'VOUCHER_REDEEMED'
  | 'TREE_GROWN'
  | 'QUIZ_COMPLETED'
  | 'SYSTEM'
  | 'ADMIN_ANNOUNCEMENT';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl,
      },
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

export async function createPointsNotification(
  userId: string,
  points: number,
  source: string
) {
  return createNotification({
    userId,
    type: 'POINTS_EARNED',
    title: `+${points} Poin Diperoleh! 🎉`,
    message: `Anda mendapatkan ${points} poin dari ${source}.`,
    actionUrl: '/dashboard',
  });
}

export async function createLevelUpNotification(
  userId: string,
  newLevel: string
) {
  const levelEmoji: Record<string, string> = {
    BRONZE: '🥉',
    SILVER: '🥈',
    GOLD: '🥇',
  };
  return createNotification({
    userId,
    type: 'LEVEL_UP',
    title: `Naik Level! ${levelEmoji[newLevel] || '🏆'}`,
    message: `Selamat! Anda sekarang berada di level ${newLevel}.`,
    actionUrl: '/profile',
  });
}

export async function createVoucherNotification(
  userId: string,
  voucherType: string,
  nominal: number
) {
  return createNotification({
    userId,
    type: 'VOUCHER_REDEEMED',
    title: 'Voucher Berhasil Ditukar! 🎁',
    message: `Anda telah menukarkan voucher ${voucherType} senilai Rp ${nominal.toLocaleString('id-ID')}.`,
    actionUrl: '/voucher',
  });
}

export async function createTreeGrownNotification(
  userId: string,
  treesGrown: number
) {
  return createNotification({
    userId,
    type: 'TREE_GROWN',
    title: 'Pohon Berhasil Ditanam! 🌳',
    message: `Selamat! Anda telah menanam pohon ke-${treesGrown}. Teruslah berkontribusi untuk bumi!`,
    actionUrl: '/tree',
  });
}

export async function createQuizNotification(
  userId: string,
  isCorrect: boolean,
  points: number
) {
  return createNotification({
    userId,
    type: 'QUIZ_COMPLETED',
    title: isCorrect ? 'Jawaban Benar! ✅' : 'Kuis Selesai 📝',
    message: isCorrect
      ? `Hebat! Anda mendapatkan ${points} poin dari kuis.`
      : 'Teruslah belajar untuk meningkatkan pengetahuan lingkungan Anda.',
    actionUrl: '/education',
  });
}
