// ──────────────────────────────────────────────
// DraftKings API Client for Golf
// ──────────────────────────────────────────────

import { Golfer } from './types';

const DK_API = 'https://api.draftkings.com';

interface DKDraftGroup {
  DraftGroupId: number;
  ContestTypeId: number;
  StartDate: string;
  StartDateEst: string;
  GameCount: number;
  GameTypeId?: number;
  ContestStartTimeSuffix: string | null;
  ContestStartTimeType: number;
  Games: unknown[];
}

interface DKDraftable {
  draftableId: number;
  displayName: string;
  position: string;
  salary: number;
  teamAbbreviation: string;
  draftStatAttributes: { value: number }[];
  competition?: {
    name: string;
    startTime: string;
  };
  status?: string;
}

interface DKContest {
  dg: number;        // DraftGroupId reference
  gameTypeId: number; // 6 = Classic, 84 = Showdown, 135 = Tiers
}

/** Fetch active golf contests from DraftKings lobby */
export async function fetchDKContests(): Promise<{
  draftGroups: DKDraftGroup[];
  contests: DKContest[];
  raw: Record<string, unknown>;
}> {
  const res = await fetch(
    'https://www.draftkings.com/lobby/getcontests?sport=GOLF'
  );
  if (!res.ok) throw new Error(`DK contests API: ${res.status}`);
  const data = await res.json();
  return {
    draftGroups: data.DraftGroups || [],
    contests: data.Contests || [],
    raw: data,
  };
}

/** Fetch all draftable players for a draft group */
export async function fetchDKDraftables(
  draftGroupId: number
): Promise<DKDraftable[]> {
  const res = await fetch(
    `${DK_API}/draftgroups/v1/draftgroups/${draftGroupId}/draftables?format=json`
  );
  if (!res.ok) throw new Error(`DK draftables API: ${res.status}`);
  const data = await res.json();
  return data.draftables || [];
}

/** Convert DK draftables into our Golfer format */
export function parseDKGolfers(draftables: DKDraftable[]): Golfer[] {
  return draftables
    .filter((p) => p.salary > 0 && p.status !== 'O') // exclude $0 and injured-out
    .map((p) => {
      const fppg = p.draftStatAttributes?.[0]?.value ?? 0;
      return {
        id: p.draftableId,
        name: p.displayName,
        salary: p.salary,
        fppg,
        team: p.teamAbbreviation || '',
        gameInfo: p.competition?.name || '',
        value: fppg > 0 ? (fppg / p.salary) * 1000 : 0,
      };
    })
    .sort((a, b) => b.fppg - a.fppg);
}

/** High-level: get current golf slate golfers from DK */
export async function getDKGolfers(): Promise<{
  golfers: Golfer[];
  draftGroupId: number;
  tournament: string;
}> {
  const { draftGroups, contests } = await fetchDKContests();

  if (draftGroups.length === 0) {
    throw new Error('No active DraftKings golf contests found');
  }

  // Find draft group IDs used by Classic contests (gameTypeId 6)
  const classicDgIds = new Set(
    contests.filter((c) => c.gameTypeId === 6).map((c) => c.dg)
  );

  // Prefer Classic draft group; fall back to largest by GameCount
  let mainGroup: DKDraftGroup | undefined;
  if (classicDgIds.size > 0) {
    mainGroup = draftGroups
      .filter((g) => classicDgIds.has(g.DraftGroupId) && g.GameCount > 0)
      .sort((a, b) => b.GameCount - a.GameCount)[0];
  }
  if (!mainGroup) {
    mainGroup = draftGroups
      .filter((g) => g.GameCount > 0)
      .sort((a, b) => b.GameCount - a.GameCount)[0];
  }
  if (!mainGroup) {
    throw new Error('No active DraftKings golf contests found');
  }

  const draftables = await fetchDKDraftables(mainGroup.DraftGroupId);
  const golfers = parseDKGolfers(draftables);

  // Extract tournament name from first competition
  const tournament =
    draftables[0]?.competition?.name || 'PGA Tournament';

  return {
    golfers,
    draftGroupId: mainGroup.DraftGroupId,
    tournament,
  };
}
