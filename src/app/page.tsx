import Link from 'next/link';

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
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/"><img src="/logo.svg" alt="BirdieVantage" className="h-10 w-auto" /></a>
          <nav className="flex gap-6 text-sm">
            <Link href="/optimizer" className="text-gray-600 hover:text-gray-800">
              Optimizer
            </Link>
            <Link href="/strategy" className="text-gray-600 hover:text-gray-800">
              Strategy
            </Link>
            <Link href="/scoring" className="text-gray-600 hover:text-gray-800">
              Scoring
            </Link>
            <Link href="/golfers" className="text-gray-600 hover:text-gray-800">
              Golfers
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-gray-800">
              Courses
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          The Free Golf DFS Optimizer<br />
          <span className="text-green-700">That Actually Works</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Powered by Data Golf projections and strokes-gained data. Course-fit
          analysis, ownership leverage, and Monte Carlo simulation — the same
          features paid tools charge $40&#8211;100+/month for, completely free.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/optimizer"
            className="px-8 py-4 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 transition-colors"
          >
            Build Your Lineup
          </Link>
          <Link
            href="/strategy"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            Learn Strategy
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Serious Golf DFS Players
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Course-Fit Scoring"
              description="Golfers are ranked by how their strokes-gained profile matches the week's course demands — driving, approach distances, green surface, and conditions."
            />
            <FeatureCard
              title="Monte Carlo Simulation"
              description="10,000+ tournament simulations model made-cut probability, finish position distributions, and realistic scoring floors and ceilings for each golfer."
            />
            <FeatureCard
              title="Ownership Leverage"
              description="Build contrarian lineups that maximize expected ROI, not just raw points. Target underowned golfers the field is sleeping on."
            />
            <FeatureCard
              title="DraftKings + FanDuel"
              description="Supports both platforms with correct salary caps and scoring rules. Load DK slates automatically or upload FanDuel CSVs."
            />
            <FeatureCard
              title="Multi-Lineup Generation"
              description="Generate up to 150 unique lineups with exposure controls. Diversify your GPP portfolio while maintaining lineup quality."
            />
            <FeatureCard
              title="Export to CSV"
              description="Download lineups as CSV files ready for direct upload to DraftKings or FanDuel contest lobbies. No copy-paste."
            />
            <FeatureCard
              title="Data Golf Powered"
              description="Projections and strokes-gained data come from Data Golf — the gold standard in golf analytics. Real statistical models, not crowd-sourced or hand-curated numbers."
            />
          </div>
        </div>
      </section>

      {/* Competitive Comparison */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Paid-Tool Features. $0 Price Tag.
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Other golf DFS optimizers charge $40&#8211;100+/month for the features
            BirdieVantage includes for free.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-700">Feature</th>
                  <th className="px-5 py-3 font-semibold text-green-700 text-center">BirdieVantage</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 text-center">Paid Tools ($40&#8211;297/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <ComparisonRow feature="Branch-and-bound optimizer" free paid />
                <ComparisonRow feature="Monte Carlo simulation (10,000+ sims)" free paid />
                <ComparisonRow feature="Data Golf projections & SG data" free paid />
                <ComparisonRow feature="Course-fit scoring" free paid />
                <ComparisonRow feature="Ownership leverage for GPPs" free paid />
                <ComparisonRow feature="DraftKings auto-fetch + FanDuel CSV" free paid />
                <ComparisonRow feature="Multi-lineup generation & exposure controls" free paid />
                <tr className="bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-800">Price</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700">Free</td>
                  <td className="px-5 py-3 text-center font-semibold text-gray-500">$40&#8211;297/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
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
              title="Optimize & Simulate"
              description="Our engine evaluates millions of combinations with Monte Carlo simulation and ownership-aware optimization. Export and dominate."
            />
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            Why Use a Golf DFS Lineup Optimizer?
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
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
            <h3 className="text-xl font-semibold text-gray-800 mt-8">
              DraftKings Golf Classic Scoring
            </h3>
            <p>
              DraftKings Classic golf scores per hole: Eagle or better (+8), Birdie (+3),
              Par (+0.5), Bogey (-0.5), Double Bogey or worse (-1). Bonuses include 3+
              birdie streaks (+3), bogey-free rounds (+3), all rounds under 70 (+5), and
              hole-in-one (+10). Finish position bonuses range from 1st (+30) to 50th (+1).
              The roster is 6 golfers with a $50,000 salary cap.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-8">
              FanDuel Golf Scoring
            </h3>
            <p>
              FanDuel golf scores per hole: Eagle or better (+7), Birdie (+3.1), Par (+0.5),
              Bogey (-1), Double Bogey or worse (-3). FanDuel is more punishing for bogeys,
              making consistent golfers more valuable. Made Cut bonus (+5), with finish
              position bonuses from 1st (+20) to 25th (+5). The roster is 6 golfers with a
              $60,000 salary cap.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-8">
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
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Build Better Lineups?</h2>
        <p className="text-gray-600 mb-8">
          Free to use. No account required. Start optimizing now.
        </p>
        <Link
          href="/optimizer"
          className="px-8 py-4 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 transition-colors"
        >
          Launch Optimizer
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
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
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function Step({ num, title, description }: { num: number; title: string; description: string }) {
  return (
    <div>
      <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold text-xl flex items-center justify-center mx-auto mb-4">
        {num}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function ComparisonRow({ feature, free, paid }: { feature: string; free: boolean; paid: boolean }) {
  return (
    <tr>
      <td className="px-5 py-3 text-gray-700">{feature}</td>
      <td className="px-5 py-3 text-center">
        {free ? (
          <span className="text-green-700 font-bold" aria-label="Included">&#10003;</span>
        ) : (
          <span className="text-gray-300">&#8212;</span>
        )}
      </td>
      <td className="px-5 py-3 text-center">
        {paid ? (
          <span className="text-gray-500 font-semibold">$$</span>
        ) : (
          <span className="text-gray-300">&#8212;</span>
        )}
      </td>
    </tr>
  );
}
