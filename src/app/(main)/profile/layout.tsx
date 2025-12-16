import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Saya - Greentera | Kelola Akun dan Lihat Statistik',
  description: 'Lihat dan edit profil Anda, pantau statistik pengumpulan sampah dan poin di Greentera.',
  keywords: ['profil', 'akun', 'statistik pengguna', 'data sampah', 'pengaturan akun'],
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
