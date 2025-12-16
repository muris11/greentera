import { Providers } from '@/components/providers/Providers';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Greentera - Digital Waste Management & Rewards',
  description: 'Kelola sampah dan dapatkan reward dengan Greentera. Platform pengelolaan limbah ramah lingkungan dengan sistem poin dan gamifikasi.',
  keywords: ['waste management', 'sampah', 'recycle', 'eco-friendly', 'rewards', 'green'],
  authors: [{ name: 'Greentera Team' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Greentera - Digital Waste Management & Rewards',
    description: 'Platform pengelolaan limbah ramah lingkungan dengan sistem poin dan gamifikasi.',
    type: 'website',
    locale: 'id_ID',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <Providers>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
