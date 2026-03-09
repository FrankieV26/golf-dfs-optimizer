# BirdieVantage

Free golf DFS lineup optimizer for DraftKings and FanDuel.

**Live at [birdievantage.com](https://birdievantage.com)**

## Features

- **Branch-and-bound optimizer** -- generates optimal 6-golfer lineups under salary cap
- **Monte Carlo simulation** -- 10,000-sim tournament model blended with Data Golf probabilities
- **Data Golf integration** -- real strokes-gained data, projections, ownership, course fit adjustments
- **Course-fit scoring** -- SG weights per venue (OTT, APP, ARG, Putt)
- **Ownership leverage** -- GPP mode with projected ownership to build contrarian lineups
- **Multi-lineup generation** -- up to 20 lineups with max exposure controls
- **DraftKings live slate** -- auto-fetches current contest pool via DK API
- **FanDuel CSV upload** -- import FanDuel player pools
- **Custom projection upload** -- blend your own CSV projections with Data Golf data
- **DK-compatible export** -- one-click CSV export in DraftKings upload format
- **55 SEO pages** -- 30 golfer profiles, 8 course breakdowns, strategy and scoring guides

## Tech Stack

- Next.js 16, TypeScript, Tailwind CSS
- Data Golf API (Scratch PLUS)
- Supabase (weekly snapshot collection for backtesting)
- Vercel (hosting + cron jobs)

## Development

```bash
npm install
npm run dev    # http://localhost:3001
```

## Environment Variables

```
DATAGOLF_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```
