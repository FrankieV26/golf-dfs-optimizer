import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ToastProvider } from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  metadataBase: new URL('https://birdievantage.com'),
  title: {
    default: 'BirdieVantage - Free Golf DFS Lineup Optimizer for DraftKings & FanDuel',
    template: '%s | BirdieVantage',
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BirdieVantage - Free Golf DFS Lineup Optimizer',
    description:
      'Generate optimal DraftKings & FanDuel golf lineups in seconds. Free optimizer with advanced analytics.',
    type: 'website',
    locale: 'en_US',
    siteName: 'BirdieVantage',
    url: 'https://birdievantage.com',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'BirdieVantage - Free Golf DFS Lineup Optimizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BirdieVantage - Free Golf DFS Lineup Optimizer',
    description:
      'Generate optimal DraftKings & FanDuel golf lineups in seconds.',
    images: ['/api/og'],
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BirdieVantage',
  url: 'https://birdievantage.com',
  description:
    'Free golf DFS lineup optimizer for DraftKings and FanDuel. Generate optimal PGA lineups with advanced analytics, ownership projections, and course-fit scoring.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://birdievantage.com/golfers/{search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BirdieVantage',
  url: 'https://birdievantage.com',
  description:
    'Free golf DFS lineup optimizer with course-fit scoring, Monte Carlo simulation, and ownership-aware optimization.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC: apply dark class before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('bv-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
