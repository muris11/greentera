import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Greentera | Kelola Sampah dan Dapatkan Poin',
  description: 'Lihat statistik poin, riwayat setoran sampah, dan progress eco tree Anda di dashboard Greentera.',
  keywords: ['dashboard', 'greentera', 'statistik sampah', 'poin sampah', 'eco tree'],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
