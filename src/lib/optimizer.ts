// ──────────────────────────────────────────────
// Golf DFS Lineup Optimizer
// ──────────────────────────────────────────────
// Simplified from the original MLB optimizer:
// - Golf has uniform positions (all 6 slots are "G")
// - No multi-position logic needed
// - Branch-and-bound with salary pruning + score ceiling
// ──────────────────────────────────────────────

import {
  Golfer,
  Lineup,
  OptimizerSettings,
  PlatformConfig,
  PLATFORM_CONFIGS,
} from './types';

/** Min-heap of lineups by total projected points */
class LineupHeap {
  private heap: Lineup[] = [];
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get minScore(): number {
    return this.heap.length > 0 ? this.heap[0].totalFppg : 0;
  }

  get length(): number {
    return this.heap.length;
  }

  push(lineup: Lineup): void {
    if (this.heap.length < this.capacity) {
      this.heap.push(lineup);
      this._bubbleUp(this.heap.length - 1);
      return;
    }
    if (lineup.totalFppg > this.heap[0].totalFppg) {
      this.heap[0] = lineup;
      this._sinkDown(0);
    }
  }

  toSorted(): Lineup[] {
    return [...this.heap].sort((a, b) => b.totalFppg - a.totalFppg);
  }

  private _bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[i].totalFppg >= this.heap[parent].totalFppg) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  private _sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l].totalFppg < this.heap[smallest].totalFppg)
        smallest = l;
      if (r < n && this.heap[r].totalFppg < this.heap[smallest].totalFppg)
        smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

/**
 * Pre-compute suffix max score tables for pruning.
 * suffixMaxPts[i] = best total fppg achievable by picking (rosterSize - i)
 * golfers from golfers[i..end] under any salary.
 *
 * Simpler approach: for positions i..end, the max pts you can add is
 * the sum of the top (remaining) fppg values. This is an upper bound.
 */
function buildSuffixCeiling(
  golfers: Golfer[],
  rosterSize: number
): Float64Array {
  const n = golfers.length;
  const ceiling = new Float64Array(n + 1); // ceiling[i] = max pts from picking (rosterSize) golfers from [i..n)

  // For each starting index, the ceiling is the sum of top-K fppg values from that index onward
  for (let i = n - 1; i >= 0; i--) {
    const remaining = n - i;
    if (remaining <= rosterSize) {
      // Must take all remaining
      let sum = 0;
      for (let j = i; j < n; j++) sum += golfers[j].fppg;
      ceiling[i] = sum;
    } else {
      // Top rosterSize values from golfers[i..n) — already sorted desc by fppg
      let sum = 0;
      for (let j = i; j < i + rosterSize && j < n; j++) sum += golfers[j].fppg;
      ceiling[i] = sum;
    }
  }
  return ceiling;
}

/**
 * Core optimizer: generates the top N lineups for golf DFS.
 *
 * Since all 6 positions are identical, this is a straightforward
 * combination search with branch-and-bound pruning:
 * 1. Sort golfers by fppg descending
 * 2. Recursively pick golfers in order (avoiding duplicates by index)
 * 3. Prune branches where remaining salary can't fill remaining slots
 * 4. Prune branches where remaining ceiling can't beat current best
 */
