// Canonical Nuzio news taxonomy.
//
// This is the single source of truth for categories and topic keywords used by
// ranking, classification, and the sample corpus. External providers (e.g.
// NewsAPI) map INTO and OUT OF this taxonomy inside their own adapter files;
// their dialect never leaks into the rest of the application.

export const CATEGORIES = [
  'Technology',
  'Finance',
  'Politics',
  'Sports',
  'Health',
  'Science',
  'Culture',
  'Climate',
  'General',
]

export const DEFAULT_CATEGORY = 'General'

const TAXONOMY = {
  Technology: [
    'technology', 'ai', 'artificial intelligence', 'machine learning', 'startup',
    'startups', 'software', 'developer', 'coding', 'cybersecurity', 'chip',
    'semiconductor', 'cloud', 'internet', 'digital', 'app', 'robotics', 'quantum computing',
  ],
  Finance: [
    'finance', 'financial', 'market', 'markets', 'stock', 'stocks', 'investment',
    'investing', 'bank', 'banking', 'economy', 'crypto', 'bitcoin', 'trading',
    'fund', 'venture capital', 'fintech', 'fed', 'inflation', 'gdp', 'earnings', 'ipo',
  ],
  Politics: [
    'politics', 'election', 'elections', 'government', 'senate', 'congress',
    'parliament', 'policy', 'law', 'regulation', 'diplomacy', 'geopolitics',
    'president', 'vote', 'cabinet', 'treaty', 'summit',
  ],
  Sports: [
    'sports', 'sport', 'football', 'soccer', 'basketball', 'nba', 'nfl', 'tennis',
    'olympics', 'mlb', 'cricket', 'formula 1', 'f1', 'player', 'match',
    'championship', 'coach', 'league', 'tournament',
  ],
  Health: [
    'health', 'medical', 'medicine', 'hospital', 'cancer', 'vaccine', 'wellness',
    'mental health', 'fitness', 'pandemic', 'drug', 'clinical', 'healthcare', 'diet',
  ],
  Science: [
    'science', 'research', 'space', 'nasa', 'physics', 'biology', 'genetics',
    'astronomy', 'quantum', 'discovery', 'university', 'study', 'lab', 'mission',
  ],
  Culture: [
    'culture', 'film', 'movie', 'movies', 'music', 'art', 'books', 'fashion',
    'food', 'travel', 'entertainment', 'hollywood', 'podcast', 'gaming', 'theater', 'festival',
  ],
  Climate: [
    'climate', 'climate change', 'environment', 'carbon', 'energy', 'renewable',
    'solar', 'wind', 'emissions', 'sustainability', 'weather', 'wildfire', 'drought',
  ],
}

// Every keyword across the taxonomy (lowercased), for coarse searches.
export const ALL_KEYWORDS = Object.values(TAXONOMY).flat()

// Map a free-form label to a canonical category when the label is not already
// one of our taxonomy categories (used by provider adapters).
const LABEL_ALIASES = {
  technology: 'Technology',
  business: 'Finance',
  entertainment: 'Culture',
  general: 'General',
  health: 'Health',
  science: 'Science',
  sports: 'Sports',
  climate: 'Climate',
  environment: 'Climate',
  finance: 'Finance',
  markets: 'Finance',
  // NewsData.io category vocabulary.
  politics: 'Politics',
  crime: 'Politics',
  domestic: 'General',
  education: 'General',
  food: 'Culture',
  lifestyle: 'Culture',
  tourism: 'Culture',
  world: 'General',
  top: 'General',
  other: 'General',
}

export function toCategory(label = '') {
  // Providers may report a category as an array; pick the first entry that maps
  // to something more specific than General.
  if (Array.isArray(label)) {
    for (const entry of label) {
      const mapped = toCategory(entry)
      if (mapped !== DEFAULT_CATEGORY) return mapped
    }
    return DEFAULT_CATEGORY
  }
  const value = String(label).trim().toLowerCase()
  if (CATEGORIES.some((c) => c.toLowerCase() === value)) {
    return CATEGORIES.find((c) => c.toLowerCase() === value)
  }
  return LABEL_ALIASES[value] || DEFAULT_CATEGORY
}

// Match a keyword as a whole word/phrase so short tokens ('ai', 'app', 'f1')
// don't false-positive inside longer words ('Israel', 'available', 'apple').
function keywordInText(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
}

// Classify free text into a canonical category using keyword density.
export function classifyCategory(text = '') {
  const lower = String(text).toLowerCase()
  let best = DEFAULT_CATEGORY
  let bestCount = 0
  for (const [category, keywords] of Object.entries(TAXONOMY)) {
    let hits = 0
    for (const keyword of keywords) {
      if (keywordInText(lower, keyword)) hits += 1
    }
    if (hits > bestCount) {
      best = category
      bestCount = hits
    }
  }
  return best
}

// Extract canonical-form topics found in a body of text.
export function extractTopics(text = '') {
  const lower = String(text).toLowerCase()
  const found = new Set()
  for (const keywords of Object.values(TAXONOMY)) {
    for (const keyword of keywords) {
      if (keywordInText(lower, keyword)) {
        found.add(keyword.split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '))
      }
    }
  }
  return [...found].slice(0, 6)
}

export default TAXONOMY