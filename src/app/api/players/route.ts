import { NextRequest, NextResponse } from 'next/server';
import { Golfer } from '@/lib/types';
import { getDKGolfers } from '@/lib/draftkings';
import { parseFanDuelCSV } from '@/lib/fanduel';
import { fetchAllDGData, normalizeName, DGEnrichedPlayer } from '@/lib/datagolf';

/**
 * Merge Data Golf enrichment data onto a Golfer by fuzzy name match.
 */
function enrichGolfer(golfer: Golfer, dgMap: Map<string, DGEnrichedPlayer>): Golfer {
  const norm = normalizeName(golfer.name);
  const dg = dgMap.get(norm);
  if (!dg) return golfer;

  return {
    ...golfer,
    // Override fppg with DG's superior projection if available
    fppg: dg.proj_points > 0 ? dg.proj_points : golfer.fppg,
    ownership: dg.proj_ownership ?? golfer.ownership,
    value: dg.proj_points > 0
      ? (dg.proj_points / golfer.salary) * 1000
      : golfer.value,
    dg: {
      projPoints: dg.proj_points,
      projOwnership: dg.proj_ownership,
      projStdDev: dg.proj_std_dev,
      sgOtt: dg.sg_ott,
      sgApp: dg.sg_app,
      sgArg: dg.sg_arg,
      sgPutt: dg.sg_putt,
      sgTotal: dg.sg_total,
      courseFitAdj: dg.course_fit_adjustment,
      courseHistoryAdj: dg.course_history_adjustment,
      baselinePred: dg.baseline_pred,
      finalPred: dg.final_pred,
      winProb: dg.win_prob,
      top5Prob: dg.top5_prob,
      top10Prob: dg.top10_prob,
      top20Prob: dg.top20_prob,
      makeCutProb: dg.make_cut_prob,
    },
  };
}

/** GET: Fetch DraftKings golfers + Data Golf enrichment */
export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform') || 'draftkings';

  try {
    if (platform === 'draftkings') {
      // Fetch DK slate and DG data in parallel
      const [dkData, dgData] = await Promise.all([
        getDKGolfers(),
        fetchAllDGData('draftkings').catch(err => {
          console.warn('Data Golf fetch failed, using DK data only:', err.message);
          return null;
        }),
      ]);

      let golfers = dkData.golfers;

      if (dgData) {
        // Build DG lookup map
        const dgMap = new Map<string, DGEnrichedPlayer>();
        for (const p of dgData.players) {
          dgMap.set(normalizeName(p.player_name), p);
        }
        // Enrich each golfer
        golfers = golfers.map(g => enrichGolfer(g, dgMap));
        // Re-sort by DG projected points (better than DK's historical FPPG)
        golfers.sort((a, b) => b.fppg - a.fppg);
      }

      const matchedCount = golfers.filter(g => g.dg).length;

      return NextResponse.json({
        golfers,
        draftGroupId: dkData.draftGroupId,
        tournament: dgData?.event_name || dkData.tournament,
        course: dgData?.course_name || null,
        lastUpdated: dgData?.last_updated || null,
        dataGolfActive: !!dgData,
        matchedPlayers: matchedCount,
        totalPlayers: golfers.length,
      });
    }

    return NextResponse.json(
      { error: 'Use POST with CSV body for FanDuel players' },
      { status: 400 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** POST: Parse uploaded FanDuel CSV + Data Golf enrichment */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('csv') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No CSV file provided' }, { status: 400 });
    }

    const text = await file.text();
    let golfers = parseFanDuelCSV(text);

    // Try to enrich with Data Golf FanDuel projections
    const dgData = await fetchAllDGData('fanduel').catch(err => {
      console.warn('Data Golf FD fetch failed:', err.message);
      return null;
    });

    if (dgData) {
      const dgMap = new Map<string, DGEnrichedPlayer>();
      for (const p of dgData.players) {
        dgMap.set(normalizeName(p.player_name), p);
      }
      golfers = golfers.map(g => enrichGolfer(g, dgMap));
      golfers.sort((a, b) => b.fppg - a.fppg);
    }

    const matchedCount = golfers.filter(g => g.dg).length;

    return NextResponse.json({
      golfers,
      tournament: dgData?.event_name || 'FanDuel Upload',
      course: dgData?.course_name || null,
      lastUpdated: dgData?.last_updated || null,
      dataGolfActive: !!dgData,
      matchedPlayers: matchedCount,
      totalPlayers: golfers.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
