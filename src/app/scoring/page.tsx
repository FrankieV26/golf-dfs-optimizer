import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Golf DFS Scoring Rules - DraftKings vs FanDuel Comparison',
  description:
    'Complete breakdown of DraftKings and FanDuel golf DFS scoring rules. Per-hole scoring, finish position bonuses, streak bonuses, and how they affect strategy.',
};

export default function ScoringPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.svg" alt="BirdieVantage" className="h-10 w-auto" /></Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/optimizer" className="text-gray-600 hover:text-gray-800">Optimizer</Link>
            <Link href="/strategy" className="text-gray-600 hover:text-gray-800">Strategy</Link>
            <Link href="/scoring" className="font-medium text-green-700">Scoring</Link>
            <Link href="/golfers" className="text-gray-600 hover:text-gray-800">Golfers</Link>
            <Link href="/courses" className="text-gray-600 hover:text-gray-800">Courses</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-4">Golf DFS Scoring Rules</h1>
        <p className="text-lg text-gray-600 mb-10">
          Complete comparison of DraftKings and FanDuel golf fantasy scoring for the 2025-2026 PGA Tour season.
        </p>

        {/* Roster Structure */}
        <h2 className="text-2xl font-bold mb-4">Roster Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card title="DraftKings Classic" accent="green">
            <ul className="space-y-1 text-sm">
              <li>6 Golfers</li>
              <li>$50,000 Salary Cap</li>
              <li>Salaries: ~$5,000 - $11,000</li>
            </ul>
          </Card>
          <Card title="FanDuel Full Roster" accent="blue">
            <ul className="space-y-1 text-sm">
              <li>6 Golfers</li>
              <li>$60,000 Salary Cap</li>
              <li>Salaries: ~$4,500 - $10,700</li>
            </ul>
          </Card>
        </div>

        {/* Per-Hole Scoring */}
        <h2 className="text-2xl font-bold mb-4">Per-Hole Scoring</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-12">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Result</th>
                <th className="px-4 py-3 text-center font-medium text-green-700">DraftKings</th>
                <th className="px-4 py-3 text-center font-medium text-blue-700">FanDuel</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Strategy Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <ScoringRow result="Double Eagle (Albatross)" dk="+20" fd="+7" note="Extremely rare" />
              <ScoringRow result="Eagle" dk="+8" fd="+7" note="DK rewards eagles slightly more" />
              <ScoringRow result="Birdie" dk="+3" fd="+3.1" note="FD has a slight edge per birdie" />
              <ScoringRow result="Par" dk="+0.5" fd="+0.5" note="Same on both platforms" />
              <ScoringRow result="Bogey" dk="-0.5" fd="-1.0" note="FD is 2x more punishing" />
              <ScoringRow result="Double Bogey+" dk="-1.0" fd="-3.0" note="FD is 3x more punishing" />
            </tbody>
          </table>
        </div>

        {/* Bonuses */}
        <h2 className="text-2xl font-bold mb-4">Bonus Scoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card title="DraftKings Bonuses" accent="green">
            <ul className="space-y-2 text-sm">
              <li><strong>Streak (3+ birdies or better):</strong> +3 pts (max 1 per round)</li>
              <li><strong>Bogey-Free Round:</strong> +3 pts</li>
              <li><strong>All 4 Rounds Under 70:</strong> +5 pts</li>
              <li><strong>Hole-in-One:</strong> +10 pts</li>
            </ul>
          </Card>
          <Card title="FanDuel Bonuses" accent="blue">
            <ul className="space-y-2 text-sm">
              <li><strong>Made Cut:</strong> +5 pts</li>
              <li><strong>Consecutive Under-Par Holes:</strong> +0.6 pts per</li>
              <li><strong>Bounce Back (under par after over par):</strong> +0.3 pts</li>
              <li><strong>5+ Birdies in a Round:</strong> +4 pts</li>
              <li><strong>Bogey-Free Round:</strong> +5 pts</li>
            </ul>
          </Card>
        </div>

        {/* Finish Position Bonuses */}
        <h2 className="text-2xl font-bold mb-4">Finish Position Bonuses</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-12">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Finish</th>
                <th className="px-4 py-3 text-center font-medium text-green-700">DraftKings</th>
                <th className="px-4 py-3 text-center font-medium text-blue-700">FanDuel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <FinishRow finish="1st" dk="+30" fd="+20" />
              <FinishRow finish="2nd" dk="+20" fd="+12" />
              <FinishRow finish="3rd" dk="+18" fd="+12" />
              <FinishRow finish="4th" dk="+16" fd="+12" />
              <FinishRow finish="5th" dk="+14" fd="+12" />
              <FinishRow finish="6th-7th" dk="+12/+10" fd="+8" />
              <FinishRow finish="8th-10th" dk="+9/+8/+7" fd="+8" />
              <FinishRow finish="11th-15th" dk="+6" fd="+5" />
              <FinishRow finish="16th-20th" dk="+5" fd="+5" />
              <FinishRow finish="21st-25th" dk="+4" fd="+5" />
              <FinishRow finish="26th-30th" dk="+3" fd="—" />
              <FinishRow finish="31st-40th" dk="+2" fd="—" />
              <FinishRow finish="41st-50th" dk="+1" fd="—" />
            </tbody>
          </table>
        </div>

        {/* Strategy Implications */}
        <h2 className="text-2xl font-bold mb-4">Strategy Implications</h2>
        <div className="prose prose-gray max-w-none space-y-4 mb-12">
          <p>
            The scoring differences between platforms create real strategic divergence:
          </p>
          <ul>
            <li>
              <strong>DraftKings favors volatile birdie machines.</strong> The asymmetry
              between birdies (+3) and bogeys (-0.5) means a golfer who makes 5 birdies
              and 3 bogeys (+13.5) massively outscores a golfer who makes 2 birdies and
              0 bogeys (+6). The streak and under-70 bonuses amplify this further.
            </li>
            <li>
              <strong>FanDuel favors consistent performers.</strong> With bogeys costing
              -1 and doubles costing -3, a bad hole is genuinely painful. The +5 made-cut
              bonus and +5 bogey-free round bonus reward steady play. Target golfers with
              low bogey rates on FanDuel.
            </li>
            <li>
              <strong>DraftKings has more granular finish bonuses</strong> (30 for 1st down
              to 1 for 50th), which makes top-20 probability more important. On FanDuel,
              the finish bonus tiers are broader but shallower.
            </li>
          </ul>
        </div>

        <div className="p-6 bg-green-50 rounded-xl text-center">
          <h3 className="text-lg font-bold mb-2">
            Optimize for the Right Platform
          </h3>
          <p className="text-gray-600 mb-4">
            BirdieVantage automatically applies the correct scoring rules for DraftKings or FanDuel.
          </p>
          <Link
            href="/optimizer"
            className="inline-block px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800"
          >
            Launch Optimizer
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-4">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/strategy"
              className="block rounded-xl border border-gray-200 p-4 hover:border-green-300 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">Golf DFS Strategy Guide</h4>
              <p className="text-sm text-gray-600">Course fit, ownership leverage, bankroll management, and more.</p>
            </Link>
            <Link
              href="/golfers/scottie-scheffler"
              className="block rounded-xl border border-gray-200 p-4 hover:border-green-300 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">Scottie Scheffler Profile</h4>
              <p className="text-sm text-gray-600">World #1 — the prototypical high-ceiling DK play with elite birdie upside.</p>
            </Link>
            <Link
              href="/golfers/collin-morikawa"
              className="block rounded-xl border border-gray-200 p-4 hover:border-green-300 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">Collin Morikawa Profile</h4>
              <p className="text-sm text-gray-600">Elite iron player and low-bogey rate — a FanDuel specialist.</p>
            </Link>
            <Link
              href="/courses/augusta-national"
              className="block rounded-xl border border-gray-200 p-4 hover:border-green-300 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">Augusta National Breakdown</h4>
              <p className="text-sm text-gray-600">Where eagles and birdie streaks swing DraftKings scoring the most.</p>
            </Link>
          </div>
        </div>
      </main>

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
    </div>
  );
}

