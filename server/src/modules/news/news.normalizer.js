// Canonicalize provider payloads into the application Article contract.
//
// Article contract:
//   externalId    string  stable identifier across refreshes
//   title         string  required
//   description   string  optional (null when absent)
//   content       string  optional full/near-full text (null when absent)
//   imageUrl      string  optional (null when absent — UI has a graceful fallback)
//   source        string  publication name
//   url           string  canonical link to the original story
//   category      string  canonical Nuzio taxonomy category
//   topics        string[] canonical Nuzio topics extracted from the body
//   language      string  optional (null when unknown) — informational, not a filter
//   region        string  optional (null when unknown)
//   publishedAt   string  ISO timestamp
//
// The normalizer never throws for malformed input; malformed rows are dropped.

import { classifyCategory, extractTopics, toCategory } from './taxonomy.js'

export function sanitizeText(value) {
  if (!value) return ''
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function validImageUrl(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function validDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

// Classify into the canonical taxonomy. When keyword classification is weak
// (General), defer to the provider's category hint if one is present.
function classify(raw, body) {
  const classified = classifyCategory(body)
  if (classified === 'General' && (raw.category || raw.providerCategory)) {
    return toCategory(raw.category || raw.providerCategory)
  }
  return classified
}

// Accepts either a raw provider item (from an adapter) or a partially-formed
// object (from the sample corpus / direct callers).
export function normalizeArticle(raw = {}) {
  const title = sanitizeText(raw.title)
  if (!title) return null

  const description = sanitizeText(raw.description) || null
  const contentRaw = sanitizeText(raw.content || raw.fullText || description || '') || null
  const body = `${title} ${description || ''} ${contentRaw || ''}`

  return {
    externalId: String(raw.externalId || raw.id || raw.url || title).trim(),
    title,
    description,
    content: contentRaw,
    imageUrl: validImageUrl(raw.imageUrl || raw.urlToImage),
    source: sanitizeText(raw.sourceName || raw.source?.name) || 'Nuzio',
    url: String(raw.url || ''),
    category: classify(raw, body),
    topics: Array.isArray(raw.topics) && raw.topics.length ? raw.topics : extractTopics(body),
    language: raw.language && String(raw.language).length <= 8 ? String(raw.language) : null,
    region: raw.region ? String(raw.region) : null,
    publishedAt: validDate(raw.publishedAt || new Date().toISOString()),
  }
}

export function normalizeBatch(rawList = []) {
  const seen = new Set()
  const articles = []
  for (const item of rawList) {
    const article = normalizeArticle(item)
    if (!article) continue
    const key = article.externalId
    if (seen.has(key)) continue
    seen.add(key)
    articles.push(article)
  }
  return articles
}