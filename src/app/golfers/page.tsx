import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGolfers } from '@/lib/golfer-data';

export const metadata: Metadata = {
  title: 'PGA Tour Golfer DFS Profiles | BirdieVantage',
  description:
    'Browse DFS profiles for top PGA Tour golfers. Strokes gained breakdowns, course fits, DFS strategy tips, and recent results for DraftKings and FanDuel golf lineups.',
};

export default function GolfersIndexPage() {
  const golfers = getAllGolfers();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.svg" alt="BirdieVantage" className="h-14 w-auto" /></Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/optimizer" className="text-gray-600 hover:text-gray-800">Optimizer</Link>
            <Link href="/live" className="text-gray-600 hover:text-gray-800">Live</Link>
            <Link href="/strategy" className="text-gray-600 hover:text-gray-800">Strategy</Link>
            <Link href="/scoring" className="text-gray-600 hover:text-gray-800">Scoring</Link>
            <Link href="/golfers" className="font-medium text-green-700">Golfers</Link>
            <Link href="/courses" className="text-gray-600 hover:text-gray-800">Courses</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          PGA Tour Golfer DFS Profiles
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-3xl">
          Complete DFS profiles for the top PGA Tour golfers. Each profile includes strokes
          gained breakdowns, best and worst course fits, recent results, and actionable DFS
          strategy tips for DraftKings and FanDuel.
        </p>

        {/* Golfer Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Rank</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Golfer</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">Avg DFS Pts</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">Cut Rate</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">SG: Total</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">SG: APP</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">SG: OTT</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 hidden md:table-cell">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {golfers.map((g) => (
                <tr key={g.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-400">#{g.worldRanking}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/golfers/${g.slug}`}
                      className="font-medium text-green-700 hover:text-green-800 hover:underline"
                    >
                      {g.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-center font-mono">{g.avgDfsPoints.toFixed(1)}</td>
                  <td className="px-4 py-2 text-center font-mono">{g.cutRate}%</td>
                  <td className="px-4 py-2 text-center font-mono">
                    <span className={g.strokesGained.total >= 0 ? 'text-green-700' : 'text-red-600'}>
                      {g.strokesGained.total >= 0 ? '+' : ''}{g.strokesGained.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center font-mono">
                    <span className={g.strokesGained.approach >= 0 ? 'text-green-700' : 'text-red-600'}>
                      {g.strokesGained.approach >= 0 ? '+' : ''}{g.strokesGained.approach.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center font-mono">
                    <span className={g.strokesGained.offTheTee >= 0 ? 'text-green-700' : 'text-red-600'}>
                      {g.strokesGained.offTheTee >= 0 ? '+' : ''}{g.strokesGained.offTheTee.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center text-gray-500 hidden md:table-cell">{g.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SEO Content */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">How to Use Golfer Profiles for DFS</h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Understanding each golfer&apos;s strokes gained profile is the foundation of
              successful golf DFS on DraftKings and FanDuel. Strokes gained measures how many
              strokes a golfer gains or loses relative to the field average in four key
              categories: off the tee (driving), approach (iron play), around the green (short
              game), and putting.
            </p>
            <p>
              The key insight for DFS is that different courses demand different skill sets.
              A golfer who is elite off the tee but poor around the green will thrive at a
              long, bomber-friendly course like Torrey Pines South but struggle at a short-game
              course like Pinehurst No. 2. By matching golfer profiles to course demands, you
              can identify value plays that the general public overlooks.
            </p>
            <p>
              Each golfer profile above includes their best and worst course fits based on
              BirdieVantage&apos;s course-fit model, which weights strokes gained categories
              according to historical performance data at each venue. Use these profiles
              alongside the{' '}
              <Link href="/courses" className="text-green-700 hover:underline">
                course pages
              </Link>{' '}
              and the{' '}
              <Link href="/optimizer" className="text-green-700 hover:underline">
                lineup optimizer
              </Link>{' '}
              to build winning lineups every week.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 p-6 bg-green-50 rounded-xl text-center">
          <h3 className="text-lg font-bold mb-2">Ready to Build Your Lineup?</h3>
          <p className="text-gray-600 mb-4">
            Use BirdieVantage&apos;s free optimizer with course-fit scoring and Monte Carlo
            simulation to generate optimal DraftKings and FanDuel golf lineups.
          </p>
          <Link
            href="/optimizer"
            className="inline-block px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors"
          >
            Launch Optimizer
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <span>BirdieVantage &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <Link href="/optimizer" className="hover:text-gray-700">Optimizer</Link>
            <Link href="/live" className="hover:text-gray-700">Live</Link>
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
