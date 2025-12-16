import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fitur Greentera | AI Scan, Voucher, Eco Tree, dan Leaderboard',
  description: 'Jelajahi fitur lengkap Greentera: AI Scan sampah, tukar poin ke voucher, dan gamifikasi lingkungan.',
  keywords: ['fitur greentera', 'AI scan sampah', 'eco tree', 'voucher poin'],
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
