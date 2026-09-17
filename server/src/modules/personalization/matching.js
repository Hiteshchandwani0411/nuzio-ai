// Boundary-safe text matching for personalization.
//
// Naive substring matching is unsafe for short or embedded terms ("AI" appears
// inside "said", "culture" inside "agriculture"). This module only matches
// whole words (single-token terms) or whole phrases (multi-word terms), so an
// interest/profession signal is only credited when the term genuinely occurs.
//
// Matching is pure and deterministic: lowercase, whitespace-collapsed, with a
// light plural normalization so "Startups" also matches "startup". Display and
// stored preference values are never modified here.

export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Strip a trailing plural "s" when the remaining word is still meaningful.
export function normalizeTerm(term) {
  const normalized = normalizeText(term)
  if (normalized.length > 3 && normalized.endsWith('s')) {
    return normalized.slice(0, -1)
  }
  return normalized
}

// True when `term` occurs in `text` as a whole word (or phrase for multi-word).
// When the term was plural-normalized (trailing "s" stripped) the optional
// plural suffix is allowed in the text, so "markets" matches both "market" and
// "markets" without ever matching substring fragments.
export function termMatches(text, term) {
  const raw = normalizeText(term)
  if (!raw) return false
  const stem = normalizeTerm(raw)
  const pluralized = stem !== raw
  const body = pluralized ? `${escapeRegExp(stem)}s?` : escapeRegExp(stem)
  return new RegExp(`\\b(?:${body})\\b`).test(text)
}

// Which of `terms` match `text`. Returns the original terms, deduped.
export function matchTerms(text, terms = []) {
  const found = []
  const seen = new Set()
  for (const term of terms) {
    const key = String(term).trim().toLowerCase()
    if (!key || seen.has(key)) continue
    if (termMatches(text, key)) {
      seen.add(key)
      found.push(term)
    }
  }
  return found
}

export default { normalizeText, normalizeTerm, termMatches, matchTerms }