import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCourses } from '@/lib/course-data';
import { COURSE_PROFILES } from '@/lib/course-fit';

export const metadata: Metadata = {
  title: 'PGA Tour Course DFS Breakdowns | BirdieVantage',
  description:
    'DFS course breakdowns for top PGA Tour venues. Course-fit weights, key stats, historical winners, and DFS strategy tips for DraftKings and FanDuel golf.',
};

export default function CoursesIndexPage() {
  const courses = getAllCourses();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.svg" alt="BirdieVantage" className="h-10 w-auto" /></Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/optimizer" className="text-gray-600 hover:text-gray-800">Optimizer</Link>
            <Link href="/strategy" className="text-gray-600 hover:text-gray-800">Strategy</Link>
            <Link href="/scoring" className="text-gray-600 hover:text-gray-800">Scoring</Link>
            <Link href="/golfers" className="text-gray-600 hover:text-gray-800">Golfers</Link>
            <Link href="/courses" className="font-medium text-green-700">Courses</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          PGA Tour Course DFS Breakdowns
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-3xl">
          Course-by-course DFS analysis for the top venues on the PGA Tour schedule. Each
          breakdown includes course-fit weights, key statistics, historical winners, and
          actionable DFS strategy tips for DraftKings and FanDuel.
        </p>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {courses.map((course) => {
            const profile = COURSE_PROFILES[course.slug];
            const topWeight = getTopWeight(profile);
            return (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="block rounded-xl border border-gray-200 p-6 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-1">{course.courseName}</h2>
                <p className="text-sm text-green-700 font-semibold mb-3">{course.tournamentName}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{course.location}</span>
                  <span>&middot;</span>
                  <span>Par {course.par}</span>
                  <span>&middot;</span>
                  <span>{course.yardage.toLocaleString()} yds</span>
                </div>
                {profile && (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <WeightPill label="OTT" value={profile.offTheTeeWeight} highlight={topWeight === 'OTT'} />
                    <WeightPill label="APP" value={profile.approachWeight} highlight={topWeight === 'APP'} />
                    <WeightPill label="ATG" value={profile.aroundTheGreenWeight} highlight={topWeight === 'ATG'} />
                    <WeightPill label="P" value={profile.puttingWeight} highlight={topWeight === 'P'} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* SEO Content */}
        <section className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Why Course Fit Matters in Golf DFS</h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Every golf course on the PGA Tour demands a different combination of skills.
              Some courses reward bombers who can overpower the layout with driving distance,
              while others favor precision iron players, short-game artists, or elite putters.
              Understanding these course demands is the single most important concept in golf
              DFS strategy.
            </p>
            <p>
              BirdieVantage&apos;s course-fit model assigns weights to four strokes gained
              categories — off the tee, approach, around the green, and putting — based on
              historical performance data at each venue. These weights tell you which skills
              matter most for success at each course, allowing you to match{' '}
              <Link href="/golfers" className="text-green-700 hover:underline">
                golfer profiles
              </Link>{' '}
              to course demands and identify value plays that the general public overlooks.
            </p>
            <p>
              For example, TPC Sawgrass weights approach play at 40% because precise iron play
              is the primary differentiator at THE PLAYERS Championship. Meanwhile, Torrey Pines
              South weights off-the-tee play at 30% because driving distance provides a massive
              advantage at one of the longest courses on tour. By understanding these differences,
              you can build more informed DraftKings and FanDuel lineups every week.
            </p>
            <p>
              Browse the course profiles above for detailed breakdowns, or use the{' '}
              <Link href="/optimizer" className="text-green-700 hover:underline">
                lineup optimizer
              </Link>{' '}
              to automatically apply course-fit scoring to your lineups.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 p-6 bg-green-50 rounded-xl text-center">
          <h3 className="text-lg font-bold mb-2">Optimize with Course-Fit Scoring</h3>
          <p className="text-gray-600 mb-4">
            BirdieVantage&apos;s optimizer automatically applies course-fit weights to rank
            golfers by how well their profile matches this week&apos;s venue.
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

function getTopWeight(profile: { offTheTeeWeight: number; approachWeight: number; aroundTheGreenWeight: number; puttingWeight: number } | undefined): string {
  if (!profile) return 'APP';
  const entries = [
    { label: 'OTT', value: profile.offTheTeeWeight },
    { label: 'APP', value: profile.approachWeight },
    { label: 'ATG', value: profile.aroundTheGreenWeight },
    { label: 'P', value: profile.puttingWeight },
  ];
  return entries.reduce((max, e) => (e.value > max.value ? e : max), entries[0]).label;
}

function WeightPill({ label, value, highlight }: { label: string; value: number; highlight: boolean }) {
  return (
    <div className={`rounded-lg py-1.5 px-2 text-xs ${highlight ? 'bg-green-100 text-green-800 font-bold' : 'bg-gray-100 text-gray-600'}`}>
      <div className="font-medium">{label}</div>
      <div>{(value * 100).toFixed(0)}%</div>
    </div>
  );
}
