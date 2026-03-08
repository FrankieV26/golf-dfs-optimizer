import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'BirdieLine - Free Golf DFS Lineup Optimizer for DraftKings & FanDuel',
    template: '%s | BirdieLine',
  },
  description:
    'Free golf DFS lineup optimizer for DraftKings and FanDuel. Generate optimal PGA lineups with advanced analytics, ownership projections, and course-fit scoring. Updated weekly for every tournament.',
  keywords: [
    'golf DFS optimizer',
    'DraftKings golf optimizer',
    'FanDuel golf optimizer',
    'PGA DFS lineup optimizer',
    'golf fantasy lineup generator',
    'DFS golf picks',
    'PGA DFS projections',
    'golf DFS tools free',
    'DraftKings PGA lineup',
    'FanDuel PGA lineup',
  ],
  openGraph: {
    title: 'BirdieLine - Free Golf DFS Lineup Optimizer',
    description:
      'Generate optimal DraftKings & FanDuel golf lineups in seconds. Free optimizer with advanced analytics.',
    type: 'website',
    locale: 'en_US',
    siteName: 'BirdieLine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BirdieLine - Free Golf DFS Lineup Optimizer',
    description:
      'Generate optimal DraftKings & FanDuel golf lineups in seconds.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
