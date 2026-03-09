import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllGolfers, getGolferBySlug, GolferProfile } from '@/lib/golfer-data';
import { COURSE_PROFILES } from '@/lib/course-fit';
import { COURSE_DATA } from '@/lib/course-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGolfers().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const golfer = getGolferBySlug(slug);
  if (!golfer) return {};
  return {
    title: `${golfer.name} DFS Stats & Projections | BirdieVantage`,
    description: `${golfer.name} golf DFS profile — strokes gained breakdown, best course fits, DFS strategy tips, and recent results. Optimize your DraftKings and FanDuel golf lineups with ${golfer.name}'s data.`,
    openGraph: {
      title: `${golfer.name} DFS Stats & Projections | BirdieVantage`,
      description: `Complete DFS profile for ${golfer.name} including strokes gained, course fits, and strategy tips.`,
      type: 'article',
    },
  };
}

export default async function GolferProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const golfer = getGolferBySlug(slug);
  if (!golfer) notFound();

  const bestCourses = golfer.bestCourseFits
    .map((s) => ({ slug: s, profile: COURSE_PROFILES[s], data: COURSE_DATA[s] }))
    .filter((c) => c.profile && c.data);

  const worstCourses = golfer.worstCourseFits
    .map((s) => ({ slug: s, profile: COURSE_PROFILES[s], data: COURSE_DATA[s] }))
    .filter((c) => c.profile && c.data);

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: golfer.name,
    url: `https://birdievantage.com/golfers/${slug}`,
    nationality: golfer.country,
    jobTitle: 'Professional Golfer',
    description: `${golfer.name} — World #${golfer.worldRanking} professional golfer from ${golfer.country}. Strokes Gained Total: ${golfer.strokesGained.total >= 0 ? '+' : ''}${golfer.strokesGained.total.toFixed(2)}.`,
    sameAs: [],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Header currentSlug={slug} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/golfers" className="hover:text-green-700">Golfer Profiles</Link>
            <span>/</span>
            <span className="text-gray-800">{golfer.name}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            {golfer.name}
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            {golfer.country} &middot; Age {golfer.age}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="World Ranking" value={`#${golfer.worldRanking}`} />
            <StatCard label="Avg DFS Points" value={golfer.avgDfsPoints.toFixed(1)} />
            <StatCard label="Win Rate" value={`${golfer.winRate}%`} />
            <StatCard label="Cut Rate" value={`${golfer.cutRate}%`} />
          </div>
        </section>

        {/* Bio */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Player Overview</h2>
          <p className="text-gray-600 leading-relaxed">{golfer.bio}</p>
        </section>

        {/* Strokes Gained Profile */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Strokes Gained Profile</h2>
          <p className="text-gray-600 mb-6">
            {golfer.name}&apos;s strokes gained breakdown shows where they gain or lose strokes
            relative to the PGA Tour field average. Positive values indicate above-average
            performance in that category.
          </p>
          <div className="space-y-4">
            <SGBar label="Off the Tee" value={golfer.strokesGained.offTheTee} abbr="OTT" />
            <SGBar label="Approach" value={golfer.strokesGained.approach} abbr="APP" />
            <SGBar label="Around the Green" value={golfer.strokesGained.aroundTheGreen} abbr="ATG" />
            <SGBar label="Putting" value={golfer.strokesGained.putting} abbr="P" />
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">SG: Total</span>
                <span className={`text-sm font-bold ${golfer.strokesGained.total >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {golfer.strokesGained.total >= 0 ? '+' : ''}{golfer.strokesGained.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Results */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recent Tournament Results</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Tournament</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Finish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {golfer.recentResults.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{r.tournament}</td>
                    <td className="px-4 py-2 text-center font-medium">{r.finish}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Best Course Fits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Best Course Fits</h2>
          <p className="text-gray-600 mb-4">
            Courses where {golfer.name}&apos;s strokes gained profile aligns best with the
            demands of the venue, based on BirdieVantage&apos;s course-fit model.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bestCourses.map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="block rounded-xl border border-green-200 bg-green-50 p-4 hover:border-green-300 transition-colors"
              >
                <h3 className="font-bold text-green-800 mb-1">{c.profile.name}</h3>
                <p className="text-sm text-gray-600">{c.data.tournamentName}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Worst Course Fits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Worst Course Fits</h2>
          <p className="text-gray-600 mb-4">
            Courses where {golfer.name}&apos;s skill profile is a poor match, suggesting
            they may underperform relative to salary in DFS.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {worstCourses.map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="block rounded-xl border border-red-200 bg-red-50 p-4 hover:border-red-300 transition-colors"
              >
                <h3 className="font-bold text-red-800 mb-1">{c.profile.name}</h3>
                <p className="text-sm text-gray-600">{c.data.tournamentName}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* DFS Strategy Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">DFS Strategy Tips for {golfer.name}</h2>
          <div className="space-y-3">
            {golfer.dfsStrategyTips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-6 bg-green-50 rounded-xl text-center">
          <h3 className="text-lg font-bold mb-2">
            Use {golfer.name} in Your DFS Lineup
          </h3>
          <p className="text-gray-600 mb-4">
            Build optimized DraftKings and FanDuel golf lineups featuring {golfer.name} with
            BirdieVantage&apos;s free optimizer.
          </p>
          <Link
            href="/optimizer"
            className="inline-block px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors"
          >
            Launch Optimizer
          </Link>
        </section>

        {/* Internal Links */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold mb-4">Explore More Golfer Profiles</h3>
          <div className="flex flex-wrap gap-2">
            {getRelatedGolfers(golfer).map((g) => (
              <Link
                key={g.slug}
                href={`/golfers/${g.slug}`}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/** Get 8 related golfers (excluding current) */
function getRelatedGolfers(current: GolferProfile): GolferProfile[] {
  return getAllGolfers()
    .filter((g) => g.slug !== current.slug)
    .slice(0, 8);
}

/* ─── Shared Components ─── */

function Header({ currentSlug }: { currentSlug: string }) {
  return (
    <header className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-700">BirdieVantage</Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/optimizer" className="text-gray-600 hover:text-gray-800">Optimizer</Link>
          <Link href="/strategy" className="text-gray-600 hover:text-gray-800">Strategy</Link>
          <Link href="/scoring" className="text-gray-600 hover:text-gray-800">Scoring</Link>
          <Link href="/golfers" className={currentSlug ? 'font-medium text-green-700' : 'text-gray-600 hover:text-gray-800'}>Golfers</Link>
          <Link href="/courses" className="text-gray-600 hover:text-gray-800">Courses</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
        <span>BirdieVantage &copy; {new Date().getFullYear()}</span>
        <div className="flex gap-6">
          <Link href="/optimizer" className="hover:text-gray-700">Optimizer</Link>
          <Link href="/strategy" className="hover:text-gray-700">Strategy</Link>
          <Link href="/scoring" className="hover:text-gray-700">Scoring</Link>
          <Link href="/golfers" className="hover:text-gray-700">Golfers</Link>
          <Link href="/courses" className="hover:text-gray-700">Courses</Link>
        </div>
      </div>
    </footer>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function SGBar({ label, value, abbr }: { label: string; value: number; abbr: string }) {
  const maxVal = 1.6;
  const pct = Math.min(Math.abs(value) / maxVal * 100, 100);
  const isPositive = value >= 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          SG: {label} <span className="text-gray-400">({abbr})</span>
        </span>
        <span className={`text-sm font-bold ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{value.toFixed(2)}
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        {isPositive ? (
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        ) : (
          <div className="h-full flex justify-end">
            <div
              className="h-full bg-red-400 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
