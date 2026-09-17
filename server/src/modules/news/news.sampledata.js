// Deterministic fallback corpus used when no API key is configured or the
// live provider fails/rate-limits. Authored natively in the canonical Nuzio
// taxonomy so the rest of the app cannot tell the difference.
//
// `ageHours` is resolved relative to request time so recency scoring works.

import { toCategory } from './taxonomy.js'
import { normalizeArticle } from './news.normalizer.js'

const TEMPLATES = [
  {
    id: 'ai-chip-race',
    category: 'Technology',
    topics: ['Technology', 'AI', 'Startups'],
    source: 'The Circuit',
    title: 'The race for the next AI chip is now a three-way arms race',
    description:
      'Startup labs are raising record rounds to build specialized AI hardware, forcing the largest semiconductor firms to rethink roadmaps.',
    content:
      'Three companies are now fighting for dominance in AI infrastructure. The challengers claim their architecture makes inference several times cheaper, which would reshape cloud economics for every startup relying on large models.',
    ageHours: 2,
  },
  {
    id: 'agentic-dev',
    category: 'Technology',
    topics: ['Technology', 'AI', 'Startups'],
    source: 'Northstar Daily',
    title: 'Agentic coding tools are rewriting how small startups ship software',
    description:
      'Founders say they shipped a first product in weeks instead of months with AI agents doing the scaffolding and bug-fixing.',
    content:
      'Early adopters report a dramatic change in developer workflows. Teams are re-slicing work, reviewing generated diffs, and adding guardrails. VCs are betting the next unicorn is a two-person company.',
    ageHours: 5,
  },
  {
    id: 'fed-rates-tech',
    category: 'Finance',
    topics: ['Finance', 'Economy'],
    source: 'Meridian Post',
    title: 'Tech stocks waver as the Fed signals a slower path on rate cuts',
    description:
      'Investors are repositioning growth portfolios after the central bank pushed back on the timing of its next cut.',
    content:
      'The central bank kept policy steady but removed a key sentence investors read as a pledge to ease soon. Futures pricing implied a shallower path, hitting high-multiple tech names hardest.',
    ageHours: 4,
  },
  {
    id: 'startup-funding-q',
    category: 'Finance',
    topics: ['Finance', 'Startups', 'Venture Capital'],
    source: 'The Ledger',
    title: 'Startup funding bounces back — but only for revenue-first teams',
    description:
      'Investors are writing bigger checks, yet founders face harder diligence and clearer demands for unit economics.',
    content:
      'Deal counts are recovering quarter over quarter. The fundraising climate now rewards discipline: ARR growth and retention beat pure narrative. Seed-stage valuations remain flat while late rounds expand.',
    ageHours: 8,
  },
  {
    id: 'global-crypto-markets',
    category: 'Finance',
    topics: ['Finance', 'Markets', 'Crypto'],
    source: 'Meridian Post',
    title: 'Market makers brace for a volatile week as crypto volume hits records',
    description:
      'Banks and hedge funds are adding hedge capacity after onshore exchange volumes reached an all-time high.',
    content:
      'Record volumes are concentrating in a handful of exchanges, testing their infrastructure under stress. Regulators in three jurisdictions said they are watching, promising guidance rather than bans.',
    ageHours: 12,
  },
  {
    id: 'climate-grid-rebuild',
    category: 'Climate',
    topics: ['Climate', 'Energy'],
    source: 'Greenwire',
    title: 'The power grid is the new bottleneck for climate-friendly growth',
    description:
      'Data centers, EVs, and electrified factories are all waiting on transmission upgrades that take years to approve.',
    content:
      'Interconnection queues have doubled in two years. Utilities warn the clean-energy transition is throttled by permitting and transformer shortages, not by demand.',
    ageHours: 3,
  },
  {
    id: 'solar-payback',
    category: 'Climate',
    topics: ['Climate', 'Energy', 'Solar'],
    source: 'Greenwire',
    title: 'Solar plus storage is now the cheapest new generation for summer peaks',
    description:
      'Developers say paired solar-and-battery plants beat gas peakers on cost for the first time in most regions.',
    content:
      'The crossover flips the economics of grid planning. Utilities are rewriting resource plans, and analysts expect the shift to accelerate as battery prices fall another 20 percent.',
    ageHours: 20,
  },
  {
    id: 'housing-policy-senate',
    category: 'Politics',
    topics: ['Politics', 'Policy'],
    source: 'Capitol Wire',
    title: 'Senate weighs a zoning reform deal aimed at the housing shortage',
    description:
      'A bipartisan group is drafting a compromise that would tie infrastructure aid to local zoning changes.',
    content:
      'Negotiators say the deal would unlock federal transportation money for municipalities that legalize density. Housing advocates applaud the direction while warning the enforcement is toothless.',
    ageHours: 6,
  },
  {
    id: 'election-campaign',
    category: 'Politics',
    topics: ['Politics', 'Election'],
    source: 'Capitol Wire',
    title: 'Campaigns test new playbooks as early voting expands nationwide',
    description:
      'Both parties are pouring resources into states advancing mail voting, changing where the race is actually contested.',
    content:
      'The expansion of early voting shifts get-out-the-vote strategy. Operatives say the first two weeks of the window now decide outcomes more than election day.',
    ageHours: 15,
  },
  {
    id: 'nba-trade-deadline',
    category: 'Sports',
    topics: ['Sports', 'Basketball', 'NBA'],
    source: 'Full Court',
    title: 'NBA trade season is here — contenders are armed with picks and expiring deals',
    description:
      'Front offices are positioning for a deadline that could move two playoff-bound teams into true contention.',
    content:
      'Salary matching and draft capital dominate conversations. Scouts say a handful of young assets could be shipped for veterans, reshaping the second half of the season.',
    ageHours: 10,
  },
  {
    id: 'tennis-major',
    category: 'Sports',
    topics: ['Sports', 'Tennis'],
    source: 'Full Court',
    title: 'A breakout run at the tennis majors is changing the depth of the field',
    description:
      'Qualifiers reached the second week at consecutive slams for the first time in a decade, eroding the top seeds’ cushion.',
    content:
      'Coaches credit fitness science and improved second surfaces for narrowing the gap. Analysts expect seeded players to adjust scheduling before the next major.',
    ageHours: 30,
  },
  {
    id: 'vaccine-platform',
    category: 'Health',
    topics: ['Health', 'Vaccine', 'Clinical'],
    source: 'Medlane',
    title: 'A new mRNA platform clears an early clinical hurdle',
    description:
      'Interim data shows durable antibody responses across age groups, moving the candidate into a decisive phase.',
    content:
      'The readout is preliminary but encouraging. Regulators asked for longer follow-up, and the sponsor says manufacturing capacity is ready regardless of the outcome.',
    ageHours: 7,
  },
  {
    id: 'mental-health-work',
    category: 'Health',
    topics: ['Health', 'Mental Health'],
    source: 'Medlane',
    title: 'Employers are redesigning benefit packages around mental health',
    description:
      'Open enrollment data shows utilization of virtual therapy doubled year over year as firms cut copays.',
    content:
      'The shift is partly cost-driven: employers say early intervention lowers long-term claims. Providers warn that access still varies sharply by state.',
    ageHours: 26,
  },
  {
    id: 'nasa-return',
    category: 'Science',
    topics: ['Science', 'Space', 'NASA'],
    source: 'Orbital',
    title: 'NASA signs off on a quieter return-to-flight plan for heavy science missions',
    description:
      'The agency is trimming launch cadence to protect a hard-won slate of planetary missions.',
    content:
      'After two anomalies, the review board recommended simpler trajectories over speed. Flight directors say the revised manifest protects the decade’s most anticipated planetary windows.',
    ageHours: 9,
  },
  {
    id: 'quantum-error-correction',
    category: 'Science',
    topics: ['Science', 'Quantum'],
    source: 'Orbital',
    title: 'Quantum error correction crosses a practical milestone',
    description:
      'A lab demonstrated logical qubits that outperform their physical parts, the long-awaited precondition for useful machines.',
    content:
      'The result is the first to show real gains from redundancy. Engineers caution that scaling to thousands of logical qubits remains years away, but the direction is now clear.',
    ageHours: 18,
  },
  {
    id: 'indie-film-boxoffice',
    category: 'Culture',
    topics: ['Culture', 'Film'],
    source: 'Marquee',
    title: 'Indie films are quietly winning the summer box office',
    description:
      'Mid-budget releases outperformed blockbusters on per-screen averages, reversing a decade-long trend.',
    content:
      'Distributors credit word-of-mouth social campaigns and premium screens. The data suggests audiences are rediscovering original stories — if they are given the theaters.',
    ageHours: 22,
  },
  {
    id: 'podcast-ai-voice',
    category: 'Culture',
    topics: ['Culture', 'Podcast', 'Music'],
    source: 'Marquee',
    title: 'Podcast networks experiment with AI narration — and audiences can tell',
    description:
      'Creators are split on synthetic voices as feedback threads fill with mixed reaction to the earliest tests.',
    content:
      'Producers say synthetic narration cuts production time dramatically, but listener retention dips on long form. The industry is watching for a model that preserves intimacy.',
    ageHours: 40,
  },
  {
    id: 'euro-supercomputer',
    category: 'Technology',
    topics: ['Technology', 'AI', 'Science'],
    source: 'The Circuit',
    title: 'Europe’s new supercomputer will give open models a home',
    description:
      'A state-backed cluster will host frontier open-source models, testing whether public infrastructure can rival private clouds.',
    content:
      'The project bundles research grants with guaranteed compute hours. Proponents argue it breaks the dependency on US hyperscalers; critics question the operating cost.',
    ageHours: 14,
  },
  {
    id: 'fintech-lending',
    category: 'Finance',
    topics: ['Finance', 'Fintech'],
    source: 'The Ledger',
    title: 'Fintech lenders are automating underwriting — and regulators are watching',
    description:
      'New credit models approve loans faster using cash-flow data, raising fairness questions for the first time in scale.',
    content:
      'Lenders insist the models expand access, especially for thin-file borrowers. Consumer groups want the models audited before prime-time rollout at big banks.',
    ageHours: 28,
  },
  {
    id: 'grid-battery-boom',
    category: 'Climate',
    topics: ['Climate', 'Energy', 'Battery'],
    source: 'Greenwire',
    title: 'Grid-scale battery installations are set to double this year',
    description:
      'Developers are front-loading projects ahead of tariff windows, straining supply chains for inverters.',
    content:
      'Installers report inverter lead times pushing past a year as domestic plants come online. Analysts still expect record deployment, fueled by falling storage costs.',
    ageHours: 35,
  },
  {
    id: 'health-tracking-wearables',
    category: 'Health',
    topics: ['Health', 'Technology', 'Fitness'],
    source: 'Medlane',
    title: 'Wearables now outmatch clinic-readings for everyday heart metrics',
    description:
      'A large longitudinal survey finds consumer sensors rival clinical devices for resting heart-rate tracking.',
    content:
      'Clinicians are cautiously adopting the data for chronic care. Privacy questions remain, but hospital systems describe the readings as ‘a new vital sign.’',
    ageHours: 48,
  },
  {
    id: 'space-budget-congress',
    category: 'Politics',
    topics: ['Politics', 'Science', 'Space'],
    source: 'Capitol Wire',
    title: 'Congress fights over the science budget as space programs hang in the balance',
    description:
      'Pending appropriations would shuffle funds between planetary science and exploration missions.',
    content:
      'Lawmakers from both parties accused each other of short-changing the frontier. Agency heads warn the uncertainty is already pushing contractors to delay.',
    ageHours: 55,
  },
  {
    id: 'rbi-rates-hold',
    category: 'Finance',
    topics: ['Finance', 'Economy', 'Banking'],
    source: 'The Ledger',
    title: 'The central bank holds rates steady as inflation cools toward target',
    description:
      'Investors were split on the move; bond traders see cuts by the next meeting and banks are repricing loan books.',
    content:
      'The monetary authority kept the benchmark rate unchanged while signaling a data-dependent path. Banking analysts welcomed the stability, and equity portfolios rotated into financial stocks as the outlook for lending margins improved.',
    ageHours: 4,
  },
  {
    id: 'ipo-window-opens',
    category: 'Finance',
    topics: ['Finance', 'Markets', 'IPO'],
    source: 'Market Street Journal',
    title: 'The IPO window reopens as companies test buoyant equity markets',
    description:
      'Software-heavy candidates are tapping investment banks, betting investor appetite for growth is back.',
    content:
      'After a muted stretch, several companies filed with the exchange as valuations recovered. Underwriters say earnings visibility matters more than narrative, and trading desks expect healthy demand across the listing calendar.',
    ageHours: 10,
  },
  {
    id: 'crypto-etf-inflows',
    category: 'Finance',
    topics: ['Finance', 'Crypto', 'Investing'],
    source: 'The Ledger',
    title: 'Institutional money floods crypto funds as trading volumes normalize',
    description:
      'Spot products saw record weekly inflows, a bet that digital assets are becoming a mainstream investment.',
    content:
      'Fund managers described the inflows as gradual rather than speculative. Bitcoin holdings are rising across multi-asset portfolios, and custodians report steady demand from family offices and pension consultants.',
    ageHours: 26,
  },
]

