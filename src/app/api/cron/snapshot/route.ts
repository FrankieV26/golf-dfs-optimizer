import { NextRequest, NextResponse } from 'next/server';
import { fetchAllDGData, fetchLiveResults, normalizeName } from '@/lib/datagolf';
import { getDKGolfers } from '@/lib/draftkings';
import type { DGEnrichedPlayer } from '@/lib/datagolf';

/**
 * Weekly snapshot cron — two modes:
 *
 * 1. **snapshot** (Wednesday 18:00 UTC):
 *    Captures the full DK slate + DG projections into Supabase for backtesting.
 *
 * 2. **results** (Sunday 23:00 UTC):
 *    Updates existing player snapshots with actual finish positions and made-cut
 *    data from Data Golf's live-tournament-stats and in-play endpoints.
 *
 * POST /api/cron/snapshot            — snapshot mode (default)
 * POST /api/cron/snapshot?mode=results — results mode
 * Header: Authorization: Bearer <CRON_SECRET>
 */

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabaseQuery(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status}: ${text}`);
  }
  return res.json();
}

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mode = req.nextUrl.searchParams.get('mode') || 'snapshot';

  if (mode === 'results') {
    return handleResults();
  }
  return handleSnapshot();
}

// ── Snapshot Mode (Wednesday) ────────────────

async function handleSnapshot() {
  try {
    // Fetch DK slate + DG data in parallel
    const [dkData, dgData] = await Promise.all([
      getDKGolfers().catch(err => {
        console.warn('DK fetch failed:', err.message);
        return null;
      }),
      fetchAllDGData('draftkings').catch(err => {
        console.warn('DG fetch failed:', err.message);
        return null;
      }),
    ]);

    if (!dkData || dkData.golfers.length === 0) {
      return NextResponse.json({
        message: 'No active DK slate — skipping snapshot',
        timestamp: new Date().toISOString(),
      });
    }

    // Build DG lookup
    const dgMap = new Map<string, DGEnrichedPlayer>();
    if (dgData) {
      for (const p of dgData.players) {
        dgMap.set(normalizeName(p.player_name), p);
      }
    }

    // Insert tournament record
    const tournamentData = {
      event_name: dgData?.event_name || dkData.tournament,
      course_name: dgData?.course_name || null,
      snapshot_date: new Date().toISOString().split('T')[0],
      platform: 'draftkings',
      dk_draft_group_id: dkData.draftGroupId,
      data_golf_active: !!dgData,
      player_count: dkData.golfers.length,
    };

    const [tournament] = await supabaseQuery('/dfs_tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    });

    // Insert player snapshots
    const playerRows = dkData.golfers.map(g => {
      const norm = normalizeName(g.name);
      const dg = dgMap.get(norm);

      return {
        tournament_id: tournament.id,
        player_name: g.name,
        dk_salary: g.salary,
        dk_fppg: g.fppg,
        dg_proj_points: dg?.proj_points ?? null,
        dg_proj_ownership: dg?.proj_ownership ?? null,
        dg_proj_std_dev: dg?.proj_std_dev ?? null,
        dg_sg_total: dg?.sg_total ?? null,
        dg_sg_ott: dg?.sg_ott ?? null,
        dg_sg_app: dg?.sg_app ?? null,
        dg_sg_arg: dg?.sg_arg ?? null,
        dg_sg_putt: dg?.sg_putt ?? null,
        dg_course_fit_adj: dg?.course_fit_adjustment ?? null,
        dg_course_history_adj: dg?.course_history_adjustment ?? null,
        dg_win_prob: dg?.win_prob ?? null,
        dg_top5_prob: dg?.top5_prob ?? null,
        dg_top10_prob: dg?.top10_prob ?? null,
        dg_top20_prob: dg?.top20_prob ?? null,
        dg_make_cut_prob: dg?.make_cut_prob ?? null,
      };
    });

    await supabaseQuery('/dfs_player_snapshots', {
      method: 'POST',
      body: JSON.stringify(playerRows),
    });

    return NextResponse.json({
      message: 'Snapshot saved',
      tournament: tournamentData.event_name,
      players: playerRows.length,
      dgMatched: playerRows.filter(p => p.dg_proj_points !== null).length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Snapshot cron error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ── Results Mode (Sunday) ────────────────────

async function handleResults() {
  try {
    // Fetch live results from Data Golf
    const liveData = await fetchLiveResults();

    if (!liveData.positions.length) {
      return NextResponse.json({
        message: 'No live results available — tournament may not have started',
        timestamp: new Date().toISOString(),
      });
    }

    // Find the most recent tournament in our DB for this event
    const tournaments = await supabaseQuery(
      `/dfs_tournaments?event_name=eq.${encodeURIComponent(liveData.event_name)}&order=snapshot_date.desc&limit=1`
    );

    if (!tournaments.length) {
      return NextResponse.json({
        message: `No snapshot found for "${liveData.event_name}" — nothing to update`,
        timestamp: new Date().toISOString(),
      });
    }

    const tournament = tournaments[0];

    // Get all player snapshots for this tournament
    const snapshots = await supabaseQuery(
      `/dfs_player_snapshots?tournament_id=eq.${tournament.id}&select=id,player_name`
    );

    if (!snapshots.length) {
      return NextResponse.json({
        message: 'No player snapshots found for this tournament',
        timestamp: new Date().toISOString(),
      });
    }

    // Build lookup maps from live data by normalized name
    const positionMap = new Map<string, { current_pos: string; r3: number | null; r4: number | null }>();
    for (const p of liveData.positions) {
      positionMap.set(normalizeName(p.player_name), {
        current_pos: p.current_pos,
        r3: p.r3,
        r4: p.r4,
      });
    }

    const statsMap = new Map<string, number>();
    for (const p of liveData.stats) {
      statsMap.set(normalizeName(p.player_name), p.sg_total);
    }

    // Update each player snapshot with actual results
    let updated = 0;
    for (const snap of snapshots) {
      const norm = normalizeName(snap.player_name);
      const pos = positionMap.get(norm);
      if (!pos) continue;

      // A player made the cut if they have R3 or R4 scores
      const madeCut = pos.r3 !== null || pos.r4 !== null;
      const actualSgTotal = statsMap.get(norm) ?? null;

      await supabaseQuery(`/dfs_player_snapshots?id=eq.${snap.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          actual_finish_position: pos.current_pos,
          made_cut: madeCut,
          actual_sg_total: actualSgTotal,
        }),
      });

      updated++;
    }

    return NextResponse.json({
      message: 'Results updated',
      tournament: liveData.event_name,
      totalSnapshots: snapshots.length,
      updated,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Results cron error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
