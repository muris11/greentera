import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Setor Sampah - Greentera | Deposit Limbah Ramah Lingkungan',
  description: 'Setor sampah plastik, organik, kertas, dan logam. Dapatkan poin dan bantu lingkungan!',
  keywords: ['setor sampah', 'deposit limbah', 'sampah plastik', 'sampah organik', 'daur ulang'],
};

export default function WasteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
