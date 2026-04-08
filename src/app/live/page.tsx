'use client';

import { useState, useEffect, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface LeaderboardEntry {
  player_name: string;
  position: string;
  total: number;
  today: number;
  thru: number | string;
  current_round: number;
  r1: number | null;
  r2: number | null;
  r3: number | null;
  r4: number | null;
  sg_total: number | null;
}

interface NextTournament {
  name: string;
  startTime: string;
  location: string | null;
  courseSlug: string | null;
  courseName: string | null;
}

interface LiveData {
  event_name: string | null;
  last_updated: string;
  leaderboard: LeaderboardEntry[];
  nextTournament: NextTournament | null;
}

function scoreColor(score: number): string {
  if (score < 0) return 'text-green-700';
  if (score > 0) return 'text-red-600';
  return 'text-gray-600';
}

function formatScore(score: number | null): string {
  if (score == null) return '-';
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

function formatRound(score: number | null): string {
  if (score == null) return '-';
  return String(score);
}

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) return;

    function update() {
      const now = Date.now();
      const target = new Date(targetDate!).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Starting now');
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);
      setTimeLeft(parts.join(' '));
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function LivePage() {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/live');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 60_000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const nextTournament = data?.nextTournament ?? null;
  const tournamentStarted = nextTournament
    ? new Date(nextTournament.startTime).getTime() <= Date.now()
    : true;
  const hasLeaderboard = data && data.leaderboard.length > 0 && tournamentStarted;
  const showCountdown = !loading && nextTournament && !tournamentStarted;
  const countdown = useCountdown(nextTournament?.startTime ?? null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <NavBar maxWidth="max-w-6xl" />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100">Live Leaderboard</h1>
            {data?.event_name && (
              <p className="text-gray-500 dark:text-gray-400 mt-1">{data.event_name}</p>
            )}
          </div>
          {data && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Last Refreshed: {new Date(data.last_updated).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <table className="min-w-[800px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Pos', 'Player', 'Total', 'Today', 'Thru', 'R1', 'R2', 'R3', 'R4', 'SG Total'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {Array.from({ length: 20 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2.5"><div className="h-4 w-8 rounded animate-shimmer" /></td>
                    <td className="px-3 py-2.5"><div className="h-4 w-36 rounded animate-shimmer" /></td>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-3 py-2.5"><div className="h-4 w-10 rounded animate-shimmer" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Countdown */}
        {showCountdown && nextTournament && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              Next Up: <span className="font-semibold">{nextTournament.name}</span>
            </p>
            {nextTournament.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{nextTournament.location}</p>
            )}
            {nextTournament.courseSlug ? (
              <a
                href={`/courses/${nextTournament.courseSlug}`}
                className="text-sm text-green-700 hover:underline"
              >
                {nextTournament.courseName} →
              </a>
            ) : nextTournament.courseName ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{nextTournament.courseName}</p>
            ) : null}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 mb-6">
              {new Date(nextTournament.startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short',
              })}
            </p>
            <div className="text-4xl font-bold text-green-700 tabular-nums font-mono">
              {countdown}
            </div>
            <p className="text-xs text-gray-400 mt-2">until Round 1 tee times</p>
          </div>
        )}

        {/* No tournament */}
        {!loading && !hasLeaderboard && !showCountdown && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm">
            <div className="text-gray-300 dark:text-gray-600 mb-4 flex justify-center">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1.5">No tournament in progress</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The live leaderboard is available Thursday through Sunday during PGA Tour events.
            </p>
          </div>
        )}

        {/* Leaderboard */}
        {!loading && hasLeaderboard && data && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm max-h-[75vh] overflow-y-auto">
            <table className="min-w-[800px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase w-16 sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    Pos
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    Player
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    Total
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    Today
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    Thru
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    R1
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    R2
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    R3
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    R4
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                    SG Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.leaderboard.map((p, i) => {
                  const isMC =
                    p.position === 'MC' || p.position === 'WD' || p.position === 'CUT';
                  return (
                    <tr
                      key={`${p.player_name}-${i}`}
                      className={`transition-colors ${isMC ? 'opacity-40' : 'hover:bg-gray-50/80'}`}
                    >
                      <td className="px-3 py-2 font-bold text-gray-700 dark:text-gray-300 font-mono">
                        {p.position}
                      </td>
                      <td className="px-3 py-2 font-medium whitespace-nowrap">
                        {p.player_name}
                      </td>
                      <td className={`px-3 py-2 text-right font-semibold font-mono ${scoreColor(p.total)}`}>
                        {formatScore(p.total)}
                      </td>
                      <td className={`px-3 py-2 text-right font-mono ${scoreColor(p.today)}`}>
                        {formatScore(p.today)}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400 font-mono">
                        {p.thru === 18 || p.thru === 'F' ? 'F' : p.thru}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 font-mono">{formatRound(p.r1)}</td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 font-mono">{formatRound(p.r2)}</td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 font-mono">{formatRound(p.r3)}</td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 font-mono">{formatRound(p.r4)}</td>
                      <td className="px-3 py-2 text-right font-mono">
                        {p.sg_total != null ? (
                          <span
                            className={`font-medium ${
                              p.sg_total >= 0 ? 'text-green-700' : 'text-red-600'
                            }`}
                          >
                            {p.sg_total >= 0 ? '+' : ''}
                            {p.sg_total.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mt-4 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
