import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan Sampah AI - Greentera | Klasifikasi Otomatis dengan Gemini',
  description: 'Scan sampah menggunakan kamera dan AI Gemini untuk klasifikasi otomatis. Dapatkan poin lebih cepat!',
  keywords: ['scan sampah', 'AI sampah', 'gemini', 'klasifikasi sampah', 'kamera sampah'],
};

export default function WasteScanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
