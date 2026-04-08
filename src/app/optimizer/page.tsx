'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Golfer,
  Lineup,
  Platform,
  OptimizerSettings,
  DEFAULT_SETTINGS,
  PLATFORM_CONFIGS,
} from '@/lib/types';
import { SimulationResult } from '@/lib/simulation';
import { normalizeName } from '@/lib/normalize-name';
import { COURSE_PROFILES } from '@/lib/course-fit';
import GolferTable, { GolferSortField } from '@/components/GolferTable';
import LineupResults from '@/components/LineupResults';
import SimulationTable from '@/components/SimulationTable';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';

/** Match a DG course name (e.g. "Augusta National Golf Club") to a known profile key */
function matchCourseProfile(courseName: string): string | null {
  if (!courseName) return null;
  const lower = courseName.toLowerCase();
  const matchers: [string, string][] = [
    ['augusta', 'augusta-national'],
    ['sawgrass', 'tpc-sawgrass'],
    ['pebble', 'pebble-beach'],
    ['torrey', 'torrey-pines-south'],
    ['bay hill', 'bay-hill'],
    ['scottsdale', 'tpc-scottsdale'],
    ['valhalla', 'valhalla'],
    ['pinehurst', 'pinehurst-no2'],
  ];
  for (const [keyword, profileId] of matchers) {
    if (lower.includes(keyword)) return profileId;
  }
  return null;
}

/** Compute course fit stats from golfer data */
function getCourseFitStats(golfers: readonly { dg?: { courseFitAdj: number } }[], weight: number) {
  const SG_TO_FPTS = 3.0;
  const adjs = golfers
    .map(g => (g.dg?.courseFitAdj ?? 0) * weight * SG_TO_FPTS)
    .filter(v => v !== 0);
  if (adjs.length === 0) return null;
  return {
    min: Math.min(...adjs),
    max: Math.max(...adjs),
    count: adjs.length,
  };
}

type Tab = 'players' | 'simulation' | 'lineups';

// ── CSV column detection (lenient) ──────────────────────
function findCol(headers: string[], variants: string[]): number {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const v of variants) {
    const idx = lower.indexOf(v.toLowerCase());
    if (idx !== -1) return idx;
  }
  return -1;
}

interface ParsedProjection {
  name: string;
  fppg: number;
  ownership?: number;
}

function parseProjectionCSV(text: string): ParsedProjection[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const delim = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delim);
  const nameIdx = findCol(headers, ['Name', 'Player', 'Player Name', 'Golfer']);
  const projIdx = findCol(headers, ['Projection', 'Points', 'FPPG', 'Proj', 'FantasyPoints', 'Fantasy Points', 'FP', 'Pts']);
  const ownIdx = findCol(headers, ['Ownership', 'Own', 'Own%', 'Ownership%', 'pOwn']);
  if (nameIdx === -1 || projIdx === -1) return [];
  const results: ParsedProjection[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delim);
    const rawName = cols[nameIdx]?.trim();
    const rawProj = parseFloat(cols[projIdx]?.trim());
    if (!rawName || isNaN(rawProj)) continue;
    const entry: ParsedProjection = { name: rawName, fppg: rawProj };
    if (ownIdx !== -1) {
      const rawOwn = parseFloat(cols[ownIdx]?.trim().replace('%', ''));
      if (!isNaN(rawOwn)) entry.ownership = rawOwn;
    }
    results.push(entry);
  }
  return results;
}

