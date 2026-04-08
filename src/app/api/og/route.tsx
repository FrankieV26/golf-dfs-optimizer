import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          {/* Flag + bird icon */}
          <svg width="80" height="100" viewBox="0 0 100 120">
            <line x1="50" y1="36" x2="50" y2="105" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 36 L78 46 L50 56 Z" fill="#22c55e" />
            <g transform="translate(50, 36) scale(0.55) translate(-50, -50)">
              <ellipse cx="50" cy="42" rx="9" ry="7" fill="#22c55e" transform="rotate(-10 50 42)" />
              <circle cx="57" cy="35" r="6" fill="#22c55e" />
              <path d="M62 34 L68 36 L62 38 Z" fill="#f59e0b" />
              <circle cx="59" cy="34" r="1.5" fill="white" />
              <circle cx="59.4" cy="33.8" r="0.8" fill="#111827" />
              <path d="M44 39 Q39 36 36 39 Q39 41 44 42" fill="#16a34a" />
              <path d="M41 44 L33 40 L35 44 L31 42 L35 46 Z" fill="#16a34a" />
              <path d="M47 48 L50 50 L53 48" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <ellipse cx="50" cy="108" rx="26" ry="5" fill="#bbf7d0" opacity="0.4" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: '56px', fontWeight: 700 }}>
              <span style={{ color: '#ffffff' }}>Birdie</span>
              <span style={{ color: '#22c55e' }}>Vantage</span>
            </div>
            <span style={{ color: '#9ca3af', fontSize: '18px', letterSpacing: '3px', marginTop: '4px' }}>
              GOLF DFS OPTIMIZER
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: '24px',
            color: '#d1d5db',
            marginTop: '16px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Free lineup optimizer for DraftKings & FanDuel with course-fit scoring and Monte Carlo simulation
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {['Course Fit', 'Monte Carlo Sim', 'Ownership Leverage', 'Free'].map((label) => (
            <div
              key={label}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid #22c55e',
                color: '#22c55e',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
