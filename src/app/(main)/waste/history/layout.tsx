import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Riwayat Setoran - Greentera | History Deposit Sampah Anda',
  description: 'Lihat riwayat lengkap setoran sampah Anda beserta poin yang didapat di Greentera.',
  keywords: ['riwayat setoran', 'history sampah', 'deposit history'],
};

export default function WasteHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
