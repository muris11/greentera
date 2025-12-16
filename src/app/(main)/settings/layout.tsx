import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pengaturan - Greentera | Kelola Preferensi Akun Anda',
  description: 'Atur preferensi akun, notifikasi, dan pengaturan pribadi Anda di Greentera.',
  keywords: ['pengaturan', 'settings', 'preferensi akun'],
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
