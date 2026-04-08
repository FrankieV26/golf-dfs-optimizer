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
import GolferTable, { GolferSortField } from '@/components/GolferTable';
import LineupResults from '@/components/LineupResults';
import SimulationTable from '@/components/SimulationTable';

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
  // Split header; handle both comma and tab delimiters
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
  const [simElapsed, setSimElapsed] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('players');

  // Settings
  const [maxLineups, setMaxLineups] = useState(DEFAULT_SETTINGS.maxLineups);
  const [maxExposure, setMaxExposure] = useState(DEFAULT_SETTINGS.maxExposure);
  const [useGPPMode, setUseGPPMode] = useState(false);

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
      if (fetchedGolfers.length === 0 && data.tournament) {
        setError(`No active DraftKings slate found for ${data.tournament}. The main slate typically opens Tuesday or Wednesday before each tournament.`);
      }
      setLockedIds(new Set());
      setExcludedIds(new Set());
      setLineups([]);
      setSimResults([]);
      setCustomProjCount(0);
      setCustomProjMsg(null);
      setActiveTab('players');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load players');
    } finally {
      setLoadingPlayers(false);
    }
  }, [platform]);

  // Auto-fetch DK slate on page load
  useEffect(() => {
    if (platform === 'draftkings') {
      fetchPlayers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setLockedIds(new Set());
        setExcludedIds(new Set());
        setLineups([]);
        setSimResults([]);
        setCustomProjCount(0);
        setCustomProjMsg(null);
        setActiveTab('players');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to parse CSV');
      } finally {
        setLoadingPlayers(false);
      }
    },
    []
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
        // Build a lookup by normalized name
        const projMap = new Map<string, ParsedProjection>();
        for (const p of parsed) {
          projMap.set(normalizeName(p.name), p);
        }
        // Blend into current golfer pool
        let matched = 0;
        setGolfers((prev) =>
          prev.map((g) => {
            const norm = normalizeName(g.name);
            const custom = projMap.get(norm);
            if (!custom) {
              // Remove any stale custom overlay, restoring originals
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
            // Save the current fppg before we overwrite (use stored original if re-uploading)
            const origFppg = g.customProj ? g.customProj.origFppg : g.fppg;
            const origOwnership = g.customProj ? g.customProj.origOwnership : g.ownership;
            // 50/50 blend when DG data exists, otherwise use custom directly
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
      };
      reader.readAsText(file);
      // Reset input so the same file can be re-uploaded
      if (projFileRef.current) projFileRef.current.value = '';
    },
    []
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

  const runSimulation = useCallback(async () => {
    if (golfers.length < 6) return;
    setSimulating(true);
    setError(null);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ golfers, platform, numSims: 10_000 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSimResults(data.results || []);
      setSimElapsed(data.elapsed_ms);
      setActiveTab('simulation');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  }, [golfers, platform]);

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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Optimization failed');
    } finally {
      setLoading(false);
    }
  }, [golfers, platform, maxLineups, maxExposure, lockedIds, excludedIds, useGPPMode]);

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

  const tabClass = (tab: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-green-700 text-green-700 bg-white'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/"><img src="/logo.svg" alt="BirdieVantage" className="h-14 w-auto" /></a>
          <nav className="flex gap-6 text-sm">
            <a href="/optimizer" className="font-medium text-green-700">Optimizer</a>
            <a href="/live" className="text-gray-600 hover:text-gray-800">Live</a>
            <a href="/strategy" className="text-gray-600 hover:text-gray-800">Strategy</a>
            <a href="/scoring" className="text-gray-600 hover:text-gray-800">Scoring</a>
            <a href="/golfers" className="text-gray-600 hover:text-gray-800">Golfers</a>
            <a href="/courses" className="text-gray-600 hover:text-gray-800">Courses</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Golf DFS Lineup Optimizer</h1>
        {tournament && <p className="text-gray-600 mb-6">{tournament}</p>}

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value as Platform);
                  setGolfers([]);
                  setLineups([]);
                  setSimResults([]);
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="draftkings">DraftKings ($50K)</option>
                <option value="fanduel">FanDuel ($60K)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Lineups</label>
              <input
                type="number" min={1} max={150} value={maxLineups}
                onChange={(e) => setMaxLineups(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Exposure %
                <span className="relative group inline-block ml-1">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs cursor-help">?</span>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                    Maximum % of lineups any single golfer can appear in. Lower = more diverse lineups. 100% = no limit.
                  </span>
                </span>
              </label>
              <input
                type="number" min={10} max={100} value={maxExposure}
                onChange={(e) => setMaxExposure(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={useGPPMode}
                  onChange={(e) => setUseGPPMode(e.target.checked)}
                  className="rounded border-gray-300 text-green-600"
                />
                <span className="text-sm font-medium text-gray-700">GPP Mode</span>
                <span className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs cursor-help">?</span>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                    Guaranteed Prize Pool mode. Builds ownership-leveraged lineups optimized for large tournaments where differentiation wins.
                  </span>
                </span>
              </label>
            </div>
            <div className="flex flex-col justify-end">
              {platform === 'draftkings' ? (
                <button
                  onClick={fetchPlayers} disabled={loadingPlayers}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingPlayers && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loadingPlayers ? 'Loading...' : 'Load DK Slate'}
                </button>
              ) : (
                <label className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 text-center cursor-pointer">
                  {loadingPlayers ? 'Parsing...' : 'Upload FD CSV'}
                  <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                </label>
              )}
            </div>
          </div>

          {(lockedIds.size > 0 || excludedIds.size > 0 || customProjCount > 0) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm items-center">
              {lockedIds.size > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  {lockedIds.size} locked
                </span>
              )}
              {excludedIds.size > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                  {excludedIds.size} excluded
                </span>
              )}
              {customProjCount > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded inline-flex items-center gap-1.5">
                  Custom Proj ({customProjCount})
                  <button
                    onClick={clearCustomProjections}
                    className="text-amber-600 hover:text-amber-900 font-bold leading-none"
                    title="Remove custom projections"
                  >
                    x
                  </button>
                </span>
              )}
              <button
                onClick={() => { setLockedIds(new Set()); setExcludedIds(new Set()); if (customProjCount > 0) clearCustomProjections(); }}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Action buttons */}
          {golfers.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start">
              <button
                onClick={runSimulation} disabled={simulating}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {simulating && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {simulating ? 'Simulating...' : 'Run Simulation (10K)'}
              </button>
              <button
                onClick={runOptimizer} disabled={loading}
                className="px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Optimizing...' : 'Generate Lineups'}
              </button>
              <button
                onClick={() => projFileRef.current?.click()}
                className="px-5 py-2.5 border border-amber-400 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50 flex items-center justify-center gap-2"
                title="Upload a CSV with your own projections to blend with Data Golf data"
              >
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
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {customProjMsg && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 mb-6 text-sm flex items-center justify-between">
            <span>
              Custom projections loaded: <strong>{customProjMsg}</strong>.
              {' '}Players with Data Golf data use a 50/50 blend.
            </span>
            <button
              onClick={() => setCustomProjMsg(null)}
              className="ml-4 text-amber-600 hover:text-amber-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs */}
        {!loadingPlayers && golfers.length > 0 && (
          <div className="flex gap-1 mb-4 border-b border-gray-200">
            <button className={tabClass('players')} onClick={() => setActiveTab('players')}>
              Player Pool ({golfers.length})
            </button>
            <button className={tabClass('simulation')} onClick={() => setActiveTab('simulation')}>
              Simulation {simResults.length > 0 && `(${simResults.length})`}
            </button>
            <button className={tabClass('lineups')} onClick={() => setActiveTab('lineups')}>
              Lineups {lineups.length > 0 && `(${lineups.length})`}
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingPlayers && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Lock', 'Excl', 'Name', 'Salary', 'FPPG', 'Value', 'Own%'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2.5"><div className="w-6 h-6 rounded bg-gray-200 animate-pulse" /></td>
                    <td className="px-3 py-2.5"><div className="w-6 h-6 rounded bg-gray-200 animate-pulse" /></td>
                    <td className="px-3 py-2.5"><div className="h-4 w-32 rounded bg-gray-200 animate-pulse" /></td>
                    <td className="px-3 py-2.5"><div className="h-4 w-16 rounded bg-gray-200 animate-pulse" /></td>
                    <td className="px-3 py-2.5"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse" /></td>
                    <td className="px-3 py-2.5"><div className="h-4 w-14 rounded bg-gray-200 animate-pulse" /></td>
                    <td className="px-3 py-2.5"><div className="h-4 w-12 rounded bg-gray-200 animate-pulse" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
            <SimulationTable results={simResults} elapsed_ms={simElapsed} />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              Click &quot;Run Simulation&quot; to model tournament outcomes with 10,000 Monte Carlo simulations
            </div>
          )
        )}

        {!loadingPlayers && activeTab === 'lineups' && (
          lineups.length > 0 ? (
            <LineupResults lineups={lineups} elapsed_ms={elapsed} />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              Click &quot;Generate Lineups&quot; to optimize
            </div>
          )
        )}

        {!loadingPlayers && golfers.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-lg mb-2">
              {platform === 'draftkings'
                ? 'Click "Load DK Slate" to fetch the current golf slate'
                : 'Upload a FanDuel CSV to load players'}
            </p>
            <p className="text-sm">
              The optimizer will find the highest-scoring 6-golfer lineups under the{' '}
              {platform === 'draftkings' ? '$50,000' : '$60,000'} salary cap
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
