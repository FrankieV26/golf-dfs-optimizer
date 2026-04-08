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

  const header = (label: string, field: GolferSortField, align: 'left' | 'right' = 'left') => (
    <th
      className={`px-3 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none whitespace-nowrap sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10 ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      onClick={() => onSort(field)}
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

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-950/20 max-h-[70vh] overflow-y-auto">
      <table className="min-w-[700px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10 w-8">
              #
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
              Lock
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
              Excl
            </th>
            {header('Name', 'name')}
            {header('Salary', 'salary', 'right')}
            {header('FPPG', 'fppg', 'right')}
            {header('Value', 'value', 'right')}
            {header('Own%', 'ownership', 'right')}
            {hasDgData && (
              <>
                {header('DG Own%', 'dg.projOwnership', 'right')}
                {header('SG Total', 'dg.sgTotal', 'right')}
                {header('Win%', 'dg.winProb', 'right')}
                {header('Course Fit', 'dg.courseFitAdj', 'right')}
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {sorted.map((g, idx) => {
            const isLocked = lockedIds.has(g.id);
            const isExcluded = excludedIds.has(g.id);
            return (
              <tr
                key={g.id}
                className={`transition-colors ${
                  isLocked
                    ? 'bg-green-50 dark:bg-green-950 hover:bg-green-100/70 dark:hover:bg-green-900/70'
                    : isExcluded
                    ? 'bg-red-50/60 dark:bg-red-950/60 opacity-50'
                    : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/80'
                }`}
              >
                <td className="px-3 py-1.5 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {idx + 1}
                </td>
                <td className="px-3 py-1.5">
                  <button
                    onClick={() => onToggleLock(g.id)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all active:scale-90 ${
                      isLocked
                        ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400'
                    }`}
                    title={isLocked ? 'Unlock' : 'Lock into lineup'}
                  >
                    {isLocked ? (
                      <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : '+'}
                  </button>
                </td>
                <td className="px-3 py-1.5">
                  <button
                    onClick={() => onToggleExclude(g.id)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all active:scale-90 ${
                      isExcluded
                        ? 'bg-red-600 text-white shadow-sm hover:bg-red-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                    title={isExcluded ? 'Include' : 'Exclude from lineup'}
                  >
                    {isExcluded ? (
                      <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : '-'}
                  </button>
                </td>
                <td className="px-3 py-1.5 font-medium whitespace-nowrap">
                  {g.name}
                  {g.dg && (
                    <span
                      className="ml-1.5 inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-700"
                      title="Data Golf enrichment available"
                    >
                      DG
                    </span>
                  )}
                  {g.customProj && (
                    <span
                      className="ml-1 inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-700"
                      title={
                        g.customProj.blended
                          ? `Custom proj: ${g.customProj.fppg.toFixed(1)} pts (50/50 blend with DG)`
                          : `Custom proj: ${g.customProj.fppg.toFixed(1)} pts`
                      }
                    >
                      CP
                    </span>
                  )}
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-gray-700 dark:text-gray-300">${g.salary.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-mono font-semibold">{g.fppg.toFixed(1)}</td>
                <td className="px-3 py-1.5 text-right font-mono text-gray-600 dark:text-gray-400">{g.value.toFixed(2)}</td>
                <td className="px-3 py-1.5 text-right font-mono">
                  {g.ownership != null ? `${g.ownership.toFixed(1)}%` : <span className="text-gray-300 dark:text-gray-600">-</span>}
                </td>
                {hasDgData && (
                  <>
                    <td className="px-3 py-1.5 text-right font-mono">
                      {g.dg?.projOwnership != null
                        ? `${g.dg.projOwnership.toFixed(1)}%`
                        : <span className="text-gray-300 dark:text-gray-600">-</span>}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-medium">
                      {g.dg?.sgTotal != null ? g.dg.sgTotal.toFixed(2) : <span className="text-gray-300 dark:text-gray-600">-</span>}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono">
                      {g.dg?.winProb != null
                        ? `${(g.dg.winProb * 100).toFixed(1)}%`
                        : <span className="text-gray-300 dark:text-gray-600">-</span>}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono">
                      {g.dg?.courseFitAdj != null ? (
                        <span
                          className={
                            g.dg.courseFitAdj >= 0
                              ? 'text-green-700 dark:text-green-400 font-medium'
                              : 'text-red-600 dark:text-red-400 font-medium'
                          }
                        >
                          {g.dg.courseFitAdj >= 0 ? '+' : ''}
                          {g.dg.courseFitAdj.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">-</span>
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
