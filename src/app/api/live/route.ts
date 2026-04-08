import { NextResponse } from 'next/server';
import { fetchLiveResults, normalizeName } from '@/lib/datagolf';
import { fetchDKContests, fetchDKDraftables } from '@/lib/draftkings';
import { COURSE_DATA } from '@/lib/course-data';

export const dynamic = 'force-dynamic';

/** Match a tournament name to course data */
function findCourse(tournamentName: string) {
  const lower = tournamentName.toLowerCase();
  for (const course of Object.values(COURSE_DATA)) {
    if (lower.includes(course.tournamentName.toLowerCase()) ||
        course.tournamentName.toLowerCase().includes(lower)) {
      return course;
    }
  }
  // Fuzzy match on key words (e.g. "Masters" → "The Masters Tournament")
  const keywords = lower.split(/\s+/);
  for (const course of Object.values(COURSE_DATA)) {
    const cLower = course.tournamentName.toLowerCase();
    if (keywords.some((kw) => kw.length > 4 && cLower.includes(kw))) {
      return course;
    }
  }
  return null;
}

/** Get the next tournament name and start time from DK lobby */
async function getNextTournament(): Promise<{
  name: string;
  startTime: string;
  location: string | null;
  courseSlug: string | null;
  courseName: string | null;
} | null> {
  try {
    const { draftGroups, contests } = await fetchDKContests();
    if (draftGroups.length === 0) return null;

    // Find the Classic draft group (gameTypeId 6)
    const classicDgIds = new Set(
      contests.filter((c: { gameTypeId: number }) => c.gameTypeId === 6).map((c: { dg: number }) => c.dg)
    );
    const classicGroup = draftGroups.find(
      (g) => classicDgIds.has(g.DraftGroupId) && g.GameCount > 0
    ) ?? draftGroups.filter((g) => g.GameCount > 0).sort(
      (a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
    )[0];

    if (!classicGroup) return null;

    // Fetch one draftable to get the tournament name
    let name = 'PGA Tournament';
    try {
      const draftables = await fetchDKDraftables(classicGroup.DraftGroupId);
      if (draftables[0]?.competition?.name) {
        name = draftables[0].competition.name;
      }
    } catch { /* use fallback name */ }

    const course = findCourse(name);
    return {
      name,
      startTime: classicGroup.StartDate,
      location: course?.location ?? null,
      courseSlug: course?.slug ?? null,
      courseName: course?.courseName ?? null,
    };
  } catch {
    return null;
  }
}

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

    // Also fetch next tournament info for the countdown
    const nextTournament = await getNextTournament();

    return NextResponse.json(
      {
        event_name: data.event_name,
        last_updated: new Date().toISOString(),
        leaderboard,
        nextTournament,
      },
      {
        headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
      }
    );
  } catch (err) {
    // If live data fails, still try to return next tournament for countdown
    const nextTournament = await getNextTournament();
    if (nextTournament) {
      return NextResponse.json(
        {
          event_name: null,
          last_updated: new Date().toISOString(),
          leaderboard: [],
          nextTournament,
        },
        {
          headers: {
            'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
          },
        }
      );
    }
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
