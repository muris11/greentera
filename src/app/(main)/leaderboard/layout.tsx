import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard - Greentera | Peringkat Pengguna Ramah Lingkungan',
  description: 'Lihat peringkat pengguna dengan poin terbanyak di Greentera. Bersaing jadi yang terbaik!',
  keywords: ['leaderboard', 'peringkat', 'top users', 'poin tertinggi', 'kompetisi lingkungan'],
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