// Deterministic generator used by the fallback corpus so identical inputs yield
// identical stories across refreshes (helper left here for future stable feeds).
function mulberry32(seed) {
  let a = seed
  return function next() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Deterministic fallback corpus used when no API key is configured or the
// live provider fails/rate-limits.
//
// Mirrors the live adapter's semantics: when categories are requested they bias
// the result — corpus items classified into a requested category lead the
// output, everything else fills the remainder. This keeps the offline demo
// differentiable per user the same way a real provider-per-category fetch is.

export function fetchSampleArticles({ pageSize = 20, categories = [] } = {}) {
  const now = Date.now()
  const requested = new Set(
    (Array.isArray(categories) ? categories : [])
      .map((category) => toCategory(category))
      .filter((category) => category !== 'General'),
  )

  const items = TEMPLATES.map((template, index) => ({
    externalId: `nuzio-sample-${template.id}`,
    title: template.title,
    description: template.description,
    content: template.content,
    imageUrl: null,
    source: template.source,
    url: `https://nuzio.app/stories/${template.id}`,
    category: template.category,
    topics: template.topics,
    language: 'en',
    publishedAt: new Date(now - template.ageHours * 3600000).toISOString(),
    _seedIndex: index,
  }))

  let ordered = items
  if (requested.size > 0) {
    const head = items.filter((item) => requested.has(normalizeArticle(item).category))
    const tail = items.filter((item) => !requested.has(normalizeArticle(item).category))
    ordered = [...head, ...tail]
  }

  const total = Number(pageSize) || items.length
  return { items: ordered.slice(0, total), meta: { corpusSize: items.length } }
}

export { mulberry32 }