export default function OptimizerPage() {
  const [platform, setPlatform] = useState<Platform>('draftkings');
  const [golfers, setGolfers] = useState<Golfer[]>([]);
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [simResults, setSimResults] = useState<SimulationResult[]>([]);
  const [elapsed, setElapsed] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState('');
  const [courseName, setCourseName] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('players');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Settings
  const [maxLineups, setMaxLineups] = useState(DEFAULT_SETTINGS.maxLineups);
  const [maxExposure, setMaxExposure] = useState(DEFAULT_SETTINGS.maxExposure);
  const [useGPPMode, setUseGPPMode] = useState(false);
  const [courseFitWeight, setCourseFitWeight] = useState(DEFAULT_SETTINGS.courseFitWeight);

  // Player locks/exclusions
  const [lockedIds, setLockedIds] = useState<Set<number>>(new Set());
  const [excludedIds, setExcludedIds] = useState<Set<number>>(new Set());

  // Custom projections
  const [customProjMsg, setCustomProjMsg] = useState<string | null>(null);
  const [customProjCount, setCustomProjCount] = useState(0);
  const projFileRef = useRef<HTMLInputElement>(null);

  // Sorting
  const [sortField, setSortField] = useState<GolferSortField>('fppg');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const config = PLATFORM_CONFIGS[platform];
  const { toast } = useToast();

  const fetchPlayers = useCallback(async () => {
    setLoadingPlayers(true);
    setError(null);
    try {
      const res = await fetch(`/api/players?platform=${platform}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const fetchedGolfers = data.golfers || [];
      setGolfers(fetchedGolfers);
      setTournament(data.tournament || '');
      setCourseName(data.course || '');
      setSimResults(data.simResults || []);
      if (fetchedGolfers.length === 0 && data.tournament) {
        setError(`No active DraftKings slate found for ${data.tournament}. The main slate typically opens Tuesday or Wednesday before each tournament.`);
      } else if (fetchedGolfers.length > 0) {
        toast(`Loaded ${fetchedGolfers.length} golfers`, 'success');
      }
      setLockedIds(new Set());
      setExcludedIds(new Set());
      setLineups([]);
      setCustomProjCount(0);
      setCustomProjMsg(null);
      setActiveTab('players');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load players';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoadingPlayers(false);
    }
  }, [platform, toast]);

  // Auto-fetch DK slate on page load
  useEffect(() => {
    if (platform === 'draftkings') {
      fetchPlayers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter = Generate Lineups
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && golfers.length >= 6 && !loading) {
        e.preventDefault();
        runOptimizer();
      }
      // Ctrl/Cmd + 1/2/3 = Switch tabs
      if ((e.metaKey || e.ctrlKey) && e.key === '1') { e.preventDefault(); setActiveTab('players'); }
      if ((e.metaKey || e.ctrlKey) && e.key === '2') { e.preventDefault(); setActiveTab('simulation'); }
      if ((e.metaKey || e.ctrlKey) && e.key === '3') { e.preventDefault(); setActiveTab('lineups'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [golfers.length, loading]);

  const handleCSVUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoadingPlayers(true);
      setError(null);
      try {
        const form = new FormData();
        form.append('csv', file);
        const res = await fetch('/api/players', { method: 'POST', body: form });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setGolfers(data.golfers || []);
        setTournament(data.tournament || 'FanDuel Upload');
        setCourseName(data.course || '');
        setSimResults(data.simResults || []);
        setLockedIds(new Set());
        setExcludedIds(new Set());
        setLineups([]);
        setCustomProjCount(0);
        setCustomProjMsg(null);
        setActiveTab('players');
        toast(`Loaded ${(data.golfers || []).length} golfers from CSV`, 'success');
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to parse CSV';
        setError(msg);
        toast(msg, 'error');
      } finally {
        setLoadingPlayers(false);
      }
    },
    [toast]
  );

  // ── Custom projection upload + blend ────────────────────
  const handleProjectionUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const parsed = parseProjectionCSV(text);
        if (parsed.length === 0) {
          setError('Could not parse projections CSV. Make sure it has "Name" and "Projection" (or "Points" / "FPPG") columns.');
          return;
        }
        const projMap = new Map<string, ParsedProjection>();
        for (const p of parsed) {
          projMap.set(normalizeName(p.name), p);
        }
        let matched = 0;
        setGolfers((prev) =>
          prev.map((g) => {
            const norm = normalizeName(g.name);
            const custom = projMap.get(norm);
            if (!custom) {
              if (g.customProj) {
                const origFppg = g.customProj.origFppg;
                const origOwn = g.customProj.origOwnership;
                return {
                  ...g,
                  fppg: origFppg,
                  ownership: origOwn,
                  value: Math.round((origFppg / g.salary) * 1000 * 100) / 100,
                  customProj: undefined,
                };
              }
              return g;
            }
            matched++;
            const hasDg = g.dg != null;
            const blended = hasDg;
            const origFppg = g.customProj ? g.customProj.origFppg : g.fppg;
            const origOwnership = g.customProj ? g.customProj.origOwnership : g.ownership;
            const newFppg = hasDg
              ? (custom.fppg + g.dg!.projPoints) / 2
              : custom.fppg;
            const newOwnership =
              custom.ownership != null
                ? hasDg && g.dg!.projOwnership != null
                  ? (custom.ownership + g.dg!.projOwnership) / 2
                  : custom.ownership
                : origOwnership;
            return {
              ...g,
              fppg: Math.round(newFppg * 100) / 100,
              ownership: newOwnership != null ? Math.round(newOwnership * 100) / 100 : undefined,
              value: Math.round((newFppg / g.salary) * 1000 * 100) / 100,
              customProj: {
                fppg: custom.fppg,
                ownership: custom.ownership,
                blended,
                origFppg,
                origOwnership,
              },
            };
          })
        );
        setCustomProjCount(matched);
        setCustomProjMsg(`${matched} of ${parsed.length} players matched`);
        setLineups([]);
        setSimResults([]);
        toast(`Custom projections: ${matched} of ${parsed.length} matched`, matched > 0 ? 'success' : 'info');
      };
      reader.readAsText(file);
      if (projFileRef.current) projFileRef.current.value = '';
    },
    [toast]
  );

  const clearCustomProjections = useCallback(() => {
    setGolfers((prev) =>
      prev.map((g) => {
        if (!g.customProj) return g;
        const origFppg = g.customProj.origFppg;
        const origOwn = g.customProj.origOwnership;
        return {
          ...g,
          fppg: origFppg,
          ownership: origOwn,
          value: Math.round((origFppg / g.salary) * 1000 * 100) / 100,
          customProj: undefined,
        };
      })
    );
    setCustomProjCount(0);
    setCustomProjMsg(null);
    setLineups([]);
    setSimResults([]);
  }, []);

  const runOptimizer = useCallback(async () => {
    if (golfers.length < 6) {
      setError('Need at least 6 golfers to optimize');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const settings: OptimizerSettings = {
        platform,
        maxLineups,
        maxExposure,
        lockedGolfers: [...lockedIds],
        excludedGolfers: [...excludedIds],
        diversityWeight: useGPPMode ? 0.5 : 0.3,
        courseFitWeight,
      };
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ golfers, settings }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLineups(data.lineups || []);
      setElapsed(data.elapsed_ms);
      setActiveTab('lineups');
      toast(`${(data.lineups || []).length} lineups generated in ${data.elapsed_ms}ms`, 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Optimization failed';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [golfers, platform, maxLineups, maxExposure, lockedIds, excludedIds, useGPPMode, courseFitWeight, toast]);

  const toggleLock = (id: number) => {
    setLockedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= config.rosterSize) return prev;
        next.add(id);
        setExcludedIds((ex) => {
          const n = new Set(ex);
          n.delete(id);
          return n;
        });
      }
      return next;
    });
  };

  const toggleExclude = (id: number) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setLockedIds((lk) => {
          const n = new Set(lk);
          n.delete(id);
          return n;
        });
      }
      return next;
    });
  };

  const handleSort = (field: GolferSortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Course fit context
  const profileId = matchCourseProfile(courseName);
  const profile = profileId ? COURSE_PROFILES[profileId] : null;
  const hasDGFit = golfers.some(g => g.dg?.courseFitAdj && g.dg.courseFitAdj !== 0);
  const stats = getCourseFitStats(golfers, courseFitWeight);
  const recommended = profile && hasDGFit ? '50-75' : hasDGFit ? '25-50' : '0-25';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <NavBar maxWidth="max-w-7xl" />

      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Lineup Optimizer</h1>
          {tournament && <p className="text-gray-500 dark:text-gray-400 mt-1">{tournament}</p>}
        </div>

        {/* Controls card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 overflow-hidden">
          {/* Primary controls row */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Platform */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value as Platform);
                    setGolfers([]);
                    setLineups([]);
                    setSimResults([]);
                  }}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 hover:border-gray-400 transition-colors"
                >
                  <option value="draftkings">DraftKings ($50K)</option>
                  <option value="fanduel">FanDuel ($60K)</option>
                </select>
              </div>

              {/* Max Lineups */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Max Lineups</label>
                <input
                  type="number" min={1} max={150} value={maxLineups}
                  onChange={(e) => setMaxLineups(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-800 dark:text-gray-200 hover:border-gray-400 transition-colors"
                />
              </div>

              {/* Max Exposure */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Max Exposure
                  <Tooltip text="Maximum % of lineups any single golfer can appear in. Lower = more diverse lineups. 100% = no limit." />
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range" min={10} max={100} value={maxExposure}
                    onChange={(e) => setMaxExposure(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-10 text-right">{maxExposure}%</span>
                </div>
              </div>

              {/* Load/Upload button */}
              <div className="flex flex-col justify-end">
                {platform === 'draftkings' ? (
                  <button
                    onClick={fetchPlayers} disabled={loadingPlayers}
                    className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 active:scale-[0.97] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {loadingPlayers && <Spinner />}
                    {loadingPlayers ? 'Loading...' : 'Load DK Slate'}
                  </button>
                ) : (
                  <label className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 text-center cursor-pointer active:scale-[0.97] transition-all shadow-sm">
                    {loadingPlayers ? 'Parsing...' : 'Upload FD CSV'}
                    <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Advanced settings toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Advanced Settings
            </button>
          </div>

          {/* Advanced settings panel */}
          {showAdvanced && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100 dark:border-gray-800 pt-4 animate-expand">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Course Fit */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Course Fit
                    <Tooltip text="How much to boost/penalize players based on how their skill profile fits this week's course. 0% = projections only." />
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min={0} max={100} value={Math.round(courseFitWeight * 100)}
                      onChange={(e) => setCourseFitWeight(Number(e.target.value) / 100)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-10 text-right">{Math.round(courseFitWeight * 100)}%</span>
                  </div>
                  {golfers.length > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      {courseName && (
                        <p className="text-xs text-gray-500">
                          {profile ? (
                            <><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />{courseName} -- known profile</>
                          ) : (
                            <><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />{courseName} -- default profile</>
                          )}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recommended: <span className="font-medium text-gray-700 dark:text-gray-300">{recommended}%</span>
                        {!hasDGFit && <span className="ml-1">(no Data Golf fit data)</span>}
                      </p>
                      {stats && courseFitWeight > 0 && (
                        <p className="text-xs text-gray-500">
                          Impact: <span className="font-medium text-red-600">{stats.min > 0 ? '+' : ''}{stats.min.toFixed(1)}</span>
                          {' to '}
                          <span className="font-medium text-green-600">+{stats.max.toFixed(1)}</span>
                          {' pts across '}{stats.count} players
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* GPP Mode */}
                <div className="flex items-start pt-5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox" checked={useGPPMode}
                      onChange={(e) => setUseGPPMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus-visible:ring-2 peer-focus-visible:ring-green-500 peer-focus-visible:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600" />
                    <span className="ml-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">GPP Mode</span>
                    <Tooltip text="Guaranteed Prize Pool mode. Builds ownership-leveraged lineups optimized for large tournaments where differentiation wins." />
                  </label>
                </div>

                {/* Custom projections upload */}
                <div className="flex items-start pt-5">
                  <button
                    onClick={() => projFileRef.current?.click()}
                    className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50 active:scale-[0.97] transition-all flex items-center gap-2"
                    title="Upload a CSV with your own projections to blend with Data Golf data"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Projections
                  </button>
                  <input
                    ref={projFileRef}
                    type="file"
                    accept=".csv,.tsv,.txt"
                    className="hidden"
                    onChange={handleProjectionUpload}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status badges */}
          {(lockedIds.size > 0 || excludedIds.size > 0 || customProjCount > 0) && (
            <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-2 text-sm items-center">
              {lockedIds.size > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {lockedIds.size} locked
                </span>
              )}
              {excludedIds.size > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
                  {excludedIds.size} excluded
                </span>
              )}
              {customProjCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full text-xs font-medium">
                  Custom ({customProjCount})
                  <button
                    onClick={clearCustomProjections}
                    className="text-amber-600 hover:text-amber-900 font-bold leading-none ml-0.5"
                    title="Remove custom projections"
                  >
                    x
                  </button>
                </span>
              )}
              <button
                onClick={() => { setLockedIds(new Set()); setExcludedIds(new Set()); if (customProjCount > 0) clearCustomProjections(); }}
                className="text-gray-400 hover:text-gray-600 text-xs underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Generate button */}
          {golfers.length > 0 && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <button
                onClick={runOptimizer} disabled={loading}
                className="px-6 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-50 active:scale-[0.97] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {loading && <Spinner />}
                {loading ? 'Optimizing...' : 'Generate Lineups'}
                {!loading && (
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-green-300 bg-green-800/50 rounded ml-2">
                    Ctrl+Enter
                  </kbd>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 mb-6 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Custom projection banner */}
        {customProjMsg && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl px-4 py-3 mb-6 text-sm flex items-center justify-between">
            <span>
              Custom projections loaded: <strong>{customProjMsg}</strong>.
              {' '}Players with Data Golf data use a 50/50 blend.
            </span>
            <button
              onClick={() => setCustomProjMsg(null)}
              className="ml-4 text-amber-400 hover:text-amber-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Pill Tabs */}
        {!loadingPlayers && golfers.length > 0 && (
          <div className="mb-4 flex items-center">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
              <PillTab active={activeTab === 'players'} onClick={() => setActiveTab('players')} shortcut="1">
                Player Pool ({golfers.length})
              </PillTab>
              <PillTab active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} shortcut="2">
                Simulation {simResults.length > 0 && `(${simResults.length})`}
              </PillTab>
              <PillTab active={activeTab === 'lineups'} onClick={() => setActiveTab('lineups')} shortcut="3">
                Lineups {lineups.length > 0 && `(${lineups.length})`}
              </PillTab>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingPlayers && <LoadingSkeleton />}

        {/* Tab content */}
        {!loadingPlayers && activeTab === 'players' && golfers.length > 0 && (
          <GolferTable
            golfers={golfers}
            lockedIds={lockedIds}
            excludedIds={excludedIds}
            onToggleLock={toggleLock}
            onToggleExclude={toggleExclude}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
          />
        )}

        {!loadingPlayers && activeTab === 'simulation' && (
          simResults.length > 0 ? (
            <SimulationTable results={simResults} />
          ) : (
            <EmptyState
              icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
              title="No simulation data yet"
              description="Simulation results appear automatically when you load a slate with Data Golf projections."
            />
          )
        )}

        {!loadingPlayers && activeTab === 'lineups' && (
          lineups.length > 0 ? (
            <LineupResults lineups={lineups} elapsed_ms={elapsed} />
          ) : (
            <EmptyState
              icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>}
              title="No lineups generated yet"
              description='Click "Generate Lineups" to optimize your roster.'
              action={golfers.length >= 6 ? (
                <button
                  onClick={runOptimizer}
                  disabled={loading}
                  className="mt-3 px-5 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 active:scale-[0.97] transition-all shadow-sm"
                >
                  Generate Lineups
                </button>
              ) : undefined}
            />
          )
        )}

        {!loadingPlayers && golfers.length === 0 && !error && (
          <EmptyState
            icon={<svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>}
            title={platform === 'draftkings' ? 'Load a DraftKings slate to get started' : 'Upload a FanDuel CSV to get started'}
            description={`The optimizer finds the highest-scoring 6-golfer lineups under the ${platform === 'draftkings' ? '$50,000' : '$60,000'} salary cap.`}
            large
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-block ml-1">
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] cursor-help font-bold leading-none">?</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg">
        {text}
      </span>
    </span>
  );
}

function PillTab({ active, onClick, children, shortcut }: { active: boolean; onClick: () => void; children: React.ReactNode; shortcut?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {children}
      {shortcut && (
        <kbd className="hidden lg:inline ml-1.5 text-[10px] text-gray-400 font-mono">{shortcut}</kbd>
      )}
    </button>
  );
}

function EmptyState({ icon, title, description, action, large }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode; large?: boolean }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 ${large ? 'p-16' : 'p-10'} text-center shadow-sm`}>
      <div className="text-gray-300 dark:text-gray-600 flex justify-center mb-4">{icon}</div>
      <h3 className={`font-semibold text-gray-700 dark:text-gray-200 ${large ? 'text-xl' : 'text-lg'} mb-1.5`}>{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <table className="min-w-[700px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {['#', 'Lock', 'Excl', 'Name', 'Salary', 'FPPG', 'Value', 'Own%'].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 12 }).map((_, i) => (
            <tr key={i}>
              <td className="px-3 py-2.5"><div className="w-5 h-4 rounded animate-shimmer" /></td>
              <td className="px-3 py-2.5"><div className="w-7 h-7 rounded-lg animate-shimmer" /></td>
              <td className="px-3 py-2.5"><div className="w-7 h-7 rounded-lg animate-shimmer" /></td>
              <td className="px-3 py-2.5"><div className="h-4 w-32 rounded animate-shimmer" /></td>
              <td className="px-3 py-2.5"><div className="h-4 w-16 rounded animate-shimmer" /></td>
              <td className="px-3 py-2.5"><div className="h-4 w-12 rounded animate-shimmer" /></td>
              <td className="px-3 py-2.5"><div className="h-4 w-14 rounded animate-shimmer" /></td>
              <td className="px-3 py-2.5"><div className="h-4 w-12 rounded animate-shimmer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
