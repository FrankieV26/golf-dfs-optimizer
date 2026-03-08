import { NextRequest, NextResponse } from 'next/server';
import { optimizeWithDiversity } from '@/lib/optimizer';
import { Golfer, OptimizerSettings, DEFAULT_SETTINGS } from '@/lib/types';

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

    const start = performance.now();
    const lineups = optimizeWithDiversity(golfers, settings);
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
