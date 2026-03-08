import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCourses, getCourseBySlug } from '@/lib/course-data';
import { COURSE_PROFILES } from '@/lib/course-fit';
import { getGolferBySlug } from '@/lib/golfer-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.courseName} DFS Breakdown | BirdieLine`,
    description: `${course.courseName} DFS analysis for the ${course.tournamentName}. Course-fit weights, key stats, historical winners, and DFS strategy tips for DraftKings and FanDuel golf.`,
    openGraph: {
      title: `${course.courseName} DFS Breakdown | BirdieLine`,
      description: `Complete DFS breakdown for ${course.tournamentName} at ${course.courseName}.`,
      type: 'article',
    },
  };
}

export default async function CourseProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const profile = COURSE_PROFILES[slug];
  const topGolfers = course.topGolferFits
    .map((s) => getGolferBySlug(s))
    .filter((g) => g != null);

  const weights = profile
    ? [
        { label: 'Off the Tee', abbr: 'OTT', weight: profile.offTheTeeWeight },
        { label: 'Approach', abbr: 'APP', weight: profile.approachWeight },
        { label: 'Around the Green', abbr: 'ATG', weight: profile.aroundTheGreenWeight },
        { label: 'Putting', abbr: 'P', weight: profile.puttingWeight },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Header currentSlug={slug} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/courses" className="hover:text-green-700">Course Profiles</Link>
            <span>/</span>
            <span className="text-gray-800">{course.courseName}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            {course.courseName}
          </h1>
          <p className="text-lg text-green-700 font-semibold mb-1">{course.tournamentName}</p>
          <p className="text-gray-500 mb-8">{course.location}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard label="Par" value={course.par.toString()} />
            <InfoCard label="Yardage" value={course.yardage.toLocaleString()} />
            <InfoCard label="Grass Type" value={profile?.grassType ?? 'mixed'} />
            <InfoCard label="Avg Drive" value={`${profile?.avgDrivingDistance ?? 295} yds`} />
          </div>
        </section>

        {/* Course Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
          <p className="text-gray-600 leading-relaxed">{course.description}</p>
        </section>

        {/* Course Fit Profile */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Course Fit Profile</h2>
          <p className="text-gray-600 mb-6">
            BirdieLine&apos;s course-fit model assigns weights to each strokes gained category based on
            historical performance data at {course.courseName}. Higher weights indicate
            categories that matter more for success at this venue.
          </p>
          <div className="space-y-4">
            {weights.map((w) => (
              <div key={w.abbr}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    SG: {w.label} <span className="text-gray-400">({w.abbr})</span>
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {(w.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${w.weight * 100 * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Key Stats That Matter Here</h2>
          <div className="space-y-3">
            {course.keyStats.map((stat, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full bg-green-500" />
                <p className="text-gray-600">{stat}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Holes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Key Holes</h2>
          <div className="space-y-4">
            {course.keyHoles.map((hole) => (
              <div key={hole.hole} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center">
                    {hole.hole}
                  </span>
                  <div>
                    <span className="font-bold text-gray-900">Par {hole.par}</span>
                    <span className="text-gray-400 mx-2">&middot;</span>
                    <span className="text-gray-600">{hole.yards} yards</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{hole.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Historical Winners */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Historical Winners</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Year</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Winner</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {course.historicalWinners.map((w, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{w.year}</td>
                    <td className="px-4 py-2">{w.winner}</td>
                    <td className="px-4 py-2 text-center font-mono">{w.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* DFS Strategy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            DFS Strategy for the {course.tournamentName}
          </h2>
          <div className="space-y-3">
            {course.dfsTips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top Golfer Fits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Top Golfer Fits for {course.courseName}</h2>
          <p className="text-gray-600 mb-4">
            Golfers whose strokes gained profiles align best with the demands of this course,
            based on BirdieLine&apos;s course-fit model.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topGolfers.map((g) => (
              <Link
                key={g.slug}
                href={`/golfers/${g.slug}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center">
                  #{g.worldRanking}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{g.name}</h3>
                  <p className="text-sm text-gray-500">
                    SG Total: {g.strokesGained.total >= 0 ? '+' : ''}{g.strokesGained.total.toFixed(2)}
                    <span className="mx-1">&middot;</span>
                    Cut Rate: {g.cutRate}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-6 bg-green-50 rounded-xl text-center">
          <h3 className="text-lg font-bold mb-2">
            Build Your {course.tournamentName} Lineup
          </h3>
          <p className="text-gray-600 mb-4">
            Use BirdieLine&apos;s optimizer with built-in course-fit scoring for{' '}
            {course.courseName} to generate optimal DraftKings and FanDuel lineups.
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
          <h3 className="text-lg font-bold mb-4">Explore More Courses</h3>
          <div className="flex flex-wrap gap-2">
            {getAllCourses()
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 transition-colors"
                >
                  {c.courseName}
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Shared Components ─── */

function Header({ currentSlug }: { currentSlug: string }) {
  return (
    <header className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-700">BirdieLine</Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/optimizer" className="text-gray-600 hover:text-gray-800">Optimizer</Link>
          <Link href="/strategy" className="text-gray-600 hover:text-gray-800">Strategy</Link>
          <Link href="/scoring" className="text-gray-600 hover:text-gray-800">Scoring</Link>
          <Link href="/golfers" className="text-gray-600 hover:text-gray-800">Golfers</Link>
          <Link href="/courses" className={currentSlug ? 'font-medium text-green-700' : 'text-gray-600 hover:text-gray-800'}>Courses</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
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
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 text-center">
      <p className="text-2xl font-bold text-gray-900 capitalize">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
