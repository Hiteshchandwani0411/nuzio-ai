// Provider boundary.
//
// The rest of the application never imports a concrete provider directly. This
// module decides which provider to use, isolates failures, and always returns a
// list of raw (un-normalized) items plus provider metadata so callers can
// degrade gracefully.

import config from '../../config/index.js'
import { fetchFromNewsApi } from './providers/newsapi.provider.js'
import { fetchSampleArticles } from './news.sampledata.js'
import { ProviderError } from './providers/errors.js'

function buildResult(items, mode, source, warning, retrievedAt) {
  return {
    items,
    provider: {
      mode, // 'live' | 'sampled'
      source, // 'newsapi' | 'sample'
      warning: warning || null,
      retrievedAt: retrievedAt || new Date().toISOString(),
    },
  }
}

export async function fetchNews({ categories = [], pageSize, timeoutMs } = {}) {
  const size = Number(pageSize) || config.news.pageSize
  const timeout = timeoutMs || config.news.timeoutMs

  if (!config.news.apiKey) {
    const { items } = fetchSampleArticles({ categories, pageSize: size })
    return buildResult(items, 'sampled', 'sample', 'no_api_key')
  }

  try {
    const { items } = await fetchFromNewsApi({
      categories,
      pageSize: size,
      timeoutMs: timeout,
    })
    return buildResult(items, 'live', 'newsapi')
  } catch (error) {
    const code = error instanceof ProviderError ? error.code : 'provider_unavailable'
    console.warn(`[news] provider degraded (${code}): ${error?.message || ''}`)
    const { items } = fetchSampleArticles({ categories, pageSize: size })
    return buildResult(items, 'sampled', 'sample', code)
  }
}