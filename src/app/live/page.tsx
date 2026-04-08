'use client';

import { useState, useEffect, useCallback } from 'react';

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

interface LiveData {
  event_name: string;
  last_updated: string;
  leaderboard: LeaderboardEntry[];
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

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 60_000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/">
            <img src="/logo.svg" alt="BirdieVantage" className="h-14 w-auto" />
          </a>
          <nav className="flex gap-6 text-sm">
            <a href="/optimizer" className="text-gray-600 hover:text-gray-800">
              Optimizer
            </a>
            <a href="/live" className="font-medium text-green-700">
              Live
            </a>
            <a href="/strategy" className="text-gray-600 hover:text-gray-800">
              Strategy
            </a>
            <a href="/scoring" className="text-gray-600 hover:text-gray-800">
              Scoring
            </a>
            <a href="/golfers" className="text-gray-600 hover:text-gray-800">
              Golfers
            </a>
            <a href="/courses" className="text-gray-600 hover:text-gray-800">
              Courses
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Live Leaderboard</h1>
            {data?.event_name && (
              <p className="text-gray-600 mt-1">{data.event_name}</p>
            )}
          </div>
          {data && (
            <p className="text-sm text-gray-500">
              Last Refreshed: {new Date(data.last_updated).toLocaleTimeString()}
            </p>
          )}
        </div>

        {loading && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-[800px] w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Pos', 'Player', 'Total', 'Today', 'Thru', 'R1', 'R2', 'R3', 'R4', 'SG Total'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 20 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2.5">
                      <div className="h-4 w-8 rounded bg-gray-200 animate-pulse" />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
                    </td>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-3 py-2.5">
                        <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No tournament currently in progress</p>
            <p className="text-sm">
              The live leaderboard is available Thursday through Sunday during PGA
              Tour events.
            </p>
          </div>
        )}

        {!loading && !error && data && data.leaderboard.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No tournament currently in progress</p>
            <p className="text-sm">
              The live leaderboard is available Thursday through Sunday during PGA
              Tour events.
            </p>
          </div>
        )}

        {!loading && data && data.leaderboard.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-[800px] w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-16">
                    Pos
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Player
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Today
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Thru
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    R1
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    R2
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    R3
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    R4
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    SG Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.leaderboard.map((p, i) => {
                  const isMC = p.position === 'MC' || p.position === 'WD' || p.position === 'CUT';
                  return (
                    <tr
                      key={`${p.player_name}-${i}`}
                      className={`${isMC ? 'opacity-50' : ''} ${i % 2 === 0 ? '' : 'bg-gray-50'}`}
                    >
                      <td className="px-3 py-1.5 font-bold text-gray-700">
                        {p.position}
                      </td>
                      <td className="px-3 py-1.5 font-medium whitespace-nowrap">
                        {p.player_name}
                      </td>
                      <td className={`px-3 py-1.5 font-semibold ${scoreColor(p.total)}`}>
                        {formatScore(p.total)}
                      </td>
                      <td className={`px-3 py-1.5 ${scoreColor(p.today)}`}>
                        {formatScore(p.today)}
                      </td>
                      <td className="px-3 py-1.5 text-gray-600">
                        {p.thru === 18 || p.thru === 'F' ? 'F' : p.thru}
                      </td>
                      <td className="px-3 py-1.5 text-gray-600">{formatRound(p.r1)}</td>
                      <td className="px-3 py-1.5 text-gray-600">{formatRound(p.r2)}</td>
                      <td className="px-3 py-1.5 text-gray-600">{formatRound(p.r3)}</td>
                      <td className="px-3 py-1.5 text-gray-600">{formatRound(p.r4)}</td>
                      <td className="px-3 py-1.5 text-right">
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
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
