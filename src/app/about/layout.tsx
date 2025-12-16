import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami - Greentera | Platform Pengelolaan Sampah Digital',
  description: 'Pelajari tentang Greentera, platform pengelolaan sampah digital dengan sistem poin dan gamifikasi.',
  keywords: ['tentang greentera', 'misi lingkungan', 'waste management'],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
