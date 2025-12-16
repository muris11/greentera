import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar - Greentera | Buat Akun Gratis Sekarang',
  description: 'Daftar gratis di Greentera dan mulai kumpulkan poin dari sampah daur ulang. Tukar dengan pulsa dan voucher!',
  keywords: ['daftar', 'register', 'buat akun', 'greentera gratis'],
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
