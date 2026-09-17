// Personalization service — ranks and trims a normalized article set.
//
// Kept deliberately thin and framework-free so a smarter recommender can be
// swapped in later without changing the public contract.

import { scoreArticle, WEIGHTS } from './scoring.js'

/**
 * Rank articles against a user's preferences.
 * @param {Array<object>} articles  normalized articles
 * @param {object} preferences  { profession, interests[], language? }
 * @param {{limit?: number, weights?: object}} options
 * @returns {Promise<Array<object>>} scored+ranked articles (score not exposed)
 */
export async function personalizeArticles(articles = [], preferences = {}, options = {}) {
  const limit = options.limit
  const weights = options.weights || WEIGHTS

  const ranked = articles
    .map((article) => {
      const { score } = scoreArticle(article, preferences, weights)
      return { article, score }
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.article.publishedAt || 0).getTime() -
          new Date(a.article.publishedAt || 0).getTime(),
    )
    .map((entry) => entry.article)

  return Number.isInteger(limit) && limit > 0 ? ranked.slice(0, limit) : ranked
}