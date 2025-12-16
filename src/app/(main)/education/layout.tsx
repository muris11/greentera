import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edukasi Lingkungan - Greentera | Belajar Daur Ulang dan Zero Waste',
  description: 'Pelajari cara daur ulang, mengurangi sampah, dan hidup ramah lingkungan. Kuis interaktif dengan hadiah poin!',
  keywords: ['edukasi lingkungan', 'daur ulang', 'zero waste', 'tips sampah', 'kuis lingkungan'],
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
