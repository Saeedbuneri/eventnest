import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import MockModeBanner from '@/components/ui/MockModeBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'EventNest – Find & Attend Local Events',
  description:
    'Discover, book, and manage local events with secure digital QR tickets. Concerts, sports, tech talks, college fests and more.',
  keywords: 'events, tickets, local events, QR tickets, event booking',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07070e',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <MockModeBanner />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
