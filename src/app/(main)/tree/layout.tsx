import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eco Tree - Greentera | Tanam Pohon Virtual dengan Poin Sampah',
  description: 'Kembangkan pohon virtual Anda dengan poin sampah. Gamifikasi lingkungan yang menyenangkan!',
  keywords: ['eco tree', 'pohon virtual', 'gamifikasi', 'tanam pohon', 'reward lingkungan'],
};

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
