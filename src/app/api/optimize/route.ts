import { NextRequest, NextResponse } from 'next/server';
import { optimizeWithDiversity } from '@/lib/optimizer';
import { Golfer, OptimizerSettings, DEFAULT_SETTINGS } from '@/lib/types';

/**
 * Apply course fit adjustment to golfer projections before optimizing.
 *
 * DG's proj_points already includes some course fit, but this adds
 * additional emphasis controlled by the courseFitWeight setting.
 * The adjustment uses DG's courseFitAdj (strokes gained per round)
 * converted to fantasy points.
 *
 * Scale: 1 SG/round ≈ 3 fantasy points over a tournament
 * (conservative to avoid over-weighting since DG already includes some fit)
 */
const SG_TO_FPTS = 3.0;

function applyCourseFitBoost(golfers: Golfer[], weight: number): Golfer[] {
  if (weight === 0) return golfers;

  return golfers.map((g) => {
    const adj = g.dg?.courseFitAdj ?? 0;
    if (adj === 0) return g;

    const boost = adj * weight * SG_TO_FPTS;
    const adjustedFppg = g.fppg + boost;

    return {
      ...g,
      fppg: adjustedFppg,
      value: (adjustedFppg / g.salary) * 1000,
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const golfers: Golfer[] = body.golfers;
    const settings: OptimizerSettings = { ...DEFAULT_SETTINGS, ...body.settings };

    if (!golfers || golfers.length < 6) {
      return NextResponse.json(
        { error: 'Need at least 6 golfers to optimize' },
        { status: 400 }
      );
    }

    // Apply course fit boost before optimization
    const adjusted = applyCourseFitBoost(golfers, settings.courseFitWeight);

    const start = performance.now();
    const lineups = optimizeWithDiversity(adjusted, settings);
    const elapsed = Math.round(performance.now() - start);

    return NextResponse.json({
      lineups,
      count: lineups.length,
      elapsed_ms: elapsed,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
