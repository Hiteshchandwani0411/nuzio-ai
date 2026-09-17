/**
 * Feature slice: news. Data contracts for the Morning Brief feed.
 */

/**
 * A playable story returned by GET /api/news/personalized.
 * @typedef {Object} Story
 * @property {string} id
 * @property {string} title
 * @property {string|null} description
 * @property {string|null} content
 * @property {string|null} imageUrl
 * @property {string} source
 * @property {string} url
 * @property {string} category
 * @property {string[]} topics
 * @property {string|null} language
 * @property {string} publishedAt
 * @property {string} audioUrl
 * @property {number} duration
 * @property {boolean} isTopStory
 */

/**
 * Brief summary block from the personalization endpoint.
 * @typedef {Object} Brief
 * @property {string} date
 * @property {string} greeting
 * @property {number} storyCount
 * @property {number} minReadMinutes
 * @property {'live'|'sampled'} providerMode
 * @property {string[]} interests
 */

/**
 * Provider metadata describing data provenance.
 * @typedef {Object} ProviderInfo
 * @property {'live'|'sampled'} mode
 * @property {string} source
 * @property {string|null} warning
 * @property {string} retrievedAt
 */

export const DEFAULT_CATEGORY = 'For you'

export const PROVIDER_WARNING_LABELS = {
  no_api_key: 'Live feeds are off — showing a sample briefing.',
  provider_unavailable: 'Live feeds are unavailable — showing a sample briefing.',
  provider_timeout: 'Live feeds timed out — showing a sample briefing.',
  provider_rate_limited: 'Live feed limit reached — showing a sample briefing.',
  provider_malformed: 'Live feeds returned bad data — showing a sample briefing.',
}

export const PLAYBACK_SPEEDS = [1, 1.25, 1.5, 2]