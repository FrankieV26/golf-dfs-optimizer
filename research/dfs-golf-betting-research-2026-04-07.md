# DFS & Golf Betting Research Report
**Date:** 2026-04-07

## 1. Ways to Win DFS Sports

### Fundamentals
- **Bankroll management** is the most underrated edge. Never risk >10% on a single slate. Typical split: 60-70% cash games, 30-40% GPPs.
- **Game selection matters as much as lineup construction.** Cash games (top 50% wins) reward high-floor plays. GPPs (top 1-5% wins) reward ceiling and ownership leverage.
- **The rake is 10-15%.** You must be meaningfully above average just to break even.

### Lineup Construction
- **Correlation/stacking** (pairing related players) increases ceiling for GPPs. In golf, this means wave/weather correlation groups.
- **Ownership leverage** is the biggest GPP edge: a slightly worse player at 3% ownership can have higher tournament EV than a better player at 35% ownership.
- **Projections are necessary but not sufficient.** Once projections are "good enough," the bigger edge comes from ownership modeling, correlation, and variance modeling.

### How Sharps Differentiate
- They think in **portfolios**, not individual lineups. Max exposure constraints, randomness injection, anti-leverage rules.
- They spend 80%+ of time on **projections and exposures**, not optimizer settings.
- **Monte Carlo simulation** (10K-100K+ outcomes) is the backbone of modern sharp DFS -- capturing correlation, variance, and ownership in ways simple optimizers cannot.
- **Late swap** is a real edge: weather changes, withdrawals, cut-line modeling after R2.
- **Speed of information** matters. First to react to news captures the most leverage.
- **Specialization** beats generalization. The best players go deep on one sport.

### Advanced Modeling
- **Distribution shape matters more than mean projections** for GPPs. Normal distributions underestimate golf tail risk; log-normal or empirical distributions are more accurate.
- **Ownership-adjusted projections**: Some sharps literally discount a player's value based on ownership percentage.
- **Bayesian updating** after R1/R2 for remaining-round projections.
- **Bootstrap resampling** from historical round scores preserves true empirical distributions.

---

## 2. Ways to Win Golf DFS Specifically

### What Makes Golf DFS Unique
- 150+ player field creates massive combinatorial complexity and more edge opportunities
- High variance, low player-to-player correlation (no "stacking teammates")
- Binary cut risk (miss cut = near-zero score)
- Multi-day format means weather/tee times create exploitable asymmetries
- Smaller, softer DFS player pools than NFL/NBA

### The Stats That Matter (Ranked)
| Stat | Predictiveness | Stability |
|---|---|---|
| SG: Approach | Highest overall predictor | Very stable |
| SG: Tee-to-Green (composite) | Best single predictor of sustained performance | Stable |
| SG: Off-the-Tee | High at long/open courses | Moderately stable |
| SG: Around-the-Green | Moderate | Moderate |
| SG: Putting | Massive upside when hot, but least predictable | Highly volatile week-to-week |

**Key insight:** SG: Putting is the great randomizer. You can't predict it, but when a strong ball-striker gets hot with the putter, that's a GPP winner.

### Course Fit Is Non-Negotiable
- Every course demands a different skill mix (bomber-friendly vs. accuracy, wedge-heavy vs. links-style, Bermuda vs. Bentgrass greens)
- Filter stats at the granular bucket level: proximity from 150-175 yards, par 4 scoring at 430-470 yards, scrambling from bunkers
- Course history is real but overrated in isolation -- use it to confirm course fit + current form, not as a standalone thesis
- Small sample course history (2-3 rounds) is noise

### Weather & Tee Times -- Free Alpha
- AM/PM wave splits can create 1-3 stroke scoring differences on weather-affected days
- Check forecasts for both Thursday AND Friday to identify which wave gets favorable conditions on both days
- Wind-resistant players (links/international, lower ball flight) are underpriced in windy weeks
- This is the single most underused edge by casual players

### Golf-Specific Ownership Dynamics
- Even the most popular golfer rarely exceeds 25-30% ownership
- Quality golfers at 2-5% ownership are findable almost every week
- Mid-salary tier (Tier 2) is where most lineups are won or lost
- International/lesser-known players are systematically under-owned
- "Paying up" is less necessary in golf than other sports -- mid/low salary golfers win tournaments regularly

---

## 3. Ways to Win Golf Betting

### Most Beatable Markets (Ranked)
1. **Head-to-head matchups** -- widely considered the most exploitable golf market
2. **Round matchups (3-balls)** -- high volume, less efficiently priced
3. **Top 5/10/20 finish bets** -- often derived from outright odds using simplistic math
4. **Make/miss cut props** -- "miss cut" on public favorites at poor-fit courses is consistent edge
5. **First-round leader** -- tee time/weather advantage is dominant and often underpriced
6. **Live/in-play betting** -- least efficient market, overreaction to early results

### Key Strategic Principles
- **Favorite-longshot bias is real:** Long shots (+5000+) are systematically overbet. Best value in +1000 to +4000 range.
- **Line shop religiously.** Golf odds vary more across books than almost any other sport.
- **Closing line value (CLV) is your report card.** Consistently beating the closing line = long-term profit.
- **Bet early in the week** (Sunday/Monday) when odds are least efficient, or late when breaking news creates edges.
- **Build even a simple model.** Weighted SG baseline + course fit + Monte Carlo = foundation of profitable golf betting.