function Card({
  title,
  accent,
  children,
}: {
  title: string;
  accent: 'green' | 'blue';
  children: React.ReactNode;
}) {
  const border = accent === 'green' ? 'border-green-200' : 'border-blue-200';
  const bg = accent === 'green' ? 'bg-green-50' : 'bg-blue-50';
  const text = accent === 'green' ? 'text-green-700' : 'text-blue-700';
  return (
    <div className={`rounded-xl border ${border} ${bg} p-5`}>
      <h3 className={`font-bold mb-3 ${text}`}>{title}</h3>
      {children}
    </div>
  );
}

function ScoringRow({
  result,
  dk,
  fd,
  note,
}: {
  result: string;
  dk: string;
  fd: string;
  note: string;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 font-medium">{result}</td>
      <td className="px-4 py-2 text-center font-mono">{dk}</td>
      <td className="px-4 py-2 text-center font-mono">{fd}</td>
      <td className="px-4 py-2 text-gray-500 text-xs">{note}</td>
    </tr>
  );
}

function FinishRow({ finish, dk, fd }: { finish: string; dk: string; fd: string }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 font-medium">{finish}</td>
      <td className="px-4 py-2 text-center font-mono">{dk}</td>
      <td className="px-4 py-2 text-center font-mono">{fd}</td>
    </tr>
  );
}
