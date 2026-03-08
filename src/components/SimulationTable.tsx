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

  const th = (label: string, field: keyof SimulationResult, width = '') => (
    <th
      className={`px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none ${width}`}
      onClick={() => toggleSort(field)}
    >
      {label}
      {sortField === field && (sortDir === 'asc' ? ' ▲' : ' ▼')}
    </th>
  );

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const volatilityColor = (v: number) =>
    v >= 70 ? 'text-red-600' : v >= 40 ? 'text-yellow-600' : 'text-green-600';

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xl font-bold">Simulation Results</h2>
        {elapsed_ms != null && (
          <span className="text-sm text-gray-500">({elapsed_ms}ms)</span>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {th('Golfer', 'name', 'min-w-[140px]')}
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
          <tbody className="divide-y divide-gray-100">
            {sorted.map((r) => (
              <tr key={r.golferId} className="hover:bg-gray-50">
                <td className="px-2 py-1.5 font-medium">{r.name}</td>
                <td className="px-2 py-1.5 font-semibold">{r.projMean.toFixed(1)}</td>
                <td className="px-2 py-1.5 text-gray-500">{r.projFloor.toFixed(1)}</td>
                <td className="px-2 py-1.5 text-gray-500">{r.projCeiling.toFixed(1)}</td>
                <td className="px-2 py-1.5">{pct(r.makeCutProb)}</td>
                <td className="px-2 py-1.5">{pct(r.top5Prob)}</td>
                <td className="px-2 py-1.5">{pct(r.top10Prob)}</td>
                <td className="px-2 py-1.5">{pct(r.winProb)}</td>
                <td className={`px-2 py-1.5 font-medium ${volatilityColor(r.volatility)}`}>
                  {r.volatility}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
