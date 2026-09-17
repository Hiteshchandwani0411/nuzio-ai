// News retrieval domain:
//   resolve provider -> normalize -> personalize
//
// This service knows nothing about audio URLs, greetings, or brief metadata.
// Those belong to the brief orchestration layer (modules/brief).

import config from '../../config/index.js'
import { fetchNews } from './news.provider.js'
import { normalizeBatch } from './news.normalizer.js'
import { personalizeArticles } from '../personalization/personalization.service.js'
import User from '../users/user.model.js'

export async function loadUser(userId) {
  return User.findById(userId)
}

export async function retrieveFeedForUser(userId, options = {}) {
  const user = userId ? await loadUser(userId) : null
  const preferences =
    user?.preferences || { profession: '', interests: [], language: 'en' }

  const raw = await fetchNews({
    categories: Array.isArray(preferences.interests) ? preferences.interests : [],
    pageSize: options.pageSize,
  })

  const normalized = normalizeBatch(raw.items)
  const articles = await personalizeArticles(normalized, preferences, {
    limit: config.news.personalizedLimit,
  })

  return {
    articles,
    provider: raw.provider,
    preferences,
    user,
  }
}

// Raw search — returns whatever the provider yields for a query, normalized.
export async function searchArticles(query = '') {
  const raw = await fetchNews({ categories: [], pageSize: config.news.pageSize })
  const q = String(query).trim().toLowerCase()
  if (!q) {
    return { articles: normalizeBatch(raw.items), provider: raw.provider }
  }
  const matched = normalizeBatch(raw.items).filter((article) => {
    const haystack = `${article.title} ${article.description || ''} ${article.topics.join(' ')}`.toLowerCase()
    return haystack.includes(q)
  })
  return { articles: matched, provider: raw.provider }
}

// Backward-compatible feed (GET /api/news) built from the same pipeline.
export async function getPersonalizedFeed(userId, query = {}) {
  const limit = Number(query.pageSize) || config.news.personalizedLimit
  const { articles, provider } = await retrieveFeedForUser(userId, { pageSize: limit })
  return {
    articles,
    provider,
    page: Number(query.page) || 1,
    totalPages: 1,
  }
}

export async function getArticleById(articleId) {
  const raw = await fetchNews({ pageSize: config.news.pageSize * 2 })
  return normalizeBatch(raw.items).find((article) => article.externalId === articleId) || null
}