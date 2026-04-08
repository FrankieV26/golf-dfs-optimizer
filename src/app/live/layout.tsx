import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Tournament Leaderboard | BirdieVantage',
  description:
    'Live PGA Tour leaderboard with real-time scores, positions, and strokes-gained data. Auto-refreshes every 60 seconds during active rounds.',
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
