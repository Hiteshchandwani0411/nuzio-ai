// NewsAPI.org adapter.
//
// This file is the ONLY place that speaks the NewsAPI dialect. Everything it
// returns is tagged in canonical Nuzio taxonomy terms so the rest of the app
// never cares which provider produced the data.

import { toCategory } from '../taxonomy.js'
import config from '../../../config/index.js'
import {
  ProviderMalformedError,
  ProviderRateLimitError,
  ProviderUnavailableError,
  ProviderTimeoutError,
} from './errors.js'

// Nuzio taxonomy category -> NewsAPI `category` query parameter.
const NUZIO_TO_NEWSAPI_CATEGORY = {
  Technology: 'technology',
  Finance: 'business',
  Politics: 'general',
  Sports: 'sports',
  Health: 'health',
  Science: 'science',
  Culture: 'entertainment',
  Climate: 'science',
  General: 'general',
}

const DEFAULT_COUNTRY = config.news.country || 'in'

function toNewsApiCategory(category) {
  return NUZIO_TO_NEWSAPI_CATEGORY[category] || 'general'
}

async function requestTopHeadlines(category, pageSize, timeoutMs) {
  const url = new URL(`${configUrl()}/top-headlines`)
  url.searchParams.set('country', DEFAULT_COUNTRY)
  url.searchParams.set('category', category)
  url.searchParams.set('pageSize', String(pageSize))

  let response
  try {
    response = await fetch(url.href, {
      headers: { 'X-Api-Key': config.news.apiKey },
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new ProviderTimeoutError(undefined, error)
    }
    throw new ProviderUnavailableError(undefined, error)
  }

  if (!response.ok) {
    throw new ProviderUnavailableError(`News provider responded ${response.status}`)
  }

  const payload = await response.json().catch((error) => {
    throw new ProviderMalformedError(undefined, error)
  })

  if (payload.status === 'error') {
    if (payload.code === 'rateLimited') {
      throw new ProviderRateLimitError(undefined)
    }
    throw new ProviderUnavailableError(payload.message || 'News provider error')
  }

  if (!Array.isArray(payload.articles)) {
    throw new ProviderMalformedError()
  }

  return payload.articles
}

function configUrl() {
  return process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2'
}

async function fetchCategory(category, share, timeoutMs) {
  const items = await requestTopHeadlines(
    toNewsApiCategory(category),
    Math.max(1, Math.ceil(share)),
    timeoutMs,
  )
  // Inject the canonical category we asked for; classification is still done by
  // the normalizer, this is only a fallback hint for weak matches.
  return items.map((item) => ({
    ...item,
    providerCategory: toCategory(toNewsApiCategory(category)),
  }))
}

export async function fetchFromNewsApi({
  categories = [],
  pageSize = 20,
  timeoutMs = 6000,
} = {}) {
  const requested = categories.length ? categories : Object.keys(NUZIO_TO_NEWSAPI_CATEGORY)
  const perCategory = pageSize / requested.length

  const results = await Promise.allSettled(
    requested.map((category) => fetchCategory(category, perCategory, timeoutMs)),
  )

  const items = []
  let lastFailure = null
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value)
    } else {
      lastFailure = result.reason
    }
  }

  if (items.length === 0 && lastFailure) {
    throw lastFailure
  }

  return {
    items,
    failedCategories: results.filter((result) => result.status === 'rejected').length,
  }
}