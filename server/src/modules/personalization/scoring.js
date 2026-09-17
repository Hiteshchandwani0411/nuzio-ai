// Transparent, configurable ranking.
//
// Scores are internal to the personalization layer and never exposed in the
// API response. The engine is pure (no I/O) so it is trivially replaceable by a
// more advanced recommender behind the same personalizeArticles() contract.

import { normalizeText, matchTerms } from './matching.js'
import { professionKeywords } from './professions.js'

// Configurable weights — single source of truth for ranking influence.
export const WEIGHTS = {
  interest: 5, // matched interest in title/description/topics/category
  profession: 4, // profession signal present in the article body
  recency: 3, // decays as articles age
}

export const RECENCY_HALF_LIFE_HOURS = 24

function articleText(article) {
  return [article.title, article.description, article.topics, article.category]
    .filter(Boolean)
    .join(' ')
}

export function interestHits(article, interests = []) {
  return matchTerms(normalizeText(articleText(article)), interests)
}

// Profiles credited for a profession: the label itself plus its curated domain
// vocabulary, matched with word boundaries (never naive substring).
export function professionHits(article, profession) {
  const label = String(profession || '').trim()
  if (!label) return []
  const terms = [label, ...professionKeywords(label)]
  return matchTerms(normalizeText(articleText(article)), terms)
}

export function recencyFactor(publishedAt = new Date().toISOString(), now = Date.now()) {
  const ageMs = now - new Date(publishedAt).getTime()
  if (!(ageMs > 0)) return 0
  const halfLifeMs = RECENCY_HALF_LIFE_HOURS * 3.6e6
  // True exponential half-life decay: 0.5 at 24h, 0.25 at 48h, asymptotic to 0.
  return Math.min(1, Math.pow(0.5, ageMs / halfLifeMs))
}

export function scoreArticle(article, preferences = {}, weights = WEIGHTS) {
  const interests = Array.isArray(preferences.interests) ? preferences.interests : []
  const profession = String(preferences.profession || '').trim()

  const hits = interestHits(article, interests)
  const interestScore = Math.min(hits.length, 3) * weights.interest

  const professionScore =
    profession && professionHits(article, profession).length > 0 ? weights.profession : 0

  const recencyScore = weights.recency * recencyFactor(article.publishedAt)

  const score = interestScore + professionScore + recencyScore
  return {
    score: Math.round(score * 10) / 10,
    matched: hits,
  }
}