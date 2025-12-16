import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Greentera | Panel Administrasi',
  description: 'Panel admin Greentera untuk mengelola pengguna, setoran, voucher, dan konten edukasi.',
  keywords: ['admin', 'dashboard', 'panel admin', 'kelola greentera'],
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
