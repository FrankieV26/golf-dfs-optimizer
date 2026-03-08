import { NextRequest, NextResponse } from 'next/server';
import { Golfer, Platform } from '@/lib/types';
import { runSimulation, SimulationResult } from '@/lib/simulation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const golfers: Golfer[] = body.golfers;
    const platform: Platform = body.platform || 'draftkings';
    const numSims: number = body.numSims || 10_000;

    if (!golfers || golfers.length < 6) {
      return NextResponse.json(
        { error: 'Need at least 6 golfers to simulate' },
        { status: 400 }
      );
    }

    const start = performance.now();
    let results = runSimulation(golfers, numSims, platform);
    const elapsed = Math.round(performance.now() - start);

    // Enhance simulation results with Data Golf probabilities when available.
    // DG's pre-tournament model is trained on years of data — blend it with
    // our Monte Carlo for the best of both worlds.
    const hasDG = golfers.some(g => g.dg?.winProb != null && g.dg.winProb > 0);
    if (hasDG) {
      const golferMap = new Map(golfers.map(g => [g.id, g]));
      results = results.map((sim: SimulationResult) => {
        const g = golferMap.get(sim.golferId);
        if (!g?.dg) return sim;

        // Blend: 60% Data Golf model, 40% our Monte Carlo
        // DG model is more accurate for probabilities; MC is better for
        // fantasy point distributions since it accounts for DFS scoring
        const W_DG = 0.6;
        const W_MC = 0.4;

        return {
          ...sim,
          winProb: sim.winProb * W_MC + g.dg.winProb * W_DG,
          top5Prob: sim.top5Prob * W_MC + g.dg.top5Prob * W_DG,
          top10Prob: sim.top10Prob * W_MC + g.dg.top10Prob * W_DG,
          top20Prob: sim.top20Prob * W_MC + g.dg.top20Prob * W_DG,
          makeCutProb: sim.makeCutProb * W_MC + g.dg.makeCutProb * W_DG,
        };
      });
    }

    return NextResponse.json({
      results,
      elapsed_ms: elapsed,
      dataGolfEnhanced: hasDG,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
