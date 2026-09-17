// Profession -> topical keyword mapping for ranking.
//
// The onboarding flow offers a small closed set of professions (plus "Other"),
// and most profession labels never appear verbatim in article text ("Engineer"
// ~ "software", "Marketer" ~ "marketing"). This map expands each profession into
// the words/phrases that indicate its domain. Keywords are matched with the
// boundary-safe matcher, never by naive substring.
//
// "Student" and "Other" intentionally yield no signal: their interests should
// carry the ranking weight, and guessing a domain for them would add noise.

export const PROFESSION_KEYWORDS = {
  Engineer: [
    'engineer',
    'engineering',
    'software',
    'developer',
    'programming',
    'coding',
    'code',
    'backend',
    'frontend',
    'devops',
    'cloud',
    'infrastructure',
    'data',
    'cybersecurity',
    'ai',
  ],
  Designer: [
    'design',
    'designer',
    'user experience',
    'ui',
    'ux',
    'product design',
    'interface',
    'typography',
    'branding',
  ],
  Marketer: [
    'marketing',
    'marketer',
    'brand',
    'advertising',
    'ad campaign',
    'campaign',
    'growth',
    'seo',
    'social media',
    'content marketing',
    'performance marketing',
    'retail',
  ],
  Founder: [
    'founder',
    'startup',
    'startups',
    'venture',
    'fundraising',
    'raise',
    'funding',
    'launch',
    'entrepreneur',
    'seed round',
    'series',
    'acquisition',
  ],
  Investor: [
    'investor',
    'investing',
    'investments',
    'funding',
    'valuation',
    'market',
    'markets',
    'stock',
    'stocks',
    'ipo',
    'portfolio',
    'asset',
    'equity',
    'private equity',
    'venture capital',
  ],
  Researcher: [
    'research',
    'researcher',
    'study',
    'scientist',
    'scientific',
    'clinical',
    'laboratory',
    'lab',
    'experiment',
    'peer review',
    'academic',
    'university',
  ],
  Creator: [
    'creator',
    'content',
    'youtube',
    'podcast',
    'influencer',
    'platform',
    'streaming',
    'creator economy',
    'audience',
  ],
}

export function professionKeywords(profession) {
  return PROFESSION_KEYWORDS[String(profession || '').trim()] || []
}

export default PROFESSION_KEYWORDS