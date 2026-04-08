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
  // Data Golf enrichment (optional — populated when DG API is available)
  dg?: {
    projPoints: number;       // DG projected fantasy points
    projOwnership: number | null;
    projStdDev: number;       // standard deviation of projection
    // True talent strokes gained
    sgOtt: number;
    sgApp: number;
    sgArg: number;
    sgPutt: number;
    sgTotal: number;
    // Course fit for current event
    courseFitAdj: number;     // SG adjustment for course fit
    courseHistoryAdj: number;  // SG adjustment for course history
    baselinePred: number;     // pure skill prediction (SG vs field/round)
    finalPred: number;        // skill + course fit + history
    // Tournament probabilities
    winProb: number;
    top5Prob: number;
    top10Prob: number;
    top20Prob: number;
    makeCutProb: number;
  };
  // Custom projection overlay (set when user uploads their own CSV)
  customProj?: {
    fppg: number;            // user's raw projection (before blending)
    ownership?: number;      // user's ownership estimate, if provided
    blended: boolean;        // true = 50/50 blend with DG, false = custom-only
    origFppg: number;        // original fppg before blending (for restore on clear)
    origOwnership?: number;  // original ownership before blending
  };
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
  courseFitWeight: number;   // 0 = no extra emphasis, 1 = full course fit boost
}

export const DEFAULT_SETTINGS: OptimizerSettings = {
  platform: 'draftkings',
  maxLineups: 20,
  maxExposure: 60,
  lockedGolfers: [],
  excludedGolfers: [],
  diversityWeight: 0.3,
  courseFitWeight: 0.5,
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
