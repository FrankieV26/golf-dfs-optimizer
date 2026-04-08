import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Golf DFS Strategy Guide - Tips for DraftKings & FanDuel',
  description:
    'Complete golf DFS strategy guide for DraftKings and FanDuel. Learn about course fit, ownership leverage, bankroll management, and how to build winning PGA lineups.',
};

/* ---------- tiny helper components ---------- */

function SectionCard({
  icon,
  number,
  title,
  children,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 shrink-0">
          {icon}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          <span className="text-green-700 dark:text-green-400">{number}</span> {title}
        </h2>
      </div>
      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-3">
        {children}
      </div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-900 dark:text-amber-200">
      <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <div>{children}</div>
    </div>
  );
}

function KeyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-green-700 dark:text-green-400 font-mono">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</div>
    </div>
  );
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-400 hover:text-green-700 dark:hover:border-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
    >
      {label}
    </Link>
  );
}

/* ---------- icons ---------- */

const icons = {
  courseFit: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5L12 7.5l3 1.5L18 7.5l-3 1.5" />
    </svg>
  ),
  cut: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  ownership: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  platform: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  weather: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  ),
  bankroll: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

/* ---------- page ---------- */

export default function StrategyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              Golf DFS Strategy{' '}
              <span className="text-green-700 dark:text-green-400">Guide</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Golf DFS is one of the most skill-rewarding formats in daily fantasy sports.
              Every golfer plays every hole independently — your edge comes entirely from
              player selection, not game script luck. Here&apos;s how to build that edge.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
              <KeyStat value="6" label="Core concepts" />
              <KeyStat value="10K" label="Simulations" />
              <KeyStat value="$0" label="Cost to you" />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

          <SectionCard icon={icons.courseFit} number="01" title="Understand Course Fit">
            <p>
              The single most important concept in golf DFS. Every course demands a different
              mix of skills: some reward bombers off the tee, others favor precision iron
              players, and some are won and lost on the greens.
            </p>
            <p><strong>Key Strokes Gained categories to evaluate:</strong></p>
            <ul className="space-y-2">
              <li><strong>Strokes Gained: Off the Tee</strong> -- Driving distance and accuracy. Crucial at long, narrow courses like <Link href="/courses/torrey-pines-south" className="text-green-700 dark:text-green-400 underline hover:text-green-800 dark:hover:text-green-300">Torrey Pines South</Link>.</li>
              <li><strong>Strokes Gained: Approach</strong> -- Iron play and proximity to the hole. The most consistently predictive stat across all courses.</li>
              <li><strong>Strokes Gained: Around the Green</strong> -- Short game and chipping. Matters most at courses with difficult greenside areas like <Link href="/courses/pinehurst-no2" className="text-green-700 dark:text-green-400 underline hover:text-green-800 dark:hover:text-green-300">Pinehurst No. 2</Link>.</li>
              <li><strong>Strokes Gained: Putting</strong> -- Surface-dependent (bentgrass vs bermuda vs poa). Check the grass type before weighting this.</li>
            </ul>
            <Callout>
              BirdieVantage&apos;s course-fit model automatically weights these categories based
              on the week&apos;s venue and ranks golfers by how well their profile matches.
            </Callout>
          </SectionCard>

          <SectionCard icon={icons.cut} number="02" title="The Cut Line Is Everything">
            <p>
              Golf tournaments have a halfway cut -- typically the top 65 players plus ties
              after 36 holes. A golfer who misses the cut plays only 2 rounds instead of 4,
              earning roughly half the fantasy points and zero finish-position bonuses.
            </p>
            <p>
              This makes golf scoring <strong>bimodal</strong>: a golfer either makes the
              cut and has a reasonable floor, or misses it and craters your lineup. Always
              consider made-cut probability alongside ceiling.
            </p>
            <Callout>
              Our Monte Carlo simulation models this explicitly -- running 10,000 tournament
              simulations with realistic cut-line behavior to produce accurate floor/ceiling ranges.
            </Callout>
          </SectionCard>

          <SectionCard icon={icons.ownership} number="03" title="Ownership Leverage in GPPs">
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
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">GPP Strategy Principles</p>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">&#10003;</span>
                  Target players with high ceilings but low projected ownership
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">&#10003;</span>
                  Fade (underweight) the most popular chalk plays
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">&#10003;</span>
                  Use exposure controls to diversify across multiple lineups
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">&#10003;</span>
                  A 60% max exposure cap across 20 lineups means no golfer appears in more than 12 of them
                </li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard icon={icons.platform} number="04" title="DraftKings vs FanDuel Differences">
            <p>
              The platforms score golf differently, which changes optimal strategy:
            </p>
            <div className="grid md:grid-cols-2 gap-4 not-prose">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="font-bold text-gray-900 dark:text-gray-100 mb-2">DraftKings</div>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <li>Birdie: <span className="font-mono text-green-700 dark:text-green-400">+3</span></li>
                  <li>Bogey: <span className="font-mono text-red-600 dark:text-red-400">-0.5</span></li>
                  <li>Salary cap: <span className="font-mono">$50K</span></li>
                  <li className="pt-1 text-gray-500 dark:text-gray-500 italic">Rewards aggressive, volatile golfers</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="font-bold text-gray-900 dark:text-gray-100 mb-2">FanDuel</div>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <li>Birdie: <span className="font-mono text-green-700 dark:text-green-400">+3</span></li>
                  <li>Bogey: <span className="font-mono text-red-600 dark:text-red-400">-1</span></li>
                  <li>Salary cap: <span className="font-mono">$60K</span></li>
                  <li className="pt-1 text-gray-500 dark:text-gray-500 italic">Rewards consistent, low-bogey golfers</li>
                </ul>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={icons.weather} number="05" title="Weather and Tee Times">
            <p>
              Golf is played outdoors over four days. Weather -- especially wind -- can
              create massive scoring differences between early and late tee times on the
              same day.
            </p>
            <Callout>
              <strong>Wave advantage:</strong> If one wave gets calm morning conditions and
              the other plays in afternoon wind, the calm-wave golfers have a significant edge.
              Check the forecast before lock and consider stacking golfers from the favorable wave.
            </Callout>
          </SectionCard>

          <SectionCard icon={icons.bankroll} number="06" title="Bankroll Management">
            <p>
              Golf DFS has high variance. Even the best projections get disrupted by
              weather, withdrawals, and 4-day scoring windows.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-2 not-prose">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Key Rules</p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">1.</span>
                  Never risk more than 10% of your bankroll on a single slate
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">2.</span>
                  Split your budget: 60-70% cash games, 30-40% GPPs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">3.</span>
                  Build 20+ lineups with diversified exposure rather than 1-3 max-projected lineups
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">4.</span>
                  Track your results weekly -- golf DFS profitability compounds over the season
                </li>
              </ul>
            </div>
          </SectionCard>

          {/* CTA */}
          <div className="bg-green-700 dark:bg-green-800 rounded-2xl p-8 md:p-10 text-center shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Ready to Apply These Strategies?</h3>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">
              BirdieVantage&apos;s optimizer has course-fit scoring, Monte Carlo simulation, and
              ownership-aware GPP optimization built in. Free to use.
            </p>
            <Link
              href="/optimizer"
              className="inline-block px-8 py-3.5 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 active:scale-[0.97] transition-all shadow-sm"
            >
              Launch Optimizer
            </Link>
          </div>

          {/* Explore links */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Explore Golfer Profiles</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Study strokes-gained breakdowns and course fits for top PGA Tour players.
              </p>
              <div className="flex flex-wrap gap-2">
                <PillLink href="/golfers/scottie-scheffler" label="Scottie Scheffler" />
                <PillLink href="/golfers/rory-mcilroy" label="Rory McIlroy" />
                <PillLink href="/golfers/xander-schauffele" label="Xander Schauffele" />
                <PillLink href="/golfers/collin-morikawa" label="Collin Morikawa" />
                <PillLink href="/golfers/jordan-spieth" label="Jordan Spieth" />
                <PillLink href="/golfers/jon-rahm" label="Jon Rahm" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Course Breakdowns</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                See course-fit weights and key stats for major PGA Tour venues.
              </p>
              <div className="flex flex-wrap gap-2">
                <PillLink href="/courses/augusta-national" label="Augusta National" />
                <PillLink href="/courses/tpc-sawgrass" label="TPC Sawgrass" />
                <PillLink href="/courses/pebble-beach" label="Pebble Beach" />
                <PillLink href="/courses/torrey-pines-south" label="Torrey Pines South" />
                <PillLink href="/courses/pinehurst-no2" label="Pinehurst No. 2" />
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
