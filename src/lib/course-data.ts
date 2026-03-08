// ──────────────────────────────────────────────
// Course/Tournament Data for SEO Pages
// ──────────────────────────────────────────────
// Additional metadata for each course beyond what
// COURSE_PROFILES provides (weights, grass, par/yards).
// ──────────────────────────────────────────────

export interface CourseData {
  slug: string;
  courseName: string;
  tournamentName: string;
  location: string;
  par: number;
  yardage: number;
  description: string;
  keyHoles: { hole: number; par: number; yards: number; description: string }[];
  historicalWinners: { year: number; winner: string; score: string }[];
  dfsTips: string[];
  keyStats: string[];
  topGolferFits: string[]; // golfer slugs
}

export const COURSE_DATA: Record<string, CourseData> = {
  'tpc-sawgrass': {
    slug: 'tpc-sawgrass',
    courseName: 'TPC Sawgrass (Stadium Course)',
    tournamentName: 'THE PLAYERS Championship',
    location: 'Ponte Vedra Beach, Florida',
    par: 72,
    yardage: 7245,
    description:
      'TPC Sawgrass is the home of THE PLAYERS Championship, often referred to as the "fifth major" due to the strength of its field and prestige within professional golf. The Stadium Course, designed by Pete Dye, is one of the most famous and demanding layouts on the PGA Tour schedule. The course is known for its strategic design that rewards precise iron play over raw power — fairways are generous enough for most tee shots, but the real test comes with approach shots into well-guarded greens surrounded by water and Pete Dye\'s trademark railroad-tie bulkheads. The bermuda grass surfaces putt true and reward golfers who can control distance and trajectory with their irons. TPC Sawgrass annually produces one of the most exciting weeks on the PGA Tour, with its risk-reward holes and the iconic island-green par-3 17th creating drama that few courses can match. For DFS purposes, this is a course where approach play is king — the golfers who hit greens in regulation and avoid the water will rise to the top of the leaderboard.',
    keyHoles: [
      { hole: 12, par: 4, yards: 358, description: 'A short, drivable par-4 that offers eagle opportunities but punishes misses with water left. A true risk-reward hole that separates the bold from the cautious.' },
      { hole: 16, par: 5, yards: 532, description: 'A reachable par-5 where aggressive players can set up eagle chances. Water guards the front of the green, demanding precise distance control on approach shots.' },
      { hole: 17, par: 3, yards: 137, description: 'The iconic island green. Perhaps the most famous par-3 in golf. A wedge shot with major championship pressure — a ball in the water means bogey or worse, and the wind off the lake makes club selection critical.' },
      { hole: 18, par: 4, yards: 462, description: 'A demanding finishing hole with water running the entire left side. The tee shot must find the fairway to have any chance at hitting the green in regulation on this curvaceous closer.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Scottie Scheffler', score: '-20 (268)' },
      { year: 2023, winner: 'Scottie Scheffler', score: '-17 (271)' },
      { year: 2022, winner: 'Cameron Smith', score: '-13 (275)' },
      { year: 2021, winner: 'Justin Thomas', score: '-14 (274)' },
      { year: 2020, winner: 'Cancelled (COVID-19)', score: 'N/A' },
    ],
    dfsTips: [
      'Approach play is the most important stat at TPC Sawgrass. Target golfers who rank in the top 20 in SG: Approach for the season.',
      'The island-green 17th creates massive scoring variance. Golfers with strong nerves and precise wedge play gain an edge here.',
      'Bermuda grass greens reward golfers who are comfortable on Southern surfaces. Check putting splits by grass type.',
      'Chalk ownership tends to be concentrated on elite ball-strikers. Find value by targeting mid-tier golfers with strong approach numbers and lower ownership.',
    ],
    keyStats: [
      'SG: Approach is the single most predictive stat, with a 0.40 weight in the course-fit model.',
      'Driving distance matters less here (0.15 weight) — accuracy and iron play trump raw power.',
      'Around-the-green performance (0.20 weight) is important due to the penal greenside areas and Pete Dye bunkers.',
      'The cut line at THE PLAYERS is typically the tightest on tour due to field strength — cut probability is crucial.',
    ],
    topGolferFits: ['scottie-scheffler', 'collin-morikawa', 'xander-schauffele', 'hideki-matsuyama', 'patrick-cantlay'],
  },
  'augusta-national': {
    slug: 'augusta-national',
    courseName: 'Augusta National Golf Club',
    tournamentName: 'The Masters Tournament',
    location: 'Augusta, Georgia',
    par: 72,
    yardage: 7510,
    description:
      'Augusta National is the most iconic course in golf and the permanent home of the Masters Tournament, the first major championship of each year. The course, designed by Alister MacKenzie and Bobby Jones, has been lengthened significantly over the decades but retains its original strategic brilliance. Augusta demands a unique combination of skills: elite driving distance to take advantage of the wide fairways and access optimal approach angles, precise approach play to navigate the severely undulating greens, and the course knowledge to understand where to miss and where to attack. The bentgrass surfaces are lightning-fast, with slopes and ridges that can send a slightly offline approach 30 feet from the pin. Augusta\'s par-5s are reachable for long hitters and represent crucial birdie opportunities, while the back nine on Sunday at the Masters is widely considered the most exciting stretch in all of golf. The course rewards creativity, shot-shaping ability, and mental fortitude under the most intense pressure in the sport.',
    keyHoles: [
      { hole: 11, par: 4, yards: 520, description: 'The beginning of "Amen Corner." A brutal par-4 with water guarding the left side of the green. The approach shot is one of the most demanding in championship golf.' },
      { hole: 12, par: 3, yards: 155, description: 'The shortest hole at Augusta but arguably the most dangerous. Swirling winds in the valley make club selection a guessing game, and the shallow green with Rae\'s Creek in front has ruined many Masters bids.' },
      { hole: 13, par: 5, yards: 510, description: 'A reachable par-5 that doglegs left through the trees. Long hitters can reach in two, but Rae\'s Creek fronts the green, creating a classic risk-reward decision that defines Masters Sunday.' },
      { hole: 15, par: 5, yards: 550, description: 'Another pivotal par-5 with water in front of the green. The second shot must carry the pond, making it a defining moment for players chasing the lead on the back nine.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Scottie Scheffler', score: '-11 (277)' },
      { year: 2023, winner: 'Jon Rahm', score: '-12 (276)' },
      { year: 2022, winner: 'Scottie Scheffler', score: '-10 (278)' },
      { year: 2021, winner: 'Hideki Matsuyama', score: '-10 (278)' },
      { year: 2020, winner: 'Dustin Johnson', score: '-20 (268)' },
    ],
    dfsTips: [
      'Driving distance is significantly more important at Augusta than at most PGA Tour venues. Long hitters can reach the par-5s in two and gain massive scoring advantages.',
      'Course experience is a huge factor at the Masters. Prioritize golfers with multiple prior appearances who understand the green complexes.',
      'The bentgrass greens at Augusta are among the fastest in golf. Target golfers who putt well on bentgrass specifically.',
      'Fade first-time Masters participants in cash games — the learning curve at Augusta is real and usually costs a few strokes.',
    ],
    keyStats: [
      'SG: Off the Tee carries a 0.25 weight, the highest among our course profiles for any non-bomber course.',
      'SG: Approach (0.35 weight) is critical for navigating the severe green complexes and avoiding three-putts.',
      'Par-5 scoring is the primary differentiator at Augusta — target golfers with strong par-5 birdie rates.',
      'Putting on bentgrass at high speeds is a specialized skill that separates contenders from the field.',
    ],
    topGolferFits: ['scottie-scheffler', 'ludvig-aberg', 'jon-rahm', 'rory-mcilroy', 'hideki-matsuyama'],
  },
  'pebble-beach': {
    slug: 'pebble-beach',
    courseName: 'Pebble Beach Golf Links',
    tournamentName: 'AT&T Pebble Beach Pro-Am',
    location: 'Pebble Beach, California',
    par: 72,
    yardage: 6828,
    description:
      'Pebble Beach Golf Links is one of the most beautiful and revered courses in golf, perched along the rugged coastline of the Monterey Peninsula. The course is relatively short by modern PGA Tour standards at just 6,828 yards, but it plays much longer than its yardage suggests due to coastal winds, small greens, and demanding approach shots to targets perched on cliffs above the Pacific Ocean. Pebble Beach rewards precision over power — the fairways are narrow, the greens are small, and the margin for error is razor-thin. The poa annua putting surfaces are notoriously tricky, with bumpy afternoon conditions that challenge even the best putters. The course is perhaps most famous for its stunning back-nine stretch along the ocean, where holes 8 through 10 offer some of the most spectacular views in all of sports. For DFS, this is a precision course where approach play dominates and driving distance is almost irrelevant.',
    keyHoles: [
      { hole: 7, par: 3, yards: 106, description: 'The shortest hole on the PGA Tour, but one of the most iconic. Perched on a cliff with the Pacific Ocean as a backdrop, wind makes club selection incredibly difficult on this downhill gem.' },
      { hole: 8, par: 4, yards: 428, description: 'One of the most visually stunning holes in golf. The approach shot plays along the cliff edge, with the ocean crashing below. Precision is paramount — there is no room for error.' },
      { hole: 14, par: 5, yards: 580, description: 'A long par-5 that doglegs right along the ocean. The risk-reward second shot must navigate the cliff edge, and the green complex demands precise distance control.' },
      { hole: 18, par: 5, yards: 543, description: 'The iconic finishing hole that curves along Carmel Bay. The ocean runs the entire left side, and the approach to the green must carry water. A dramatic closer to one of golf\'s most special venues.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Wyndham Clark', score: '-18 (270)' },
      { year: 2023, winner: 'Justin Rose', score: '-18 (270)' },
      { year: 2022, winner: 'Tom Hoge', score: '-19 (269)' },
      { year: 2021, winner: 'Daniel Berger', score: '-18 (270)' },
      { year: 2020, winner: 'Nick Taylor', score: '-19 (269)' },
    ],
    dfsTips: [
      'Driving distance is virtually irrelevant at Pebble Beach. Focus entirely on approach play, short game, and putting.',
      'Poa annua putting experience is a genuine edge. Target golfers who play well on West Coast courses with poa greens.',
      'The pro-am format means the first three rounds include amateurs, creating slower pace of play that can affect some golfers\' routines.',
      'Wind is a constant factor. Look for golfers who have demonstrated ability to control ball flight in exposed, coastal conditions.',
    ],
    keyStats: [
      'SG: Approach has the highest weight (0.45) of any course in our model. This is a precision approach-play course above all else.',
      'SG: Off the Tee is virtually irrelevant (0.10 weight) — the course is short and accuracy trumps distance.',
      'Poa annua putting surfaces reward experience. Golfers who play the West Coast swing regularly have an inherent advantage.',
      'Scrambling and around-the-green play (0.20 weight) matters due to the small, exposed greens that are easy to miss.',
    ],
    topGolferFits: ['collin-morikawa', 'wyndham-clark', 'matt-fitzpatrick', 'patrick-cantlay', 'brian-harman'],
  },
  'torrey-pines-south': {
    slug: 'torrey-pines-south',
    courseName: 'Torrey Pines (South Course)',
    tournamentName: 'Farmers Insurance Open',
    location: 'La Jolla, California',
    par: 72,
    yardage: 7698,
    description:
      'Torrey Pines South Course is one of the longest and most demanding courses on the PGA Tour schedule, stretching to nearly 7,700 yards along the Pacific coastline north of San Diego. The course was designed to challenge the best players in the world and has hosted the U.S. Open twice, most recently in 2021 when Jon Rahm captured his first major championship. Torrey Pines South rewards length off the tee more than almost any other venue on tour — the long par-4s and demanding par-5s give bombers a significant advantage in reaching greens in regulation from the fairway while shorter hitters are left with long-iron approaches from the rough. The poa annua greens are large and undulating, requiring both precision and touch with the putter. The coastal fog and marine layer that frequently blankets the course can create difficult scoring conditions, especially during morning rounds. For DFS, this is a power course where driving distance and approach play are the dominant success factors.',
    keyHoles: [
      { hole: 3, par: 3, yards: 200, description: 'A long, demanding par-3 with a green perched above the ocean cliffs. The wind swirls unpredictably, and the bunkers are deep. One of the toughest par-3s on the PGA Tour schedule.' },
      { hole: 6, par: 4, yards: 515, description: 'A brute of a par-4 that plays over 500 yards. Only the longest hitters can reach this green in regulation, making it a genuine two-shot par-4 for most of the field.' },
      { hole: 12, par: 4, yards: 504, description: 'Another 500-yard par-4 that demands elite driving distance. The uphill approach to an elevated green makes this hole play even longer than its listed yardage.' },
      { hole: 18, par: 5, yards: 570, description: 'A par-5 finishing hole that offers birdie opportunities for aggressive players. The green is protected by water left and bunkers right, creating a dramatic final-hole test.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Matthieu Pavon', score: '-11 (277)' },
      { year: 2023, winner: 'Max Homa', score: '-11 (277)' },
      { year: 2022, winner: 'Luke List', score: '-15 (273)' },
      { year: 2021, winner: 'Patrick Reed', score: '-14 (274)' },
      { year: 2020, winner: 'Marc Leishman', score: '-15 (273)' },
    ],
    dfsTips: [
      'Driving distance is the single most important stat at Torrey Pines South. Target golfers who average 300+ yards off the tee.',
      'The course is so long that shorter hitters are effectively playing a different course. Avoid low-distance golfers regardless of price.',
      'The Farmers Insurance Open uses both the North and South courses for the first two rounds. Track which golfers get the South course in Round 1 vs Round 2.',
      'Marine layer and fog can create a split-wave advantage. Check the weather forecast and consider stacking golfers from the favorable tee-time wave.',
    ],
    keyStats: [
      'SG: Off the Tee carries a 0.30 weight, the highest of any course in our model. Length is essential here.',
      'SG: Approach (0.35 weight) is also critical due to the long-iron approaches that shorter hitters face.',
      'Putting on poa annua (0.20 weight) is a factor, though less important than the tee-to-green game.',
      'Scoring conditions vary dramatically based on weather. Monitor marine layer forecasts for wave-advantage plays.',
    ],
    topGolferFits: ['rory-mcilroy', 'ludvig-aberg', 'cameron-young', 'tony-finau', 'jon-rahm'],
  },
  'bay-hill': {
    slug: 'bay-hill',
    courseName: 'Bay Hill Club & Lodge',
    tournamentName: 'Arnold Palmer Invitational',
    location: 'Orlando, Florida',
    par: 72,
    yardage: 7466,
    description:
      'Bay Hill Club & Lodge is the legacy of Arnold Palmer, who purchased the property in 1974 and transformed it into one of the PGA Tour\'s most popular and prestigious venues. The Arnold Palmer Invitational, held annually in March, honors Palmer\'s memory and attracts one of the strongest fields outside of the major championships. The course itself is a well-balanced test of golf that rewards all facets of the game — solid driving, precise approaches, reliable short game, and consistent putting on bermuda greens. Bay Hill is notable for its water hazards, which come into play on several critical holes, and its treacherous back nine that has decided many tournaments. The course underwent a significant renovation in 2023 that modernized several holes while preserving Palmer\'s original design philosophy. For DFS, Bay Hill is a balanced course where approach play and putting share the spotlight, and there are no extreme skill-set advantages.',
    keyHoles: [
      { hole: 6, par: 5, yards: 555, description: 'A reachable par-5 with water guarding the green. Aggressive players who can carry the water on their second shot have eagle opportunities, but the penalty for missing is severe.' },
      { hole: 11, par: 4, yards: 415, description: 'A demanding par-4 with water running the entire right side from tee to green. The approach must carry the water to a well-bunkered green.' },
      { hole: 16, par: 4, yards: 507, description: 'A long par-4 that often plays as the hardest hole on the course. Water left, bunkers right, and a narrow fairway make this a true test of tee-to-green excellence.' },
      { hole: 18, par: 4, yards: 458, description: 'The iconic finishing hole with water guarding the right side all the way to the green. This is where Arnold Palmer Invitational titles are won and lost.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Scottie Scheffler', score: '-15 (273)' },
      { year: 2023, winner: 'Kurt Kitayama', score: '-12 (276)' },
      { year: 2022, winner: 'Scottie Scheffler', score: '-11 (277)' },
      { year: 2021, winner: 'Bryson DeChambeau', score: '-11 (277)' },
      { year: 2020, winner: 'Tyrrell Hatton', score: '-4 (284)' },
    ],
    dfsTips: [
      'Bay Hill is a balanced course — look for golfers who are solid across all strokes gained categories rather than specialists.',
      'The bermuda grass greens reward golfers comfortable on Southern surfaces. Check bermuda putting splits for edge.',
      'Water hazards create risk-reward situations throughout the back nine. Aggressive players with strong iron play thrive here.',
      'The Arnold Palmer Invitational typically has a strong field, making cut probability particularly important for DFS purposes.',
    ],
    keyStats: [
      'The course-fit model gives balanced weights: OTT (0.20), Approach (0.35), ATG (0.20), Putting (0.25).',
      'SG: Approach (0.35 weight) is the most important single category, consistent with most PGA Tour venues.',
      'Bermuda greens (0.25 putting weight) reward golfers who are comfortable on grainy Southern putting surfaces.',
      'No single stat dominates — this is a test of complete golf that rewards well-rounded performers.',
    ],
    topGolferFits: ['scottie-scheffler', 'xander-schauffele', 'tommy-fleetwood', 'sahith-theegala', 'sam-burns'],
  },
  'tpc-scottsdale': {
    slug: 'tpc-scottsdale',
    courseName: 'TPC Scottsdale (Stadium Course)',
    tournamentName: 'WM Phoenix Open',
    location: 'Scottsdale, Arizona',
    par: 71,
    yardage: 7261,
    description:
      'TPC Scottsdale\'s Stadium Course is the raucous home of the WM Phoenix Open, the most-attended event in golf with crowds regularly exceeding 700,000 for the week. The course itself plays somewhat shorter than its yardage due to the desert altitude and hard, fast playing conditions typical of the Arizona climate. TPC Scottsdale is notably a putting course — the greens are large, smooth, and receptive, rewarding golfers who can convert birdie opportunities. The par-71 layout includes several birdie-friendly holes where scoring is expected, making hot putting streaks more valuable than at tougher, more penalizing venues. The iconic stadium-seating par-3 16th hole is the most famous party hole in golf, where 20,000 fans create a football-like atmosphere. For DFS purposes, putting is the most important stat at TPC Scottsdale, making it a prime week for targeting golfers who are in great putting form.',
    keyHoles: [
      { hole: 7, par: 3, yards: 215, description: 'A long par-3 with a large green that rewards precise iron play. Birdie opportunities exist for golfers who find the right portion of the putting surface.' },
      { hole: 13, par: 5, yards: 577, description: 'A reachable par-5 that provides eagle opportunities for long hitters. The green is well-guarded by bunkers, but aggressive play is rewarded.' },
      { hole: 15, par: 5, yards: 553, description: 'Another reachable par-5 that sets up the dramatic finish. Birdie is the expectation for elite players, and eagles are possible.' },
      { hole: 16, par: 3, yards: 163, description: 'The most famous hole in tournament golf — the stadium par-3 where 20,000 fans create an electric atmosphere. A hole-in-one here produces the loudest roar in golf.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Nick Taylor', score: '-20 (264)' },
      { year: 2023, winner: 'Scottie Scheffler', score: '-19 (265)' },
      { year: 2022, winner: 'Scottie Scheffler', score: '-16 (268)' },
      { year: 2021, winner: 'Brooks Koepka', score: '-19 (265)' },
      { year: 2020, winner: 'Webb Simpson', score: '-17 (267)' },
    ],
    dfsTips: [
      'Putting is the most important stat at TPC Scottsdale. Target golfers who are in strong recent putting form and rank well in SG: Putting.',
      'This is a birdie-fest — scoring is low, and golfers need to go deep into the teens-under-par to contend. Target aggressive, birdie-prone players.',
      'DraftKings birdie streak bonuses are especially valuable here. Look for golfers who tend to bunch their birdies.',
      'The desert heat and altitude create fast, firm conditions. Golfers who are accustomed to desert golf have an experience advantage.',
    ],
    keyStats: [
      'SG: Putting carries the highest weight (0.30) of any course in our model. This is a putting course above all else.',
      'Approach play (0.35 weight) still matters — hitting greens in regulation creates the birdie opportunities that putting converts.',
      'Driving distance (0.15 weight) is less critical than putting, but the par-5s are reachable for long hitters.',
      'Scoring average is among the lowest on tour — expect the winning score to be -15 to -22 depending on conditions.',
    ],
    topGolferFits: ['patrick-cantlay', 'wyndham-clark', 'sahith-theegala', 'tom-kim', 'sungjae-im'],
  },
  'valhalla': {
    slug: 'valhalla',
    courseName: 'Valhalla Golf Club',
    tournamentName: 'PGA Championship',
    location: 'Louisville, Kentucky',
    par: 72,
    yardage: 7530,
    description:
      'Valhalla Golf Club is a Jack Nicklaus-designed championship venue that has hosted multiple PGA Championships and the 2008 Ryder Cup. The course is one of the longest on the PGA Tour rotation at 7,530 yards, with wide fairways that allow bombers to unleash their full power off the tee. Valhalla rewards driving distance more than most courses — the long par-4s require significant carry, and the reachable par-5s offer eagle opportunities for golfers who can reach them in two. The bentgrass greens are typically set firm and fast for the PGA Championship, creating challenging putting conditions that reward golfers who can control their approach shots\' spin and trajectory. Valhalla\'s wide fairways and lack of extreme strategic complexity make it a course where raw talent and power tend to prevail over course management and subtlety. For DFS, this is a bomber\'s paradise where driving distance and approach play are the dominant success factors.',
    keyHoles: [
      { hole: 7, par: 5, yards: 597, description: 'A long par-5 that is reachable for elite players. The green is well-protected by bunkers and a creek, creating a dramatic risk-reward second shot decision.' },
      { hole: 10, par: 4, yards: 494, description: 'A demanding par-4 that requires both length and accuracy off the tee. The approach into this green is one of the toughest on the course.' },
      { hole: 13, par: 4, yards: 350, description: 'A short, drivable par-4 that provides eagle and birdie opportunities for aggressive players willing to challenge the green off the tee.' },
      { hole: 18, par: 5, yards: 542, description: 'A reachable par-5 finishing hole that has produced memorable PGA Championship moments. Eagles are possible, making this a potential swing hole for tournament outcomes.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Xander Schauffele', score: '-21 (263)' },
      { year: 2014, winner: 'Rory McIlroy', score: '-16 (268)' },
      { year: 2011, winner: 'Keegan Bradley', score: '-8 (272)' },
      { year: 2000, winner: 'Tiger Woods', score: '-18 (270)' },
      { year: 1996, winner: 'Mark Brooks', score: '-3 (277)' },
    ],
    dfsTips: [
      'Driving distance is critical at Valhalla. Target golfers who average 305+ yards off the tee to maximize scoring opportunities.',
      'The reachable par-5s are the primary scoring opportunities. Look for golfers with strong par-5 eagle and birdie rates.',
      'Bentgrass greens at major championship speed demand elite putting. Factor in both driving and putting for complete DFS profiles.',
      'Valhalla\'s relatively low course-management demands mean the most talented golfers tend to separate. Lean toward the elite tier.',
    ],
    keyStats: [
      'SG: Off the Tee carries a 0.25 weight, reflecting the importance of driving distance at this long course.',
      'SG: Approach (0.35 weight) is critical for converting driving distance into birdie and eagle opportunities.',
      'Bentgrass putting (0.25 weight) at major championship speed is a differentiator among the contenders.',
      'The wide fairways reduce the importance of driving accuracy — pure distance is rewarded here.',
    ],
    topGolferFits: ['rory-mcilroy', 'ludvig-aberg', 'cameron-young', 'jon-rahm', 'tony-finau'],
  },
  'pinehurst-no2': {
    slug: 'pinehurst-no2',
    courseName: 'Pinehurst No. 2',
    tournamentName: 'U.S. Open',
    location: 'Pinehurst, North Carolina',
    par: 70,
    yardage: 7588,
    description:
      'Pinehurst No. 2 is a Donald Ross masterpiece and one of the most unique courses in American golf. The course is best known for its turtle-back greens — convex putting surfaces that repel approach shots not struck with precision, sending them into sandy waste areas and difficult collection zones. This distinctive green design makes Pinehurst No. 2 the ultimate test of around-the-green play. Golfers who cannot chip and pitch with precision from tight lies on wiregrass and hardpan will hemorrhage strokes to the field. The course plays firm and fast on its natural sand base, with bermuda grass surfaces that create challenging conditions. The 2024 U.S. Open at Pinehurst showcased how the course\'s unique design can identify the most complete golfers while brutally punishing those with short-game weaknesses. For DFS purposes, Pinehurst No. 2 is the one course on the schedule where around-the-green play is the single most important stat, creating a completely different DFS landscape than any other week.',
    keyHoles: [
      { hole: 4, par: 4, yards: 530, description: 'A long par-4 with a severely crowned green that is almost impossible to hold from long range. The approach must be precise, or the ball rolls off into the collection areas.' },
      { hole: 5, par: 4, yards: 482, description: 'Another demanding par-4 with one of the most difficult green complexes on the course. The turtle-back design punishes anything but a perfect approach.' },
      { hole: 9, par: 3, yards: 194, description: 'A long par-3 with a green that slopes away in all directions. Hitting this green in regulation is a significant achievement.' },
      { hole: 18, par: 4, yards: 448, description: 'The finishing hole with a crowned green that has decided multiple U.S. Open championships. The approach must be laser-accurate to avoid a difficult up-and-down for par.' },
    ],
    historicalWinners: [
      { year: 2024, winner: 'Bryson DeChambeau', score: '-6 (274)' },
      { year: 2014, winner: 'Martin Kaymer', score: '-9 (271)' },
      { year: 2005, winner: 'Michael Campbell', score: 'Even (280)' },
      { year: 1999, winner: 'Payne Stewart', score: '-1 (279)' },
      { year: 2029, winner: 'U.S. Open (scheduled)', score: 'TBD' },
    ],
    dfsTips: [
      'Around-the-green play is the most important stat at Pinehurst No. 2. Target golfers who rank in the top 20 in SG: Around the Green.',
      'The turtle-back greens make scrambling crucial. Golfers with elite chipping and pitching from tight lies gain an enormous edge.',
      'Short game specialists like Brian Harman, Shane Lowry, and Cameron Smith are ideal fits for this course.',
      'Avoid golfers with short-game weaknesses, even if their ball-striking is elite. Viktor Hovland and Will Zalatoris are classic fades at Pinehurst.',
    ],
    keyStats: [
      'SG: Around the Green carries the highest weight (0.30) of any course in our model, equal to SG: Approach.',
      'The turtle-back green design creates enormous separation between elite scramblers and poor short-game players.',
      'Approach play (0.30 weight) still matters, but the ability to recover from missed greens is the true differentiator.',
      'U.S. Open conditions amplify the course\'s difficulty. Expect high scores and a winning total near even par.',
    ],
    topGolferFits: ['shane-lowry', 'brian-harman', 'cameron-smith', 'matt-fitzpatrick', 'max-homa'],
  },
};

/** Get all course data as an array */
export function getAllCourses(): CourseData[] {
  return Object.values(COURSE_DATA);
}

/** Get a single course by slug */
export function getCourseBySlug(slug: string): CourseData | undefined {
  return COURSE_DATA[slug];
}