### Where Books Make Mistakes
- Under-adjust for course-specific demands (course fit)
- Overreact to putting-driven results (noise, not signal)
- Narrative bias (defending champions, recent winners at different course types)
- Slow to adjust derivative markets after withdrawals
- Insufficient weather/wave adjustments for first-round markets
- Stale pricing on players returning from injury or equipment changes
- European/international players harder to price, often offer value

### Bankroll for Golf Betting
- 0.25-1% of bankroll per bet, never more than 2% on a single outright
- Fractional Kelly (1/4 to 1/2 Kelly) as compromise
- Minimum 100-bet sample to evaluate strategy
- Expect losing streaks of 20-40+ bets on outrights

---

## 4. Best Features From DFS Sites

### What's Working

| Platform | Standout Features |
|---|---|
| **DraftKings** | Deepest contest variety, most built-in research tools, DK Crowns loyalty |
| **FanDuel** | Cleanest UI, easiest onboarding, half-PPR scoring |
| **Underdog Fantasy** | Best snake draft UX, Best Ball Mania ($25M+), modern design |
| **PrizePicks** | Simplest entry flow (<30s), highest app ratings (~4.8), lowest barrier |
| **Sleeper** | Best social features by far, community-first, dark mode |

### Industry Trends
- **Simplification wins for acquisition:** PrizePicks became largest DFS platform by users with over/under model
- **Best Ball is the "third format"** -- draft thrill with zero weekly management
- **Live/in-play is the next battleground** -- micro-contests during games
- **Pick'em model** attracted casuals but faces regulatory headwinds (reclassification as sports betting)
- **Mobile-first is table stakes**
- **Social features drive retention** but big platforms underinvest
- **AI tools underutilized for casuals** -- nobody has cracked "AI that makes DFS simple"

### Features Users Most Want
- Transparent rake display
- Real-time injury/news alerts with suggested replacements
- Better lineup building tools built in (ownership projections, correlation, course fit)
- Historical contest results for learning
- "Play against players like me" skill-based matchmaking
- API access for power users
- Golf-specific: course-fit modeling, SG breakdowns, weather impact in-app

---

## 5. Biggest Complaints About DFS Sites

### Top Structural Issues

**1. The Shark/Fish Problem (#1 complaint)**
- ~1% of players win ~90% of money
- Multi-entry abuse: 150 lineups vs. 1-3 for casuals
- Platforms have weak incentive to fix (sharks = most rake)
- Single-entry contests are strongest corrective

**2. High Rake (10-15%)**
- Higher than poker (~5%), sports betting vig (~4.5%), casino (1-5%)
- Need ~55%+ win rate to break even on cash games
- Often not transparently displayed

**3. Withdrawal Friction**
- Deposit in 30 seconds, withdraw in a week
- Winning players report account restrictions without explanation

**4. Customer Support Universally Bad**
- Scripted responses, 24-72hr wait, no phone support, almost no refunds

**5. DFS Deprioritized for Sportsbook**
- FanDuel shrinking DFS for sportsbook focus
- DraftKings app = DFS + sportsbook + casino = bloated

### Platform-Specific Complaints
| Platform | Key Complaints |
|---|---|
| **DraftKings** | App bloat, sharp throttling, confusing bonuses, Sunday crashes |
| **FanDuel** | Shrinking DFS selection, sportsbook takeover, stat corrections |
| **PrizePicks** | Lines feel juiced, state availability whiplash, house-banked |
| **Underdog** | Regulatory shutdowns, limited sports, pick'em lines questioned |
| **Sleeper** | DFS bolted on, small pools, bugs |

### Golf DFS-Specific Pain Points
- Missed cut / WD scoring is #1 golf complaint -- handling varies, rules buried
- 4-day format too long for casuals
- No golf-specific tools in-app (course fit, SG, weather)
- Tee time wave advantage feels unfair and isn't communicated
- Low liquidity vs. NFL/NBA
- Late WDs after lineup lock with no replacement

### The Fairness Problem
- "Rigged" perception fueled by real structural disadvantages
- 2015 insider trading scandal permanently damaged trust
- Industry faces poker's "ecology problem" -- casuals leaving makes pool sharper, driving more casuals out

### What Users Want Fixed
1. More single-entry contests
2. Lower max entries (3-5 not 150)
3. Lower rake
4. Skill-based matchmaking
5. Transparency reports
6. Better new player protection
7. Faster withdrawals
8. Smaller contest sizes

---

## Implications for the Golf DFS Optimizer

1. **Democratizing the sharp toolset** -- Monte Carlo, course fit, ownership leverage directly addresses the #1 complaint
2. **Golf DFS is underserved** -- less platform investment, fewer tools, passionate audience
3. **Same engine powers betting** -- SG + course fit + simulation = win/top-10/top-20 probabilities to compare against sportsbook odds
4. **Weather/wave integration is free alpha** most tools don't surface well
5. **Simplicity is the industry trend** -- making optimizer output feel simple and actionable taps the casual growth market
