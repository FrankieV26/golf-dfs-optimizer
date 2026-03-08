// ──────────────────────────────────────────────
// Feature 3: Ownership-Aware GPP Optimization
// ──────────────────────────────────────────────
// Instead of just maximizing projected points, this
// builds lineups that maximize expected ROI by
// accounting for projected ownership percentages.
// Low-owned, high-ceiling players get a "leverage"
// boost that differentiates your lineups from the field.
// ──────────────────────────────────────────────

import { Golfer, Lineup, OptimizerSettings, PLATFORM_CONFIGS } from './types';
import { SimulationResult } from './simulation';

export interface OwnershipAdjustedGolfer extends Golfer {
  projOwnership: number;  // projected ownership 0-100
  leverage: number;        // positive = underowned, negative = overowned
  gppScore: number;        // ownership-adjusted projection for GPP play
}

/**
 * Estimate projected ownership for each golfer.
 *
 * Uses real Data Golf projected ownership when available (much more accurate).
 * Falls back to salary/FPPG-based estimates for players without DG data.
 */
export function estimateOwnership(golfers: Golfer[]): OwnershipAdjustedGolfer[] {
  if (golfers.length === 0) return [];

  // Check if any golfers have real DG ownership data
  const hasDGOwnership = golfers.some(g => g.dg?.projOwnership != null && g.dg.projOwnership > 0);

  if (hasDGOwnership) {
    // Use real DG ownership, with fallback estimation for unmatched players
    const raw = golfers.map((g) => g.fppg * g.value);
    const totalRaw = raw.reduce((s, r) => s + r, 0) || 1;
    const scale = 600 / totalRaw;

    return golfers.map((g, i) => {
      const projOwnership = (g.dg?.projOwnership != null && g.dg.projOwnership > 0)
        ? g.dg.projOwnership
        : Math.max(0.5, Math.min(50, raw[i] * scale));
      return {
        ...g,
        projOwnership,
        leverage: 0,
        gppScore: 0,
      };
    });
  }

  // Fallback: estimate from salary + FPPG
  const raw = golfers.map((g) => g.fppg * g.value);
  const totalRaw = raw.reduce((s, r) => s + r, 0) || 1;
  const targetTotal = 600;
  const scale = targetTotal / totalRaw;

  return golfers.map((g, i) => {
    const projOwnership = Math.max(0.5, Math.min(50, raw[i] * scale));
    return {
      ...g,
      projOwnership,
      leverage: 0,
      gppScore: 0,
    };
  });
}

/**
 * Calculate leverage and GPP scores using simulation results.
 *
 * Leverage = (optimal lineup frequency) - (projected ownership)
 * GPP Score = projected points * leverage multiplier
 *
 * The idea: a golfer who appears in 10% of winning simulations
 * but is only 3% owned has +7% leverage. This golfer is a
 * better GPP play than one who appears in 15% of winning sims
 * but is 20% owned (-5% leverage).
 */
export function calculateGPPScores(
  golfers: OwnershipAdjustedGolfer[],
  simResults: SimulationResult[]
): OwnershipAdjustedGolfer[] {
  const simMap = new Map(simResults.map((s) => [s.golferId, s]));

  return golfers.map((g) => {
    const sim = simMap.get(g.id);
    if (!sim) return g;

    // "Optimal frequency" = how often this golfer should appear
    // in lineups based on pure upside. We use a blend of
    // ceiling (90th percentile) and win probability.
    const optimalFreq = (sim.projCeiling / 100) * 30 + sim.winProb * 100;

    // Leverage: how much more (or less) you should play this golfer
    // relative to what the field will do
    const leverage = optimalFreq - g.projOwnership;

    // GPP Score: blend of raw projection + leverage bonus
    // Positive leverage gets a boost, negative leverage gets penalized
    const leverageMultiplier = 1 + (leverage / 100) * 0.5; // ±50% max adjustment
    const gppScore = sim.projMean * Math.max(0.5, leverageMultiplier);

    return { ...g, leverage, gppScore };
  });
}

