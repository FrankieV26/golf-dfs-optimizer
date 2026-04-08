import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BirdieVantage Golf DFS Optimizer',
  applicationCategory: 'SportsApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Free golf DFS lineup optimizer for DraftKings and FanDuel. Generate optimal PGA lineups with course-fit scoring, Monte Carlo simulation, and ownership-aware optimization.',
  url: 'https://birdievantage.com/optimizer',
  featureList: [
    'Course-fit scoring',
    'Monte Carlo simulation',
    'Ownership leverage optimization',
    'DraftKings and FanDuel support',
    'Multi-lineup generation',
    'CSV export',
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <NavBar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
          The Free Golf DFS Optimizer<br />
          <span className="text-green-700 dark:text-green-400">That Actually Works</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Powered by Data Golf projections and strokes-gained data. Course-fit
          analysis, ownership leverage, and Monte Carlo simulation — the same
          features paid tools charge $40&#8211;100+/month for, completely free.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/optimizer"
            className="px-8 py-4 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 active:scale-[0.97] transition-all shadow-sm"
          >
            Build Your Lineup
          </Link>
          <Link
            href="/strategy"
            className="px-8 py-4 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:scale-[0.97] transition-all"
          >
            Learn Strategy
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">
            Built for Serious Golf DFS Players
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Course-Fit Scoring"
              description="Golfers are ranked by how their strokes-gained profile matches the week's course demands — driving, approach distances, green surface, and conditions."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>}
            />
            <FeatureCard
              title="Monte Carlo Simulation"
              description="10,000+ tournament simulations model made-cut probability, finish position distributions, and realistic scoring floors and ceilings for each golfer."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
            />
            <FeatureCard
              title="Ownership Leverage"
              description="Build contrarian lineups that maximize expected ROI, not just raw points. Target underowned golfers the field is sleeping on."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>}
            />
            <FeatureCard
              title="DraftKings + FanDuel"
              description="Supports both platforms with correct salary caps and scoring rules. Load DK slates automatically or upload FanDuel CSVs."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>}
            />
            <FeatureCard
              title="Multi-Lineup Generation"
              description="Generate up to 150 unique lineups with exposure controls. Diversify your GPP portfolio while maintaining lineup quality."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>}
            />
            <FeatureCard
              title="Export to CSV"
              description="Download lineups as CSV files ready for direct upload to DraftKings or FanDuel contest lobbies. No copy-paste."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
            />
          </div>
          <div className="mt-6">
            <FeatureCard
              title="Data Golf Powered"
              description="Projections and strokes-gained data come from Data Golf — the gold standard in golf analytics. Real statistical models, not crowd-sourced or hand-curated numbers."
              icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* Competitive Comparison */}
      <section className="py-20 flex-1">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-gray-100">
            Paid-Tool Features. $0 Price Tag.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Other golf DFS optimizers charge $40&#8211;100+/month for the features
            BirdieVantage includes for free.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Feature</th>
                  <th className="px-5 py-3 font-semibold text-green-700 dark:text-green-400 text-center">BirdieVantage</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-center">Paid Tools ($40&#8211;297/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <ComparisonRow feature="Branch-and-bound optimizer" free paid />
                <ComparisonRow feature="Monte Carlo simulation (10,000+ sims)" free paid />
                <ComparisonRow feature="Data Golf projections & SG data" free paid />
                <ComparisonRow feature="Course-fit scoring" free paid />
                <ComparisonRow feature="Ownership leverage for GPPs" free paid />
                <ComparisonRow feature="DraftKings auto-fetch + FanDuel CSV" free paid />
                <ComparisonRow feature="Multi-lineup generation & exposure controls" free paid />
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-200">Price</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700 dark:text-green-400">Free</td>
                  <td className="px-5 py-3 text-center font-semibold text-gray-500 dark:text-gray-400">$40&#8211;297/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">
            How BirdieVantage Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Step
              num={1}
              title="Load Players"
              description="Fetch the current DraftKings golf slate or upload your FanDuel CSV. Salaries, projections, course-fit scores, and ownership data load automatically."
            />
            <Step
              num={2}
              title="Customize"
              description="Lock in golfers you love, exclude those you don't. Set exposure limits, ownership caps, and lineup count."
            />
            <Step
              num={3}
              title="Optimize & Export"
              description="Our engine evaluates millions of combinations with Monte Carlo simulation and ownership-aware optimization. Export and dominate."
            />
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">
            Why Use a Golf DFS Lineup Optimizer?
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
            <p>
              Golf DFS on DraftKings and FanDuel is uniquely challenging. With fields of
              150+ golfers competing over four days, the number of possible 6-man lineups
              is astronomical. A lineup optimizer uses mathematical optimization to find
              the highest-scoring combinations under the salary cap — something that would
              take hours to do by hand.
            </p>
            <p>
              BirdieVantage&apos;s optimizer uses a branch-and-bound algorithm with Monte
              Carlo tournament simulation, evaluating millions of combinations in
              milliseconds. Combined with course-fit scoring and ownership projections,
              it gives you a real edge in GPP tournaments.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8">
              DraftKings Golf Classic Scoring
            </h3>
            <p>
              DraftKings Classic golf scores per hole: Eagle or better (+8), Birdie (+3),
              Par (+0.5), Bogey (-0.5), Double Bogey or worse (-1). Bonuses include 3+
              birdie streaks (+3), bogey-free rounds (+3), all rounds under 70 (+5), and
              hole-in-one (+10). Finish position bonuses range from 1st (+30) to 50th (+1).
              The roster is 6 golfers with a $50,000 salary cap.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8">
              FanDuel Golf Scoring
            </h3>
            <p>
              FanDuel golf scores per hole: Eagle or better (+7), Birdie (+3.1), Par (+0.5),
              Bogey (-1), Double Bogey or worse (-3). FanDuel is more punishing for bogeys,
              making consistent golfers more valuable. Made Cut bonus (+5), with finish
              position bonuses from 1st (+20) to 25th (+5). The roster is 6 golfers with a
              $60,000 salary cap.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8">
              What Makes BirdieVantage Different?
            </h3>
            <p>
              Most free golf DFS optimizers just find the highest projected-points lineup
              under the salary cap. BirdieVantage goes further with three features borrowed
              from the paid tools: course-fit scoring evaluates each golfer&apos;s
              strokes-gained profile against the week&apos;s course demands. Monte Carlo
              simulation models cut-line probability and scoring distributions rather than
              using a single-point projection. And ownership-aware optimization builds
              lineups that maximize expected ROI in GPP tournaments, not just raw fantasy
              points.
            </p>
            <p>
              Paid golf DFS tools like SaberSim, FantasyLabs, and RotoGrinders
              charge between $40 and $297 per month for access to similar optimizer
              features, projections, and simulation engines. BirdieVantage provides
              the same core capabilities — branch-and-bound optimization, 10,000+
              Monte Carlo simulations, Data Golf projections, course-fit scoring,
              and ownership leverage — at no cost. No subscription, no account
              required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">Ready to Build Better Lineups?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Free to use. No account required. Start optimizing now.
        </p>
        <Link
          href="/optimizer"
          className="px-8 py-4 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 active:scale-[0.97] transition-all shadow-sm"
        >
          Launch Optimizer
        </Link>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      {icon && <div className="text-green-700 dark:text-green-400 mb-3">{icon}</div>}
      <h3 className="text-lg font-bold mb-2 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ num, title, description }: { num: number; title: string; description: string }) {
  return (
    <div>
      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 font-bold text-xl flex items-center justify-center mx-auto mb-4">
        {num}
      </div>
      <h3 className="text-lg font-bold mb-2 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function ComparisonRow({ feature, free, paid }: { feature: string; free: boolean; paid: boolean }) {
  return (
    <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors">
      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{feature}</td>
      <td className="px-5 py-3 text-center">
        {free ? (
          <span className="text-green-700 dark:text-green-400 font-bold" aria-label="Included">&#10003;</span>
        ) : (
          <span className="text-gray-300 dark:text-gray-600">&#8212;</span>
        )}
      </td>
      <td className="px-5 py-3 text-center">
        {paid ? (
          <span className="text-gray-500 dark:text-gray-400 font-semibold">$$</span>
        ) : (
          <span className="text-gray-300 dark:text-gray-600">&#8212;</span>
        )}
      </td>
    </tr>
  );
}
