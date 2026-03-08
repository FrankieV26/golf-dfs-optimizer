// ──────────────────────────────────────────────
// Feature 2: Monte Carlo Tournament Simulation
// ──────────────────────────────────────────────
// Runs thousands of tournament simulations to produce
// realistic scoring distributions, cut probabilities,
// and finish position probabilities per golfer.
// ──────────────────────────────────────────────

import { Golfer, Platform, DK_SCORING, FD_SCORING } from './types';

export interface SimulationResult {
  golferId: number;
  name: string;
  // Probabilities (0-1)
  makeCutProb: number;
  top5Prob: number;
  top10Prob: number;
  top20Prob: number;
  winProb: number;
  // Projected fantasy points distribution
  projMean: number;
  projFloor: number;   // 10th percentile
  projCeiling: number;  // 90th percentile
  projStdDev: number;
  // Volatility score (0-100, higher = more volatile)
  volatility: number;
}

// Simple seeded PRNG for reproducible results (xorshift32)
function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

// Box-Muller transform: two uniform randoms -> one normal random
function normalRandom(rng: () => number, mean: number, stddev: number): number {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

/**
 * Estimate a golfer's per-round scoring parameters.
 *
 * When Data Golf data is available, uses their projected points and std_dev
 * (much more accurate). Falls back to FPPG-based estimates otherwise.
 */
function estimateRoundParams(golfer: Golfer): { roundMean: number; roundStd: number } {
  if (golfer.dg && golfer.dg.projPoints > 0) {
    // DG proj_points is the total tournament projection (4 rounds).
    // DG std_dev is also for the full tournament.
    const roundMean = golfer.dg.projPoints / 4;
    const roundStd = golfer.dg.projStdDev / 4;
    return { roundMean, roundStd };
  }

  // Fallback: estimate from FPPG
  const roundMean = golfer.fppg / 4;
  const roundStd = 3 + roundMean * 0.3;
  return { roundMean, roundStd };
}

/**
 * Calculate DraftKings finish position bonus points.
 */
function dkFinishBonus(position: number): number {
  if (position === 1) return 30;
  if (position === 2) return 20;
  if (position === 3) return 18;
  if (position === 4) return 16;
  if (position === 5) return 14;
  if (position <= 7) return position === 6 ? 12 : 10;
  if (position <= 10) return 11 - position + 7; // 8->9, 9->8, 10->7
  if (position <= 15) return 6;
  if (position <= 20) return 5;
  if (position <= 25) return 4;
  if (position <= 30) return 3;
  if (position <= 40) return 2;
  if (position <= 50) return 1;
  return 0;
}

/**
 * Calculate FanDuel finish position bonus points.
 */
function fdFinishBonus(position: number): number {
  if (position === 1) return 20;
  if (position <= 5) return 12;
  if (position <= 10) return 8;
  if (position <= 25) return 5;
  return 0;
}

/**
 * Run a full Monte Carlo tournament simulation.
 *
 * For each simulation:
 * 1. Generate 4 rounds of scoring for each golfer
 * 2. After round 2, apply the cut (top 65 + ties)
 * 3. Score all 4 rounds for golfers who made the cut
 * 4. Rank by total score, assign finish bonuses
 * 5. Calculate total fantasy points
 *
 * @param golfers - Array of golfers to simulate
 * @param numSims - Number of simulations (default 10000)
 * @param platform - 'draftkings' or 'fanduel'
 * @param seed - Random seed for reproducibility
 */
export function runSimulation(
  golfers: Golfer[],
  numSims = 10_000,
  platform: Platform = 'draftkings',
  seed = 42
): SimulationResult[] {
  const n = golfers.length;
  const rng = createRng(seed);

  // Pre-compute per-golfer round parameters
  const params = golfers.map((g) => estimateRoundParams(g));

  // Accumulators
  const madeCut = new Float64Array(n);
  const top5 = new Float64Array(n);
  const top10 = new Float64Array(n);
  const top20 = new Float64Array(n);
  const wins = new Float64Array(n);
  const totalPts = new Float64Array(n);        // sum of fantasy pts across sims
  const totalPtsSq = new Float64Array(n);       // sum of squared pts (for stddev)

  // Per-golfer sorted fantasy point arrays for percentile calculation
  const allPts: number[][] = golfers.map(() => []);

  const CUT_LINE = 65; // top 65 + ties make the cut

  for (let sim = 0; sim < numSims; sim++) {
    // Generate round scores (fantasy points per round)
    const roundScores: number[][] = []; // [golfer][round]
    for (let i = 0; i < n; i++) {
      const rounds: number[] = [];
      for (let r = 0; r < 4; r++) {
        rounds.push(normalRandom(rng, params[i].roundMean, params[i].roundStd));
      }
      roundScores.push(rounds);
    }

    // After round 2: determine cut line
    const r2Totals = roundScores.map((rs, i) => ({
      idx: i,
      total: rs[0] + rs[1],
    }));
    r2Totals.sort((a, b) => b.total - a.total);

    // Cut: top CUT_LINE scores (with ties at the cutoff)
    const cutThreshold =
      r2Totals.length > CUT_LINE ? r2Totals[CUT_LINE - 1].total : -Infinity;
    const madeTheCut = new Set<number>();
    for (const { idx, total } of r2Totals) {
      if (total >= cutThreshold) madeTheCut.add(idx);
    }

    // Calculate 4-round totals for those who made the cut; 2-round for those who didn't
    const fantasyTotals: { idx: number; pts: number; madeCut: boolean }[] = [];
    for (let i = 0; i < n; i++) {
      if (madeTheCut.has(i)) {
        const total = roundScores[i][0] + roundScores[i][1] +
                      roundScores[i][2] + roundScores[i][3];
        fantasyTotals.push({ idx: i, pts: total, madeCut: true });
      } else {
        const total = roundScores[i][0] + roundScores[i][1];
        fantasyTotals.push({ idx: i, pts: total, madeCut: false });
      }
    }

    // Rank only those who made the cut (missed cut = no finish bonus)
    const cutMakers = fantasyTotals
      .filter((f) => f.madeCut)
      .sort((a, b) => b.pts - a.pts);

    // Assign finish positions (with ties)
    let pos = 1;
    for (let i = 0; i < cutMakers.length; i++) {
      if (i > 0 && cutMakers[i].pts < cutMakers[i - 1].pts) {
        pos = i + 1;
      }
      const finishBonus = platform === 'draftkings'
        ? dkFinishBonus(pos)
        : fdFinishBonus(pos);

      // Add made-cut bonus for FanDuel
      const cutBonus = platform === 'fanduel' ? FD_SCORING.made_cut : 0;

      const finalPts = cutMakers[i].pts + finishBonus + cutBonus;
      const idx = cutMakers[i].idx;

      madeCut[idx]++;
      if (pos <= 5) top5[idx]++;
      if (pos <= 10) top10[idx]++;
      if (pos <= 20) top20[idx]++;
      if (pos === 1) wins[idx]++;

      totalPts[idx] += finalPts;
      totalPtsSq[idx] += finalPts * finalPts;
      allPts[idx].push(finalPts);
    }

    // Missed cut golfers
    for (const f of fantasyTotals) {
      if (!f.madeCut) {
        totalPts[f.idx] += f.pts;
        totalPtsSq[f.idx] += f.pts * f.pts;
        allPts[f.idx].push(f.pts);
      }
    }
  }

  // Compile results
  return golfers.map((g, i) => {
    const mean = totalPts[i] / numSims;
    const variance = totalPtsSq[i] / numSims - mean * mean;
    const stddev = Math.sqrt(Math.max(0, variance));

    // Sort for percentiles
    const sorted = allPts[i].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.1)] ?? 0;
    const p90 = sorted[Math.floor(sorted.length * 0.9)] ?? 0;

    const makeCutProb = madeCut[i] / numSims;
    // Volatility: based on stddev relative to mean, and cut probability uncertainty
    const cutUncertainty = 4 * makeCutProb * (1 - makeCutProb); // peaks at 50%
    const volatility = Math.min(
      100,
      Math.round((stddev / (Math.abs(mean) + 1)) * 50 + cutUncertainty * 25)
    );

    return {
      golferId: g.id,
      name: g.name,
      makeCutProb,
      top5Prob: top5[i] / numSims,
      top10Prob: top10[i] / numSims,
      top20Prob: top20[i] / numSims,
      winProb: wins[i] / numSims,
      projMean: Math.round(mean * 10) / 10,
      projFloor: Math.round(p10 * 10) / 10,
      projCeiling: Math.round(p90 * 10) / 10,
      projStdDev: Math.round(stddev * 10) / 10,
      volatility,
    };
  });
}
