// NewsData.io adapter.
//
// This file is the ONLY place that speaks the NewsData.io dialect. Everything it
// returns is tagged in canonical Nuzio taxonomy terms so the rest of the app
// never cares which provider produced the data.

import { toCategory, DEFAULT_CATEGORY } from '../taxonomy.js'
import config from '../../../config/index.js'
import {
  ProviderMalformedError,
  ProviderRateLimitError,
  ProviderUnavailableError,
  ProviderTimeoutError,
} from './errors.js'

// Nuzio taxonomy category -> NewsData.io `category` query parameter.
const NUZIO_TO_NEWDATAIO_CATEGORY = {
  Technology: 'technology',
  Finance: 'business',
  Politics: 'politics',
  Sports: 'sports',
  Health: 'health',
  Science: 'science',
  Culture: 'entertainment',
  Climate: 'environment',
  General: 'top',
}

const DEFAULT_COUNTRY = config.news.country || 'in'

function toNewsDataIoCategory(category) {
  return NUZIO_TO_NEWDATAIO_CATEGORY[category] || 'top'
}

// Resolve NewsData.io's own category (string or array) into the canonical Nuzio
// taxonomy. Returns null when the hint is absent or too generic to trust.
function normalizeCategoryHint(value) {
  if (!value) return null
  const mapped = toCategory(value)
  return mapped === DEFAULT_CATEGORY ? null : mapped
}

function mapArticle(item) {
  return {
    externalId: String(item.article_id || '').trim(),
    title: item.title,
    description: item.description,
    content: item.content,
    url: item.link,
    imageUrl: item.image_url,
    sourceName: item.source_name,
    publishedAt: item.pubDate,
    language: item.language,
    region: Array.isArray(item.country) ? item.country[0] : item.country,
    topics: Array.isArray(item.keywords) ? item.keywords.filter(Boolean) : [],
    providerCategory: normalizeCategoryHint(item.category),
  }
}

async function requestLatestNews(category, pageSize, timeoutMs) {
  const url = new URL(configUrl())
  url.searchParams.set('apikey', config.news.apiKey)
  url.searchParams.set('country', DEFAULT_COUNTRY)
  url.searchParams.set('category', category)
  url.searchParams.set('language', config.news.language)
  url.searchParams.set('size', String(pageSize))

  let response
  try {
    response = await fetch(url.href, {
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
    if (payload.code === 'rateLimited' || payload.code === 'maximumResultsReached') {
      throw new ProviderRateLimitError(undefined)
    }
    throw new ProviderUnavailableError(payload.message || 'News provider error')
  }

  if (!Array.isArray(payload.results)) {
    throw new ProviderMalformedError()
  }

  return payload.results
}

function configUrl() {
  return process.env.NEWS_API_BASE_URL || 'https://newsdata.io/api/1/latest'
}

async function fetchCategory(category, share, timeoutMs) {
  const items = await requestLatestNews(
    toNewsDataIoCategory(category),
    Math.max(1, Math.ceil(share)),
    timeoutMs,
  )
  return items.map((item) => mapArticle(item))
}

export async function fetchFromNewsApi({
  categories = [],
  pageSize = 20,
  timeoutMs = 6000,
} = {}) {
  const requested = categories.length ? categories : Object.keys(NUZIO_TO_NEWDATAIO_CATEGORY)
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
