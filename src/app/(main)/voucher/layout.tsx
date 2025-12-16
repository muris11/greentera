import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tukar Voucher - Greentera | Redeem Poin Jadi Pulsa & E-Wallet',
  description: 'Tukarkan poin sampah Anda dengan voucher pulsa, e-wallet, dan diskon menarik di Greentera.',
  keywords: ['voucher', 'tukar poin', 'pulsa', 'e-wallet', 'rewards sampah'],
};

export default function VoucherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
