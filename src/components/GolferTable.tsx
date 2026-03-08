'use client';

import { Golfer } from '@/lib/types';

interface Props {
  golfers: Golfer[];
  lockedIds: Set<number>;
  excludedIds: Set<number>;
  onToggleLock: (id: number) => void;
  onToggleExclude: (id: number) => void;
  sortField: keyof Golfer;
  sortDir: 'asc' | 'desc';
  onSort: (field: keyof Golfer) => void;
}

export default function GolferTable({
  golfers,
  lockedIds,
  excludedIds,
  onToggleLock,
  onToggleExclude,
  sortField,
  sortDir,
  onSort,
}: Props) {
  const sorted = [...golfers].sort((a, b) => {
    const av = a[sortField];
    const bv = b[sortField];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const header = (label: string, field: keyof Golfer) => (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none"
      onClick={() => onSort(field)}
    >
      {label}
      {sortField === field && (sortDir === 'asc' ? ' ▲' : ' ▼')}
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Lock
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Excl
            </th>
            {header('Name', 'name')}
            {header('Salary', 'salary')}
            {header('FPPG', 'fppg')}
            {header('Value', 'value')}
            {header('Own%', 'ownership')}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((g) => {
            const isLocked = lockedIds.has(g.id);
            const isExcluded = excludedIds.has(g.id);
            return (
              <tr
                key={g.id}
                className={
                  isLocked
                    ? 'bg-green-50'
                    : isExcluded
                    ? 'bg-red-50 opacity-50'
                    : 'hover:bg-gray-50'
                }
              >
                <td className="px-3 py-1.5">
                  <button
                    onClick={() => onToggleLock(g.id)}
                    className={`w-6 h-6 rounded text-xs font-bold ${
                      isLocked
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-green-100'
                    }`}
                    title={isLocked ? 'Unlock' : 'Lock into lineup'}
                  >
                    {isLocked ? 'L' : '+'}
                  </button>
                </td>
                <td className="px-3 py-1.5">
                  <button
                    onClick={() => onToggleExclude(g.id)}
                    className={`w-6 h-6 rounded text-xs font-bold ${
                      isExcluded
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-red-100'
                    }`}
                    title={isExcluded ? 'Include' : 'Exclude from lineup'}
                  >
                    {isExcluded ? 'X' : '-'}
                  </button>
                </td>
                <td className="px-3 py-1.5 font-medium">{g.name}</td>
                <td className="px-3 py-1.5">${g.salary.toLocaleString()}</td>
                <td className="px-3 py-1.5">{g.fppg.toFixed(1)}</td>
                <td className="px-3 py-1.5">{g.value.toFixed(2)}</td>
                <td className="px-3 py-1.5">
                  {g.ownership != null ? `${g.ownership.toFixed(1)}%` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
