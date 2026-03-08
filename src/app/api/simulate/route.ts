import { NextRequest, NextResponse } from 'next/server';
import { Golfer, Platform } from '@/lib/types';
import { runSimulation } from '@/lib/simulation';

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
    const results = runSimulation(golfers, numSims, platform);
    const elapsed = Math.round(performance.now() - start);

    return NextResponse.json({ results, elapsed_ms: elapsed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
