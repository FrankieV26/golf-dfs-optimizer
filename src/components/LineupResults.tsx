'use client';

import { Lineup } from '@/lib/types';
import { useState } from 'react';

interface Props {
  lineups: Lineup[];
  elapsed_ms?: number;
}

export default function LineupResults({ lineups, elapsed_ms }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [showCount, setShowCount] = useState(10);

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
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {lineups.length} Optimized Lineup{lineups.length !== 1 ? 's' : ''}
          </h2>
          {elapsed_ms != null && (
            <p className="text-sm text-gray-500">Generated in {elapsed_ms}ms</p>
          )}
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
        >
          Export CSV
        </button>
      </div>

      <div className="space-y-2">
        {lineups.slice(0, showCount).map((lineup, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 w-8">#{i + 1}</span>
                <span className="font-semibold">{lineup.totalFppg.toFixed(1)} pts</span>
                <span className="text-sm text-gray-500">
                  ${lineup.totalSalary.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-400">{expanded === i ? '−' : '+'}</span>
            </button>

            {expanded === i && (
              <div className="px-4 pb-3 bg-gray-50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase">
                      <th className="text-left py-1">Golfer</th>
                      <th className="text-right py-1">Salary</th>
                      <th className="text-right py-1">FPPG</th>
                      <th className="text-right py-1">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineup.golfers.map((g) => (
                      <tr key={g.id} className="border-t border-gray-100">
                        <td className="py-1.5 font-medium">{g.name}</td>
                        <td className="text-right">${g.salary.toLocaleString()}</td>
                        <td className="text-right">{g.fppg.toFixed(1)}</td>
                        <td className="text-right">{g.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-300 font-bold">
                    <tr>
                      <td className="py-1.5">Total</td>
                      <td className="text-right">${lineup.totalSalary.toLocaleString()}</td>
                      <td className="text-right">{lineup.totalFppg.toFixed(1)}</td>
                      <td className="text-right">{lineup.totalValue.toFixed(2)}</td>
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
          className="mt-4 w-full py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Show More ({lineups.length - showCount} remaining)
        </button>
      )}
    </div>
  );
}
