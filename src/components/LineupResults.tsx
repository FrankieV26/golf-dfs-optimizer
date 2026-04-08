'use client';

import { Lineup } from '@/lib/types';
import { useState } from 'react';
import { useToast } from './Toast';

interface Props {
  lineups: Lineup[];
  elapsed_ms?: number;
}

export default function LineupResults({ lineups, elapsed_ms }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [showCount, setShowCount] = useState(10);
  const { toast } = useToast();

  if (lineups.length === 0) return null;

  const exportCSV = () => {
    const headers = ['Rank', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'Salary', 'FPPG'];
    const rows = lineups.map((l, i) => [
      i + 1,
      ...l.golfers.map((g) => `${g.name} ($${g.salary})`),
      l.totalSalary,
      l.totalFppg.toFixed(1),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'golf-dfs-lineups.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${lineups.length} lineups as CSV`, 'success');
  };

  const exportDK = () => {
    const headerRow = 'G,G,G,G,G,G';
    const rows = lineups.map((l) =>
      l.golfers.map((g) => `"${g.name}"`).join(',')
    );
    const csv = [headerRow, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dk-upload-lineups.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${lineups.length} lineups for DK upload`, 'success');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {lineups.length} Optimized Lineup{lineups.length !== 1 ? 's' : ''}
          </h2>
          {elapsed_ms != null && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Generated in {elapsed_ms}ms</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-600 active:scale-95 transition-all shadow-sm dark:shadow-gray-950/20"
          >
            Export CSV
          </button>
          <button
            onClick={exportDK}
            className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 active:scale-95 transition-all shadow-sm dark:shadow-gray-950/20"
          >
            Export for DK
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {lineups.slice(0, showCount).map((lineup, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-950/20 transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 text-left transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-8 tabular-nums">#{i + 1}</span>
                <span className="font-semibold tabular-nums">{lineup.totalFppg.toFixed(1)} pts</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                  ${lineup.totalSalary.toLocaleString()}
                </span>
                {/* Mini golfer preview when collapsed */}
                {expanded !== i && (
                  <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500 truncate max-w-[300px]">
                    {lineup.golfers.map(g => g.name.split(' ').pop()).join(', ')}
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expanded === i && (
              <div className="px-4 pb-3 bg-gray-50/50 dark:bg-gray-800/50 animate-expand">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      <th className="text-left py-1.5">#</th>
                      <th className="text-left py-1.5">Golfer</th>
                      <th className="text-right py-1.5">Salary</th>
                      <th className="text-right py-1.5">FPPG</th>
                      <th className="text-right py-1.5">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineup.golfers.map((g, gi) => (
                      <tr key={g.id} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium w-6">{gi + 1}</td>
                        <td className="py-1.5 font-medium">{g.name}</td>
                        <td className="text-right font-mono">${g.salary.toLocaleString()}</td>
                        <td className="text-right font-mono">{g.fppg.toFixed(1)}</td>
                        <td className="text-right font-mono text-gray-600 dark:text-gray-400">{g.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                    <tr>
                      <td className="py-1.5"></td>
                      <td className="py-1.5">Total</td>
                      <td className="text-right font-mono">${lineup.totalSalary.toLocaleString()}</td>
                      <td className="text-right font-mono">{lineup.totalFppg.toFixed(1)}</td>
                      <td className="text-right font-mono">{lineup.totalValue.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {lineups.length > showCount && (
        <button
          onClick={() => setShowCount((c) => c + 10)}
          className="mt-4 w-full py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.99] transition-all shadow-sm dark:shadow-gray-950/20"
        >
          Show More ({lineups.length - showCount} remaining)
        </button>
      )}
    </div>
  );
}