/**
 * Generate optimized GPP lineups using ownership-adjusted scores.
 *
 * Uses a greedy-with-randomization approach:
 * 1. Weight golfers by GPP score (not raw FPPG)
 * 2. Build lineups with salary cap constraint
 * 3. Ensure diversity by tracking exposure
 * 4. Respect max ownership cap across lineup set
 */
export function buildGPPLineups(
  golfers: OwnershipAdjustedGolfer[],
  settings: OptimizerSettings,
  numLineups: number
): Lineup[] {
  const config = PLATFORM_CONFIGS[settings.platform];
  const { rosterSize, salaryCap } = config;
  const minSalary = settings.minSalary ?? config.minSalary;
  const maxExposureCount = Math.ceil(numLineups * (settings.maxExposure / 100));

  const exposure = new Map<number, number>();
  const lineups: Lineup[] = [];

  // Sort by GPP score descending
  const sorted = [...golfers]
    .filter((g) => !settings.excludedGolfers.includes(g.id))
    .sort((a, b) => b.gppScore - a.gppScore);

  // Locked golfers
  const locked = golfers.filter((g) => settings.lockedGolfers.includes(g.id));
  const lockedSalary = locked.reduce((s, g) => s + g.salary, 0);
  const slotsToFill = rosterSize - locked.length;

  for (let attempt = 0; attempt < numLineups * 5 && lineups.length < numLineups; attempt++) {
    const lineup: OwnershipAdjustedGolfer[] = [...locked];
    let salary = lockedSalary;

    // Weighted random selection based on GPP score
    const available = sorted.filter((g) => {
      if (lineup.some((l) => l.id === g.id)) return false;
      if ((exposure.get(g.id) || 0) >= maxExposureCount) return false;
      return true;
    });

    // Greedy fill with some randomization
    for (let slot = 0; slot < slotsToFill && available.length > 0; slot++) {
      const remainingSlots = slotsToFill - slot;
      const cheapestAvail = Math.min(...available.map((g) => g.salary));
      const budgetForThis = salaryCap - salary - cheapestAvail * (remainingSlots - 1);

      const eligible = available.filter((g) => g.salary <= budgetForThis);
      if (eligible.length === 0) break;

      // Weighted random: pick from top candidates with probability proportional to GPP score
      const topN = Math.min(eligible.length, 5 + Math.floor(attempt / numLineups * 10));
      const candidates = eligible.slice(0, topN);
      const totalScore = candidates.reduce((s, g) => s + Math.max(0.1, g.gppScore), 0);

      let rand = Math.random() * totalScore;
      let pick = candidates[0];
      for (const c of candidates) {
        rand -= Math.max(0.1, c.gppScore);
        if (rand <= 0) { pick = c; break; }
      }

      lineup.push(pick);
      salary += pick.salary;

      // Remove picked player from available pool
      const idx = available.indexOf(pick);
      if (idx >= 0) available.splice(idx, 1);
    }

    // Validate lineup
    if (lineup.length === rosterSize && salary <= salaryCap && salary >= minSalary) {
      // Check this isn't a duplicate
      const key = lineup.map((g) => g.id).sort().join(',');
      const isDupe = lineups.some(
        (l) => l.golfers.map((g) => g.id).sort().join(',') === key
      );
      if (!isDupe) {
        const totalFppg = lineup.reduce((s, g) => s + g.fppg, 0);
        lineups.push({
          golfers: lineup,
          totalSalary: salary,
          totalFppg,
          totalValue: totalFppg / salary * 1000,
        });
        for (const g of lineup) {
          exposure.set(g.id, (exposure.get(g.id) || 0) + 1);
        }
      }
    }
  }

  return lineups.sort((a, b) => b.totalFppg - a.totalFppg);
}
