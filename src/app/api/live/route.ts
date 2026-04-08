import { NextResponse } from 'next/server';
import { fetchLiveResults, normalizeName } from '@/lib/datagolf';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchLiveResults();

    // Build SG lookup from stats
    const sgMap = new Map<string, number>();
    for (const s of data.stats) {
      sgMap.set(normalizeName(s.player_name), s.sg_total);
    }

    // Merge positions with SG data
    const leaderboard = data.positions.map((p) => ({
      player_name: p.player_name,
      position: p.current_pos,
      total: p.total,
      today: p.today,
      thru: p.thru,
      current_round: p.current_round,
      r1: p.r1,
      r2: p.r2,
      r3: p.r3,
      r4: p.r4,
      sg_total: sgMap.get(normalizeName(p.player_name)) ?? null,
    }));

    // Sort by position (parse numeric prefix from "T5", "1", etc.)
    leaderboard.sort((a, b) => {
      const posA = parseInt(a.position.replace(/^T/, '')) || 999;
      const posB = parseInt(b.position.replace(/^T/, '')) || 999;
      return posA - posB || a.total - b.total;
    });

    return NextResponse.json(
      {
        event_name: data.event_name,
        last_updated: new Date().toISOString(),
        leaderboard,
      },
      {
        headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
