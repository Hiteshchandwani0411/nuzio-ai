// Adversarial checks for the personalization matching layer.
// Run:  node scripts/check-matching.mjs
import assert from 'node:assert/strict'
import {
  normalizeTerm,
  termMatches,
  matchTerms,
} from '../src/modules/personalization/matching.js'
import { professionHits, scoreArticle } from '../src/modules/personalization/scoring.js'

const article = (title, description, topics, category) => ({
  title,
  description,
  topics,
  category,
  publishedAt: new Date().toISOString(),
})

// Word boundaries: embedded substrings must NOT match.
assert.equal(termMatches('said available trainer revision', 'ai'), false, 'AI in "said"')
assert.equal(termMatches('the agriculture sector grew', 'culture'), false, 'culture in agriculture')
assert.equal(termMatches('my conscience is clear', 'science'), false, 'science in conscience')
assert.equal(termMatches('a promising startup raised', 'art'), false, 'art in startup')
assert.equal(termMatches('financing markets rally', 'finance'), false, 'finance in refinancing')
assert.equal(termMatches('conscience', 'conscience'), true, 'conscience standalone matches')

// Whole-word / whole-phrase matches.
assert.equal(termMatches('an ai company released a model', 'ai'), true, 'ai as word')
assert.equal(termMatches('growth marketing campaigns', 'marketing'), true, 'marketing word')
assert.equal(termMatches('the fed cut rates today', 'fed'), true, 'fed as word')
assert.equal(termMatches('venture capital is booming', 'venture capital'), true, 'phrase match')

// NormalizeTerm: plural handling.
assert.equal(normalizeTerm('startups'), 'startup')
assert.equal(normalizeTerm('markets'), 'market')
assert.equal(normalizeTerm('ai'), 'ai')
assert.equal(normalizeTerm('us'), 'us')
assert.equal(normalizeTerm('ss'), 'ss')

// matchTerms: dedupe + order preserved.
assert.deepEqual(matchTerms('ai and crypto markets', ['AI', 'ai', 'Markets']), ['AI', 'Markets'])

// Interest hits through the full scorer use boundary-safe matching.
const techArticle = article(
  'Startup labs race on AI chips',
  'Semiconductor startups are raising venture capital for inference hardware.',
  ['Startups', 'AI'],
  'Technology',
)
const financeArticle = article(
  'Crypto markets rally',
  'Bitcoin trading volumes hit records as markets digest the Fed.',
  ['Markets'],
  'Finance',
)
const agricultureArticle = article(
  'Monsoon outlook improves for farmers',
  'Agriculture output expected to rise this season.',
  [],
  'General',
)

const techScore = scoreArticle(techArticle, { profession: 'Engineer', interests: ['AI', 'Startups'] })
const financeScore = scoreArticle(financeArticle, { profession: 'Investor', interests: ['Markets'] })
const agriScore = scoreArticle(agricultureArticle, { profession: 'Investor', interests: ['Markets'] })

assert.ok(techScore.matched.includes('AI'), 'AI matched for tech user')
assert.ok(financeScore.matched.includes('Markets'), 'Markets matched for finance user')
assert.deepEqual(agriScore.matched, [], 'Agri story must NOT match Markets/Investor')

// Profession maps: Engineer ~ software/cloud (not the literal word everywhere).
const engineerArticle = article(
  'Cloud infrastructure trends',
  'Software developers rethink deployments on the cloud.',
  ['Technology'],
  'Technology',
)
assert.equal(professionHits(engineerArticle, 'Engineer').length > 0, true, 'Engineer boosts software story')

// The literal profession label can also match directly.
const founderArticle = article(
  'Founder diaries',
  'A founder reflects on fundraising lessons.',
  ['Startups'],
  'Finance',
)
assert.equal(professionHits(founderArticle, 'Founder').length > 0, true, 'Founder label matches')

const marketerArticle = article(
  'Brand campaigns',
  'Performance marketing drives growth for consumer brands.',
  [],
  'General',
)
assert.equal(professionHits(marketerArticle, 'Marketer').length > 0, true, 'Marketer ~ marketing')

console.log('check-matching: all assertions passed')