// ──────────────────────────────────────────────
// Feature 1: Course-Fit Scoring
// ──────────────────────────────────────────────
// Evaluates how well a golfer's skill profile matches
// the demands of a specific course. Uses strokes-gained
// category weights per course to produce a composite score.
// ──────────────────────────────────────────────

import { Golfer } from './types';

/** Strokes-gained categories */
export interface StrokesGained {
  offTheTee: number;    // driving distance + accuracy
  approach: number;     // iron play, approach accuracy
  aroundTheGreen: number; // chipping, short game
  putting: number;      // putting performance
  teeToGreen: number;   // OTT + approach + ATG combined
}

/** Course profile: how much each SG category matters */
export interface CourseProfile {
  name: string;
  courseId: string;
  // Weights (should sum to ~1.0)
  offTheTeeWeight: number;
  approachWeight: number;
  aroundTheGreenWeight: number;
  puttingWeight: number;
  // Metadata
  grassType: 'bentgrass' | 'bermuda' | 'poa' | 'mixed';
  avgDrivingDistance: number; // how much distance matters (yards off tee that are useful)
  par: number;
  yards: number;
}

/** Golfer with SG data attached */
export interface GolferWithCourseFit extends Golfer {
  sg?: StrokesGained;
  courseFitScore?: number;
  courseFitRank?: number;
}

/**
 * Known PGA Tour course profiles.
 * Weights represent how much each SG category correlates with
 * success at that venue, based on historical tournament data.
 */
export const COURSE_PROFILES: Record<string, CourseProfile> = {
  'tpc-sawgrass': {
    name: 'TPC Sawgrass (Stadium)',
    courseId: 'tpc-sawgrass',
    offTheTeeWeight: 0.15,
    approachWeight: 0.40,
    aroundTheGreenWeight: 0.20,
    puttingWeight: 0.25,
    grassType: 'bermuda',
    avgDrivingDistance: 290,
    par: 72,
    yards: 7245,
  },
  'augusta-national': {
    name: 'Augusta National',
    courseId: 'augusta-national',
    offTheTeeWeight: 0.25,
    approachWeight: 0.35,
    aroundTheGreenWeight: 0.15,
    puttingWeight: 0.25,
    grassType: 'bentgrass',
    avgDrivingDistance: 310,
    par: 72,
    yards: 7510,
  },
  'pebble-beach': {
    name: 'Pebble Beach Golf Links',
    courseId: 'pebble-beach',
    offTheTeeWeight: 0.10,
    approachWeight: 0.45,
    aroundTheGreenWeight: 0.20,
    puttingWeight: 0.25,
    grassType: 'poa',
    avgDrivingDistance: 275,
    par: 72,
    yards: 6828,
  },
  'torrey-pines-south': {
    name: 'Torrey Pines (South)',
    courseId: 'torrey-pines-south',
    offTheTeeWeight: 0.30,
    approachWeight: 0.35,
    aroundTheGreenWeight: 0.15,
    puttingWeight: 0.20,
    grassType: 'poa',
    avgDrivingDistance: 305,
    par: 72,
    yards: 7698,
  },
  'bay-hill': {
    name: 'Bay Hill Club & Lodge',
    courseId: 'bay-hill',
    offTheTeeWeight: 0.20,
    approachWeight: 0.35,
    aroundTheGreenWeight: 0.20,
    puttingWeight: 0.25,
    grassType: 'bermuda',
    avgDrivingDistance: 295,
    par: 72,
    yards: 7466,
  },
  'tpc-scottsdale': {
    name: 'TPC Scottsdale (Stadium)',
    courseId: 'tpc-scottsdale',
    offTheTeeWeight: 0.15,
    approachWeight: 0.35,
    aroundTheGreenWeight: 0.20,
    puttingWeight: 0.30,
    grassType: 'bermuda',
    avgDrivingDistance: 285,
    par: 71,
    yards: 7261,
  },
  'valhalla': {
    name: 'Valhalla Golf Club',
    courseId: 'valhalla',
    offTheTeeWeight: 0.25,
    approachWeight: 0.35,
    aroundTheGreenWeight: 0.15,
    puttingWeight: 0.25,
    grassType: 'bentgrass',
    avgDrivingDistance: 310,
    par: 72,
    yards: 7530,
  },
  'pinehurst-no2': {
    name: 'Pinehurst No. 2',
    courseId: 'pinehurst-no2',
    offTheTeeWeight: 0.15,
    approachWeight: 0.30,
    aroundTheGreenWeight: 0.30,
    puttingWeight: 0.25,
    grassType: 'bermuda',
    avgDrivingDistance: 290,
    par: 70,
    yards: 7588,
  },
  // Default fallback for unknown courses
  'default': {
    name: 'Default PGA Tour Course',
    courseId: 'default',
    offTheTeeWeight: 0.20,
    approachWeight: 0.35,
    aroundTheGreenWeight: 0.20,
    puttingWeight: 0.25,
    grassType: 'mixed',
    avgDrivingDistance: 295,
    par: 72,
    yards: 7300,
  },
};

