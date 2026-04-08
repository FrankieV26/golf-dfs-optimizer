// ──────────────────────────────────────────────
// Data Golf API Client
// ──────────────────────────────────────────────
// Fetches real projections, strokes-gained data,
// ownership, and tournament probabilities.
// API docs: https://datagolf.com/api-access
// Auth: query param key=...
// Rate limit: 45 req/min (5-min suspension if exceeded)
// ──────────────────────────────────────────────

import { normalizeName } from './normalize-name';

const BASE = 'https://feeds.datagolf.com';

/**
 * Cache DG responses for 5 min on Tue/Wed (lineup-building days),
 * 15 min otherwise. Uses Eastern Time since PGA events are US-based.
 */
function getDGRevalidate(): number {
  const et = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const day = new Date(et).getDay(); // 0=Sun, 2=Tue, 3=Wed
  return day === 2 || day === 3 ? 300 : 900;
}

function apiKey(): string {
  const key = process.env.DATAGOLF_API_KEY;
  if (!key) throw new Error('DATAGOLF_API_KEY not set');
  return key;
}

function url(path: string, params: Record<string, string> = {}): string {
  const qs = new URLSearchParams({ ...params, key: apiKey() });
  return `${BASE}${path}?${qs}`;
}

/** Cached fetch wrapper — uses Next.js data cache on Vercel */
function cachedFetch(input: string): Promise<Response> {
  return fetch(input, { next: { revalidate: getDGRevalidate() } });
}

// ── Types ────────────────────────────────────

export interface DGProjection {
  dg_id: number;
  player_name: string;          // "Scheffler, Scottie"
  salary: number;
  proj_points_total: number;
  proj_points_scoring: number;
  proj_points_finish: number;
  proj_ownership: number | null;
  std_dev: number;
  value: number;
  early_late_wave: number | null;
  r1_teetime: string | null;
  site_name_id: string;
}

export interface DGProjectionResponse {
  event_name: string;
  last_updated: string;
  note: string;
  projections: DGProjection[];
}

export interface DGSkillRating {
  dg_id: number;
  player_name: string;
  sg_total: number;
  sg_ott: number;
  sg_app: number;
  sg_arg: number;
  sg_putt: number;
  driving_dist: number;
  driving_acc: number;
}

export interface DGSkillRatingsResponse {
  last_updated: string;
  players: DGSkillRating[];
}

export interface DGDecomposition {
  dg_id: number;
  player_name: string;
  am: number;
  country: string;
  age: number;
  sample_size: number;
  baseline_pred: number;
  final_pred: number;
  std_deviation: number;
  total_course_history_adjustment: number;
  total_fit_adjustment: number;
  driving_accuracy_adjustment: number;
  driving_distance_adjustment: number;
  strokes_gained_category_adjustment: number;
}

export interface DGDecompositionResponse {
  course_name: string;
  event_name: string;
  last_updated: string;
  players: DGDecomposition[];
}

export interface DGPreTournamentPlayer {
  dg_id: number;
  player_name: string;
  am: number;
  country: string;
  sample_size: number;
  win: number;
  top_5: number;
  top_10: number;
  top_20: number;
  make_cut: number;
}

export interface DGPreTournamentResponse {
  event_name: string;
  last_updated: string;
  baseline_history_fit: DGPreTournamentPlayer[];
  baseline: DGPreTournamentPlayer[];
}

export interface DGFieldPlayer {
  dg_id: number;
  player_name: string;
  country: string;
  am: number;
}

export interface DGFieldResponse {
  event_name: string;
  course_name: string;
  field: DGFieldPlayer[];
}

// ── API Fetchers ─────────────────────────────

/**
 * Fantasy projection defaults — THE primary DFS endpoint.
 * Returns salaries, projected points, ownership, std_dev per player.
 */