export function optimize(
  golfers: Golfer[],
  settings: OptimizerSettings
): Lineup[] {
  const config = PLATFORM_CONFIGS[settings.platform];
  const { rosterSize, salaryCap } = config;
  const minSalary = settings.minSalary ?? config.minSalary;

  // Filter out excluded golfers, apply locks
  const locked = golfers.filter((g) => settings.lockedGolfers.includes(g.id));
  const available = golfers
    .filter(
      (g) =>
        !settings.excludedGolfers.includes(g.id) &&
        !settings.lockedGolfers.includes(g.id)
    )
    .sort((a, b) => b.fppg - a.fppg);

  if (locked.length > rosterSize) {
    throw new Error(
      `Too many locked golfers (${locked.length}) for ${rosterSize} roster spots`
    );
  }

  const slotsToFill = rosterSize - locked.length;
  if (slotsToFill === 0) {
    const salary = locked.reduce((s, g) => s + g.salary, 0);
    const fppg = locked.reduce((s, g) => s + g.fppg, 0);
    return [
      {
        golfers: locked,
        totalSalary: salary,
        totalFppg: fppg,
        totalValue: fppg / salary * 1000,
      },
    ];
  }

  const lockedSalary = locked.reduce((s, g) => s + g.salary, 0);
  const lockedFppg = locked.reduce((s, g) => s + g.fppg, 0);
  const remainingCap = salaryCap - lockedSalary;

  // Find the cheapest golfer salary for budget floor calculations
  const cheapest =
    available.length > 0
      ? Math.min(...available.map((g) => g.salary))
      : 0;

  // Pre-compute per-slot ceiling: max fppg achievable from index i onward
  const suffixCeiling = buildSuffixCeiling(available, slotsToFill);

  const heap = new LineupHeap(settings.maxLineups);

  // Iterative stack-based DFS (avoids call stack overflow for large pools)
  interface Frame {
    idx: number;     // current index in `available`
    picked: number;  // how many golfers picked so far
    salary: number;  // salary used by picked golfers (excluding locked)
    fppg: number;    // fppg of picked golfers (excluding locked)
    ids: number[];   // indices of picked golfers
  }

  const stack: Frame[] = [{ idx: 0, picked: 0, salary: 0, fppg: 0, ids: [] }];

  while (stack.length > 0) {
    const frame = stack.pop()!;

    // Lineup complete
    if (frame.picked === slotsToFill) {
      const totalSalary = frame.salary + lockedSalary;
      const totalFppg = frame.fppg + lockedFppg;
      if (totalSalary >= minSalary && totalSalary <= salaryCap) {
        const lineupGolfers = [
          ...locked,
          ...frame.ids.map((i) => available[i]),
        ];
        heap.push({
          golfers: lineupGolfers,
          totalSalary,
          totalFppg,
          totalValue: totalFppg / totalSalary * 1000,
        });
      }
      continue;
    }

    const remaining = slotsToFill - frame.picked;
    const budgetFloor = cheapest * (remaining - 1); // need salary for rest after this pick

    // Iterate candidates in reverse order so highest-fppg branches explored first
    // (stack is LIFO, so push low-fppg first)
    const maxIdx = available.length - remaining; // need at least `remaining` golfers left
    for (let i = maxIdx; i >= frame.idx; i--) {
      const g = available[i];

      // Salary pruning: can we afford this golfer + fill remaining slots?
      if (frame.salary + g.salary + budgetFloor > remainingCap) continue;

      // Score ceiling pruning: even if we pick the best remaining, can we beat current best?
      if (heap.length >= heap.capacity) {
        // Best case: this golfer's fppg + best (remaining-1) from golfers after this
        const bestRemaining =
          remaining > 1 && i + 1 < available.length
            ? suffixCeiling[i + 1] *
              ((remaining - 1) / Math.min(remaining - 1, available.length - i - 1))
            : 0;
        // More accurate: take top (remaining-1) fppg from available[i+1..]
        let ceilingPts = g.fppg;
        const endIdx = Math.min(i + remaining, available.length);
        for (let j = i + 1; j < endIdx; j++) {
          ceilingPts += available[j].fppg;
        }

        if (frame.fppg + ceilingPts + lockedFppg <= heap.minScore) continue;
      }

      stack.push({
        idx: i + 1,
        picked: frame.picked + 1,
        salary: frame.salary + g.salary,
        fppg: frame.fppg + g.fppg,
        ids: [...frame.ids, i],
      });
    }
  }

  return heap.toSorted();
}

/**
 * Generate diverse lineups by running multiple optimization passes
 * with randomized golfer exclusions based on exposure limits.
 */
export function optimizeWithDiversity(
  golfers: Golfer[],
  settings: OptimizerSettings
): Lineup[] {
  if (settings.diversityWeight === 0 || settings.maxLineups <= 1) {
    return optimize(golfers, settings);
  }

  const allLineups: Lineup[] = [];
  const exposure: Map<number, number> = new Map();
  const maxExposureCount = Math.ceil(
    settings.maxLineups * (settings.maxExposure / 100)
  );

  // Run multiple passes, excluding over-exposed golfers
  const passes = Math.ceil(settings.maxLineups / 10);
  const lineupsPerPass = Math.ceil(settings.maxLineups / passes);

  for (let pass = 0; pass < passes; pass++) {
    const excluded = new Set(settings.excludedGolfers);

    // Exclude golfers that have hit their exposure cap
    for (const [id, count] of exposure) {
      if (count >= maxExposureCount) excluded.add(id);
    }

    const passSettings: OptimizerSettings = {
      ...settings,
      maxLineups: lineupsPerPass,
      excludedGolfers: [...excluded],
      diversityWeight: 0, // no recursion
    };

    const passLineups = optimize(golfers, passSettings);
    for (const lineup of passLineups) {
      allLineups.push(lineup);
      for (const g of lineup.golfers) {
        exposure.set(g.id, (exposure.get(g.id) || 0) + 1);
      }
    }
  }

  // Sort all collected lineups and return top N
  return allLineups
    .sort((a, b) => b.totalFppg - a.totalFppg)
    .slice(0, settings.maxLineups);
}
