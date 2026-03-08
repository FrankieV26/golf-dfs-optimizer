'use client';

import { Golfer } from '@/lib/types';

// Sort key supports top-level Golfer fields and nested dg.* fields
export type GolferSortField = keyof Golfer | `dg.${string}`;

function getSortValue(g: Golfer, field: GolferSortField): number | string | undefined {
  if (field.startsWith('dg.')) {
    const dgKey = field.slice(3) as keyof NonNullable<Golfer['dg']>;
    const val = g.dg?.[dgKey];
    return val ?? undefined;
  }
  return g[field as keyof Golfer] as number | string | undefined;
}

interface Props {
  golfers: Golfer[];
  lockedIds: Set<number>;
  excludedIds: Set<number>;
  onToggleLock: (id: number) => void;
  onToggleExclude: (id: number) => void;
  sortField: GolferSortField;
  sortDir: 'asc' | 'desc';
  onSort: (field: GolferSortField) => void;
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
  const hasDgData = golfers.some((g) => g.dg != null);

  const sorted = [...golfers].sort((a, b) => {
    const av = getSortValue(a, sortField);
    const bv = getSortValue(b, sortField);
    // Push undefined/null to the bottom regardless of sort direction
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const header = (label: string, field: GolferSortField) => (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      {label}
      {sortField === field && (sortDir === 'asc' ? ' ▲' : ' ▼')}
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm">
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
            {hasDgData && (
              <>
                {header('DG Own%', 'dg.projOwnership')}
                {header('SG Total', 'dg.sgTotal')}
                {header('Win%', 'dg.winProb')}
                {header('Course Fit', 'dg.courseFitAdj')}
              </>
            )}
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
                <td className="px-3 py-1.5 font-medium whitespace-nowrap">
                  {g.name}
                  {g.dg && (
                    <span
                      className="ml-1.5 inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700"
                      title="Data Golf enrichment available"
                    >
                      DG
                    </span>
                  )}
                </td>
                <td className="px-3 py-1.5">${g.salary.toLocaleString()}</td>
                <td className="px-3 py-1.5">{g.fppg.toFixed(1)}</td>
                <td className="px-3 py-1.5">{g.value.toFixed(2)}</td>
                <td className="px-3 py-1.5">
                  {g.ownership != null ? `${g.ownership.toFixed(1)}%` : '-'}
                </td>
                {hasDgData && (
                  <>
                    <td className="px-3 py-1.5">
                      {g.dg?.projOwnership != null
                        ? `${g.dg.projOwnership.toFixed(1)}%`
                        : '-'}
                    </td>
                    <td className="px-3 py-1.5 font-medium">
                      {g.dg?.sgTotal != null ? g.dg.sgTotal.toFixed(2) : '-'}
                    </td>
                    <td className="px-3 py-1.5">
                      {g.dg?.winProb != null
                        ? `${(g.dg.winProb * 100).toFixed(1)}%`
                        : '-'}
                    </td>
                    <td className="px-3 py-1.5">
                      {g.dg?.courseFitAdj != null ? (
                        <span
                          className={
                            g.dg.courseFitAdj >= 0
                              ? 'text-green-700 font-medium'
                              : 'text-red-600 font-medium'
                          }
                        >
                          {g.dg.courseFitAdj >= 0 ? '+' : ''}
                          {g.dg.courseFitAdj.toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
