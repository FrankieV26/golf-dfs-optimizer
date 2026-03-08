import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Golf DFS Strategy Guide - Tips for DraftKings & FanDuel',
  description:
    'Complete golf DFS strategy guide for DraftKings and FanDuel. Learn about course fit, ownership leverage, bankroll management, and how to build winning PGA lineups.',
};

export default function StrategyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-700">BirdieLine</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/optimizer" className="text-gray-600 hover:text-gray-800">Optimizer</Link>
            <Link href="/strategy" className="font-medium text-green-700">Strategy</Link>
            <Link href="/scoring" className="text-gray-600 hover:text-gray-800">Scoring</Link>
            <Link href="/golfers" className="text-gray-600 hover:text-gray-800">Golfers</Link>
            <Link href="/courses" className="text-gray-600 hover:text-gray-800">Courses</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-8">Golf DFS Strategy Guide</h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <p className="text-lg text-gray-600">
            Golf DFS is one of the most skill-rewarding formats in daily fantasy sports.
            Unlike team sports, every golfer plays every hole independently — meaning your
            edge comes entirely from player selection, not game script luck. Here&apos;s how
            to build that edge.
          </p>

          <Section title="1. Understand Course Fit">
            <p>
              The single most important concept in golf DFS. Every course demands a different
              mix of skills: some reward bombers off the tee, others favor precision iron
              players, and some are won and lost on the greens.
            </p>
            <p>
              <strong>Key strokes-gained categories to evaluate:</strong>
            </p>
            <ul>
              <li><strong>SG: Off the Tee</strong> — Driving distance and accuracy. Crucial at long, narrow courses like <Link href="/courses/torrey-pines-south" className="text-green-700 underline hover:text-green-800">Torrey Pines South</Link>.</li>
              <li><strong>SG: Approach</strong> — Iron play and proximity to the hole. The most consistently predictive stat across all courses.</li>
              <li><strong>SG: Around the Green</strong> — Short game and chipping. Matters most at courses with difficult greenside areas like <Link href="/courses/pinehurst-no2" className="text-green-700 underline hover:text-green-800">Pinehurst No. 2</Link>.</li>
              <li><strong>SG: Putting</strong> — Surface-dependent (bentgrass vs bermuda vs poa). Check the grass type before weighting this.</li>
            </ul>
            <p>
              BirdieLine&apos;s course-fit model automatically weights these categories based
              on the week&apos;s venue and ranks golfers by how well their profile matches.
            </p>
          </Section>

          <Section title="2. The Cut Line Is Everything">
            <p>
              Golf tournaments have a halfway cut — typically the top 65 players plus ties
              after 36 holes. A golfer who misses the cut plays only 2 rounds instead of 4,
              earning roughly half the fantasy points and zero finish-position bonuses.
            </p>
            <p>
              This makes golf scoring <strong>bimodal</strong>: a golfer either makes the
              cut and has a reasonable floor, or misses it and craters your lineup. Always
              consider made-cut probability alongside ceiling.
            </p>
            <p>
              Our Monte Carlo simulation models this explicitly — running 10,000 tournament
              simulations with realistic cut-line behavior to produce accurate floor/ceiling
              ranges.
            </p>
          </Section>

          <Section title="3. Ownership Leverage in GPPs">
            <p>
              In guaranteed prize pool (GPP) tournaments, maximizing raw fantasy points is
              not enough. Because payouts are top-heavy, you need to beat the other entrants,
              not just an absolute score threshold.
            </p>
            <p>
              This means <strong>ownership matters</strong>. If a golfer is 30% owned and
              has a great weekend, everyone benefits. But if a 3% owned golfer has that same
              weekend, you vault past the field.
            </p>
            <p>
              <strong>GPP strategy principles:</strong>
            </p>
            <ul>
              <li>Target players with high ceilings but low projected ownership</li>
              <li>Fade (underweight) the most popular chalk plays</li>
              <li>Use exposure controls to diversify across multiple lineups</li>
              <li>A 60% max exposure cap across 20 lineups means no golfer appears in more than 12 of them</li>
            </ul>
          </Section>

          <Section title="4. DraftKings vs FanDuel Differences">
            <p>
              The platforms score golf differently, which changes optimal strategy:
            </p>
            <ul>
              <li><strong>DraftKings</strong> is more forgiving of bogeys (-0.5) and rewards birdie machines (+3 per birdie). Volatile, aggressive golfers are relatively more valuable.</li>
              <li><strong>FanDuel</strong> punishes bogeys harder (-1) and double bogeys much harder (-3). Consistent, bogey-avoiding golfers outperform on FanDuel.</li>
              <li><strong>Salary differences</strong>: DK cap is $50K, FD cap is $60K. FD&apos;s higher cap gives more room to pay up for studs.</li>
            </ul>
          </Section>

          <Section title="5. Weather and Tee Times">
            <p>
              Golf is played outdoors over four days. Weather — especially wind — can
              create massive scoring differences between early and late tee times on the
              same day.
            </p>
            <p>
              <strong>Wave advantage</strong>: If one wave gets calm morning conditions and
              the other plays in afternoon wind, the calm-wave golfers have a significant edge.
              Check the forecast before lock and consider stacking golfers from the favorable wave.
            </p>
          </Section>

          <Section title="6. Bankroll Management">
            <p>
              Golf DFS has high variance. Even the best projections get disrupted by
              weather, withdrawals, and 4-day scoring windows. Key rules:
            </p>
            <ul>
              <li>Never risk more than 10% of your bankroll on a single slate</li>
              <li>Split your budget: 60-70% in cash games (50/50, double-up), 30-40% in GPPs</li>
              <li>In GPPs, build 20+ lineups with diversified exposure rather than 1-3 max-projected lineups</li>
              <li>Track your results weekly — golf DFS profitability compounds over the season</li>
            </ul>
          </Section>

          <div className="mt-12 p-6 bg-green-50 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-2">Ready to Apply These Strategies?</h3>
            <p className="text-gray-600 mb-4">
              BirdieLine&apos;s optimizer has course-fit scoring, Monte Carlo simulation, and
              ownership-aware GPP optimization built in. Free to use.
            </p>
            <Link
              href="/optimizer"
              className="inline-block px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800"
            >
              Launch Optimizer
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4">Explore Golfer Profiles</h3>
            <p className="text-gray-600 mb-4">
              Study strokes-gained breakdowns and course fits for top PGA Tour players:
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/golfers/scottie-scheffler" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Scottie Scheffler</Link>
              <Link href="/golfers/rory-mcilroy" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Rory McIlroy</Link>
              <Link href="/golfers/xander-schauffele" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Xander Schauffele</Link>
              <Link href="/golfers/collin-morikawa" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Collin Morikawa</Link>
              <Link href="/golfers/jordan-spieth" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Jordan Spieth</Link>
              <Link href="/golfers/jon-rahm" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Jon Rahm</Link>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Course Breakdowns</h3>
            <p className="text-gray-600 mb-4">
              See course-fit weights and key stats for major PGA Tour venues:
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/courses/augusta-national" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Augusta National</Link>
              <Link href="/courses/tpc-sawgrass" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">TPC Sawgrass</Link>
              <Link href="/courses/pebble-beach" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Pebble Beach</Link>
              <Link href="/courses/torrey-pines-south" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Torrey Pines South</Link>
              <Link href="/courses/pinehurst-no2" className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors">Pinehurst No. 2</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <span>BirdieLine &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <Link href="/optimizer" className="hover:text-gray-700">Optimizer</Link>
            <Link href="/strategy" className="hover:text-gray-700">Strategy</Link>
            <Link href="/scoring" className="hover:text-gray-700">Scoring</Link>
            <Link href="/golfers" className="hover:text-gray-700">Golfers</Link>
            <Link href="/courses" className="hover:text-gray-700">Courses</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-10 mb-4">{title}</h2>
      {children}
    </div>
  );
}
