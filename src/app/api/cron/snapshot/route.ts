import { NextRequest, NextResponse } from 'next/server';
import { fetchAllDGData } from '@/lib/datagolf';
import { getDKGolfers } from '@/lib/draftkings';
import { normalizeName, DGEnrichedPlayer } from '@/lib/datagolf';

/**
 * Weekly snapshot cron — captures the full DK slate + DG projections
 * into Supabase for backtesting.
 *
 * Runs via Vercel cron every Wednesday at 18:00 UTC (after slates open)
 * and Sunday at 23:00 UTC (to capture final results via DG live stats).
 *
 * POST /api/cron/snapshot
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