export async function fetchProjections(
  site: 'draftkings' | 'fanduel' = 'draftkings',
  tour = 'pga'
): Promise<DGProjectionResponse> {
  const res = await cachedFetch(url('/preds/fantasy-projection-defaults', {
    tour,
    site,
    slate: 'main',
    file_format: 'json',
  }));
  if (!res.ok) throw new Error(`DG projections: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * True talent strokes-gained breakdown per player.
 * Returns sg_ott, sg_app, sg_arg, sg_putt, sg_total.
 */
export async function fetchSkillRatings(): Promise<DGSkillRatingsResponse> {
  const res = await cachedFetch(url('/preds/skill-ratings', {
    display: 'value',
    file_format: 'json',
  }));
  if (!res.ok) throw new Error(`DG skill ratings: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Course-specific player decompositions.
 * Shows how much course fit helps/hurts each player for the current event.
 */
export async function fetchDecompositions(
  tour = 'pga'
): Promise<DGDecompositionResponse> {
  const res = await cachedFetch(url('/preds/player-decompositions', {
    tour,
    file_format: 'json',
  }));
  if (!res.ok) throw new Error(`DG decompositions: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Pre-tournament win/top/cut probabilities.
 * Uses the baseline_history_fit model (skill + course history + course fit).
 */
export async function fetchPreTournament(
  tour = 'pga'
): Promise<DGPreTournamentResponse> {
  const res = await cachedFetch(url('/preds/pre-tournament', {
    tour,
    odds_format: 'percent',
    file_format: 'json',
  }));
  if (!res.ok) throw new Error(`DG pre-tournament: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Current tournament field with player IDs.
 */
export async function fetchField(tour = 'pga'): Promise<DGFieldResponse> {
  const res = await cachedFetch(url('/field-updates', {
    tour,
    file_format: 'json',
  }));
  if (!res.ok) throw new Error(`DG field: ${res.status} ${res.statusText}`);
  return res.json();
}

// ── Live Results (post-tournament) ───────────

export interface DGLiveStatsPlayer {
  dg_id: number;
  player_name: string;
  sg_total: number;
  [key: string]: unknown;
}

export interface DGLiveStatsResponse {
  event_name: string;
  last_updated: string;
  live_stats: DGLiveStatsPlayer[];
}

export interface DGInPlayPlayer {
  dg_id: number;
  player_name: string;
  current_pos: string;       // e.g. "1", "T5", "MC"
  current_round: number;
  thru: number | string;
  today: number;
  total: number;
  r1: number | null;
  r2: number | null;
  r3: number | null;
  r4: number | null;
  [key: string]: unknown;
}

export interface DGInPlayResponse {
  event_name: string;
  last_updated: string;
  data: DGInPlayPlayer[];
}

/**
 * Fetch live tournament stats (SG: Total for the event)
 * and in-play positions (finish position, round scores).
 * Used by the Sunday results cron to backfill actual results.
 */
export async function fetchLiveResults(tour = 'pga'): Promise<{
  event_name: string;
  stats: DGLiveStatsPlayer[];
  positions: DGInPlayPlayer[];
}> {
  const [statsRes, inPlayRes] = await Promise.all([
    fetch(url('/preds/live-tournament-stats', {
      stats: 'sg_total',
      round: 'event_avg',
      display: 'value',
      file_format: 'json',
    })),
    fetch(url('/preds/in-play', {
      tour,
      odds_format: 'percent',
      file_format: 'json',
    })),
  ]);

  if (!statsRes.ok) throw new Error(`DG live stats: ${statsRes.status} ${statsRes.statusText}`);
  if (!inPlayRes.ok) throw new Error(`DG in-play: ${inPlayRes.status} ${inPlayRes.statusText}`);

  const statsData: DGLiveStatsResponse = await statsRes.json();
  const inPlayData: DGInPlayResponse = await inPlayRes.json();

  return {
    event_name: statsData.event_name || inPlayData.event_name,
    stats: statsData.live_stats ?? [],
    positions: inPlayData.data ?? [],
  };
}

// ── Name Matching ────────────────────────────

// Re-export from the shared client-safe module so existing imports still work.
export { normalizeName } from './normalize-name';

/**
 * Build a lookup map from normalized name to Data Golf data.
 */
export function buildNameMap<T extends { player_name: string }>(
  players: T[]
): Map<string, T> {
  const map = new Map<string, T>();
  for (const p of players) {
    map.set(normalizeName(p.player_name), p);
  }
  return map;
}

// ── Merged Fetch ─────────────────────────────

export interface DGEnrichedPlayer {
  dg_id: number;
  player_name: string;
  // Projections
  proj_points: number;
  proj_ownership: number | null;
  proj_std_dev: number;
  proj_value: number;
  // SG breakdown (true talent)
  sg_ott: number;
  sg_app: number;
  sg_arg: number;
  sg_putt: number;
  sg_total: number;
  // Course fit
  course_fit_adjustment: number;
  course_history_adjustment: number;
  baseline_pred: number;
  final_pred: number;
  // Tournament probabilities
  win_prob: number;
  top5_prob: number;
  top10_prob: number;
  top20_prob: number;
  make_cut_prob: number;
}

/**
 * Fetch all Data Golf data for the current event and merge by player.
 * This is the one-stop function that replaces all mock data.
 */
export async function fetchAllDGData(
  site: 'draftkings' | 'fanduel' = 'draftkings'
): Promise<{
  players: DGEnrichedPlayer[];
  event_name: string;
  course_name: string;
  last_updated: string;
}> {
  // Fetch all endpoints in parallel (4 requests, well within 45/min limit)
  const [projections, skills, decomps, preTourney] = await Promise.all([
    fetchProjections(site),
    fetchSkillRatings(),
    fetchDecompositions(),
    fetchPreTournament(),
  ]);

  // Build lookup maps by normalized name
  const skillMap = buildNameMap(skills.players);
  const decompMap = buildNameMap(decomps.players);
  // Use baseline_history_fit model (includes course fit) if available, else baseline
  const tourneyPlayers = preTourney.baseline_history_fit || preTourney.baseline || [];
  const tourneyMap = buildNameMap(tourneyPlayers);

  // Merge everything keyed on the projections list (those are the players in the DFS slate)
  const players: DGEnrichedPlayer[] = projections.projections.map(proj => {
    const norm = normalizeName(proj.player_name);
    const skill = skillMap.get(norm);
    const decomp = decompMap.get(norm);
    const tourney = tourneyMap.get(norm);

    return {
      dg_id: proj.dg_id,
      player_name: proj.player_name,
      // Projections
      proj_points: proj.proj_points_total,
      proj_ownership: proj.proj_ownership,
      proj_std_dev: proj.std_dev,
      proj_value: proj.value,
      // SG (default to 0 if not in skill ratings — amateurs, etc.)
      sg_ott: skill?.sg_ott ?? 0,
      sg_app: skill?.sg_app ?? 0,
      sg_arg: skill?.sg_arg ?? 0,
      sg_putt: skill?.sg_putt ?? 0,
      sg_total: skill?.sg_total ?? 0,
      // Course fit
      course_fit_adjustment: decomp?.total_fit_adjustment ?? 0,
      course_history_adjustment: decomp?.total_course_history_adjustment ?? 0,
      baseline_pred: decomp?.baseline_pred ?? 0,
      final_pred: decomp?.final_pred ?? 0,
      // Tournament probs
      win_prob: tourney?.win ?? 0,
      top5_prob: tourney?.top_5 ?? 0,
      top10_prob: tourney?.top_10 ?? 0,
      top20_prob: tourney?.top_20 ?? 0,
      make_cut_prob: tourney?.make_cut ?? 0,
    };
  });

  return {
    players,
    event_name: projections.event_name,
    course_name: decomps.course_name || projections.event_name,
    last_updated: projections.last_updated,
  };
}