/**
 * Calculate a golfer's course-fit score given their SG profile
 * and the course's category weights.
 *
 * Returns a score where higher = better fit.
 * Score is a weighted average of strokes-gained values.
 */
export function calculateCourseFit(
  sg: StrokesGained,
  course: CourseProfile
): number {
  return (
    sg.offTheTee * course.offTheTeeWeight +
    sg.approach * course.approachWeight +
    sg.aroundTheGreen * course.aroundTheGreenWeight +
    sg.putting * course.puttingWeight
  );
}

/**
 * Assign course-fit scores and rankings to an array of golfers.
 * Golfers without SG data get a neutral score of 0.
 */
export function applyCourseFit(
  golfers: GolferWithCourseFit[],
  courseId: string
): GolferWithCourseFit[] {
  const course = COURSE_PROFILES[courseId] || COURSE_PROFILES['default'];

  const scored = golfers.map((g) => ({
    ...g,
    courseFitScore: g.sg ? calculateCourseFit(g.sg, course) : 0,
  }));

  // Rank by course fit (1 = best)
  const sorted = [...scored].sort(
    (a, b) => (b.courseFitScore ?? 0) - (a.courseFitScore ?? 0)
  );
  sorted.forEach((g, i) => {
    g.courseFitRank = i + 1;
  });

  // Return in original order with ranks assigned
  const rankMap = new Map(sorted.map((g) => [g.id, g.courseFitRank]));
  return scored.map((g) => ({
    ...g,
    courseFitRank: rankMap.get(g.id) ?? golfers.length,
  }));
}

/**
 * Populate SG data from Data Golf enrichment when available,
 * falling back to FPPG-based estimates for unmatched players.
 */
export function populateSG(golfers: Golfer[]): GolferWithCourseFit[] {
  const maxFppg = Math.max(...golfers.map((g) => g.fppg), 1);

  return golfers.map((g) => {
    // Use real Data Golf SG data if available
    if (g.dg && (g.dg.sgTotal !== 0 || g.dg.sgApp !== 0)) {
      const sg: StrokesGained = {
        offTheTee: g.dg.sgOtt,
        approach: g.dg.sgApp,
        aroundTheGreen: g.dg.sgArg,
        putting: g.dg.sgPutt,
        teeToGreen: g.dg.sgOtt + g.dg.sgApp + g.dg.sgArg,
      };
      return { ...g, sg };
    }

    // Fallback: estimate from FPPG for players without DG data
    const base = g.fppg / maxFppg;
    const noise = () => (Math.random() - 0.5) * 0.4;
    const sg: StrokesGained = {
      offTheTee: base * 1.5 + noise(),
      approach: base * 2.0 + noise(),
      aroundTheGreen: base * 1.0 + noise(),
      putting: base * 1.0 + noise(),
      teeToGreen: 0,
    };
    sg.teeToGreen = sg.offTheTee + sg.approach + sg.aroundTheGreen;
    return { ...g, sg };
  });
}

/**
 * @deprecated Use populateSG() instead — kept for backward compat
 */
export const generateMockSG = populateSG;
