'use client';

import { SimulationResult } from '@/lib/simulation';
import { useState } from 'react';

interface Props {
  results: SimulationResult[];
  elapsed_ms?: number;
}

export default function SimulationTable({ results, elapsed_ms }: Props) {
  const [sortField, setSortField] = useState<keyof SimulationResult>('projMean');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  if (results.length === 0) return null;

  const sorted = [...results].sort((a, b) => {
    const av = a[sortField] as number;
    const bv = b[sortField] as number;
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const toggleSort = (field: keyof SimulationResult) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const th = (label: string, field: keyof SimulationResult, align: 'left' | 'right' = 'right') => (
    <th
      className={`px-3 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none whitespace-nowrap sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10 ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortField === field && (
          <svg className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        )}
      </span>
    </th>
  );

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const volatilityColor = (v: number) =>
    v >= 70 ? 'text-red-600 dark:text-red-400' : v >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400';

  const volatilityBg = (v: number) => {
    const pctWidth = Math.min(100, v);
    const color = v >= 70 ? '#dc2626' : v >= 40 ? '#ca8a04' : '#16a34a';
    return { width: `${pctWidth}%`, backgroundColor: color };
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xl font-bold">Simulation Results</h2>
        {elapsed_ms != null && (
          <span className="text-sm text-gray-400 dark:text-gray-500">({elapsed_ms}ms)</span>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-950/20 max-h-[70vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10 w-8">
                #
              </th>
              {th('Golfer', 'name', 'left')}
              {th('Proj', 'projMean')}
              {th('Floor', 'projFloor')}
              {th('Ceil', 'projCeiling')}
              {th('Cut%', 'makeCutProb')}
              {th('T5%', 'top5Prob')}
              {th('T10%', 'top10Prob')}
              {th('Win%', 'winProb')}
              {th('Vol', 'volatility')}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sorted.map((r, idx) => (
              <tr key={r.golferId} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors">
                <td className="px-3 py-2 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">{idx + 1}</td>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{r.name}</td>
                <td className="px-3 py-2 text-right font-mono font-semibold">{r.projMean.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono text-gray-500 dark:text-gray-400">{r.projFloor.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono text-gray-500 dark:text-gray-400">{r.projCeiling.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono">{pct(r.makeCutProb)}</td>
                <td className="px-3 py-2 text-right font-mono">{pct(r.top5Prob)}</td>
                <td className="px-3 py-2 text-right font-mono">{pct(r.top10Prob)}</td>
                <td className="px-3 py-2 text-right font-mono">{pct(r.winProb)}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={volatilityBg(r.volatility)} />
                    </div>
                    <span className={`font-mono font-medium text-xs ${volatilityColor(r.volatility)}`}>
                      {r.volatility}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
