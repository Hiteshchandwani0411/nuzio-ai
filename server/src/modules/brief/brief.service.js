// Brief orchestration domain.
//
// Builds the frontend-friendly Morning Brief contract by composing the raw news
// retrieval pipeline with presentation concerns: request-derived audio URLs,
// reading-time estimate, and the brief summary object. Controllers stay thin.

import config from '../../config/index.js'
import { retrieveFeedForUser } from '../news/news.service.js'
import { attachAudio } from '../news/audio-clips.js'

function estimateReadMinutes(articles) {
  if (!articles.length) return 0
  const wordCount = articles.reduce((sum, article) => {
    const body = `${article.title || ''} ${article.description || ''}`
    return sum + body.split(/\s+/).filter(Boolean).length
  }, 0)
  return Math.max(1, Math.round(wordCount / 200))
}

function resolveAudioBaseUrl(req) {
  if (config.audio.baseUrl) return config.audio.baseUrl
  const host = req?.get?.('host') || req?.headers?.host || 'localhost'
  const protocol = req?.protocol === 'http' ? 'http' : 'https'
  // Trust X-Forwarded-Proto when behind a proxy like Vite.
  const forwarded = req?.headers?.['x-forwarded-proto']
  return `${forwarded || protocol}://${host}`
}

function buildGreeting(user) {
  const name = (user?.name || '').trim()
  const first = name.split(' ')[0]
  return first ? `Good morning, ${first}.` : 'Good morning.'
}

/**
 * GET /api/news/personalized orchestration.
 * @param {string} userId
 * @param {import('express').Request} req
 */
export async function buildBrief(userId, req) {
  const { articles, provider, preferences, user } = await retrieveFeedForUser(userId)

  const audioBaseUrl = resolveAudioBaseUrl(req)
  const withAudio = attachAudio(articles, audioBaseUrl)

  return {
    brief: {
      date: new Date().toISOString(),
      greeting: buildGreeting(user),
      storyCount: withAudio.length,
      minReadMinutes: estimateReadMinutes(withAudio),
      providerMode: provider.mode,
      interests: Array.isArray(preferences?.interests) ? preferences.interests : [],
    },
    articles: withAudio,
    provider,
  }
}
