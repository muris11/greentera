import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hubungi Kami - Greentera | Kontak dan Dukungan',
  description: 'Hubungi tim Greentera untuk pertanyaan, saran, atau dukungan teknis.',
  keywords: ['kontak', 'hubungi kami', 'dukungan greentera'],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
