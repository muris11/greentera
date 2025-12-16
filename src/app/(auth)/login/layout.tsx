import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Greentera | Masuk ke Akun Anda',
  description: 'Masuk ke akun Greentera untuk mulai mengumpulkan poin dari sampah daur ulang.',
  keywords: ['login', 'masuk', 'greentera', 'akun'],
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
