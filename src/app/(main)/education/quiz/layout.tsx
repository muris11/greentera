import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kuis Edukasi - Greentera | Tes Pengetahuan dan Dapatkan Poin',
  description: 'Ikuti kuis edukasi lingkungan dan dapatkan poin bonus di Greentera!',
  keywords: ['kuis lingkungan', 'edukasi sampah', 'quiz poin'],
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
