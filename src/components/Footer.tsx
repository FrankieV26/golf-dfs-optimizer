import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/optimizer', label: 'Optimizer' },
  { href: '/live', label: 'Live' },
  { href: '/strategy', label: 'Strategy' },
  { href: '/scoring', label: 'Scoring' },
  { href: '/golfers', label: 'Golfers' },
  { href: '/courses', label: 'Courses' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>BirdieVantage &copy; {new Date().getFullYear()}</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
