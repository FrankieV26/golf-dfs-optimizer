// ──────────────────────────────────────────────
// Golf DFS Optimizer — Core Types
// ──────────────────────────────────────────────

export type Platform = 'draftkings' | 'fanduel';

export interface Golfer {
  id: number;
  name: string;
  salary: number;
  fppg: number;        // fantasy points per game (historical average)
  team: string;        // not really a "team" in golf, but DK uses it
  gameInfo: string;    // tournament info
  ownership?: number;  // projected ownership %
  // Derived
  value: number;       // fppg / salary * 1000
}

export interface Lineup {
  golfers: Golfer[];
  totalSalary: number;
  totalFppg: number;
  totalValue: number;
}

export interface PlatformConfig {
  name: string;
  platform: Platform;
  rosterSize: number;
  salaryCap: number;
  minSalary: number;   // minimum salary to use (avoid leaving too much on table)
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  draftkings: {
    name: 'DraftKings',
    platform: 'draftkings',
    rosterSize: 6,
    salaryCap: 50_000,
    minSalary: 45_000,
  },
  fanduel: {
    name: 'FanDuel',
    platform: 'fanduel',
    rosterSize: 6,
    salaryCap: 60_000,
    minSalary: 54_000,
  },
};

export interface OptimizerSettings {
  platform: Platform;
  maxLineups: number;        // how many lineups to generate
  maxExposure: number;       // max % of lineups a single golfer appears in (0-100)
  lockedGolfers: number[];   // golfer IDs that MUST be in every lineup
  excludedGolfers: number[]; // golfer IDs to exclude
  minSalary?: number;        // override minimum salary floor
  diversityWeight: number;   // 0 = pure optimization, 1 = maximum diversity
}

export const DEFAULT_SETTINGS: OptimizerSettings = {
  platform: 'draftkings',
  maxLineups: 20,
  maxExposure: 60,
  lockedGolfers: [],
  excludedGolfers: [],
  diversityWeight: 0.3,
};

// DraftKings Golf Classic scoring
export const DK_SCORING = {
  eagle_or_better: 8,
  birdie: 3,
  par: 0.5,
  bogey: -0.5,
  double_bogey_or_worse: -1,
  streak_bonus: 3,       // 3+ consecutive birdies or better
  bogey_free_round: 3,
  all_rounds_under_70: 5,
};

// FanDuel Golf scoring
export const FD_SCORING = {
  eagle_or_better: 8,
  birdie: 3.5,
  par: 0.5,
  bogey: -0.5,
  double_bogey_or_worse: -1,
  made_cut: 5,
};
