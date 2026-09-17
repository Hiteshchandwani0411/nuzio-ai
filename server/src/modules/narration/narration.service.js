// Live LLM narration (Gemini) with a deterministic template fallback.
//
// Mirrors the news provider degradation contract: when GEMINI_API_KEY is absent,
// empty, or the upstream call fails/times out, we return the template greeting +
// editorial line instead so the brief pipeline never dead-ends. The returned
// object always reports `source: 'live' | 'template'` so downstream + verify
// scripts can see the honest provider mode in play.

import { GoogleGenAI } from '@google/genai'
import config from '../../config/index.js'

// Deterministic template narration — byte-stable, no network, no keys.
// Kept in this module so `brief.service` reads one narration seam only.
export function templateNarration({ firstName, headline }) {
  const greeting = firstName ? `Good morning, ${firstName}.` : 'Good morning.'
  const topic = headline ? ` Today’s lead: ${headline}.` : ''
  return `${greeting}${topic} Three minutes of the stories that matter.`
}

function firstNameOf(user) {
  const name = (user?.name || '').trim()
  return name ? name.split(/\s+/)[0] : ''
}

// Build the LLM prompt. The model is asked to act as the brief's editor and to
// produce a single short spoken intro; the caller (brief.service) owns content
// policy, so we keep this strictly to format + tone constraints.
function buildPrompt({ user, headline, interests }) {
  const name = firstNameOf(user)
  const interestLine = Array.isArray(interests) && interests.length
    ? ` The reader cares most about: ${interests.slice(0, 4).join(', ')}.`
    : ''
  const greeting = name ? `Greet the reader as "${name}".` : 'Greet the reader warmly.'
  return [
    'You are the editorial host of a 3-minute morning audio news brief platform.',
    `Today the top story is: "${headline}".`,
    interestLine,
    `${greeting} Write ONE short spoken intro (max 2 sentences, under 30 words).`,
    'Rules: no markdown, no quotes, no filler, plain spoken English, end with a comma-then-"today"s teaser.',
    'Output only the spoken text.',
  ].join(' ')
}

// Keep one live client per process; cheap and safe to share.
let geminiClient = null
function getClient() {
  const apiKey = config.llm.apiKey
  if (!apiKey) return null
  geminiClient ??= new GoogleGenAI({ apiKey })
  return geminiClient
}

/**
 * Produce the brief's spoken narration lead.
 * @param {object} opts
 * @param {object} opts.user
 * @param {string} [opts.headline]
 * @param {string[]} [opts.interests]
 * @returns {Promise<{ text: string, source: 'live'|'template' }>}
 */
export async function buildNarrationLead({ user, headline = '', interests = [] }) {
  const fallback = {
    text: templateNarration({ firstName: firstNameOf(user), headline }),
    source: 'template',
  }

  const client = getClient()
  if (!client) return fallback

  const prompt = buildPrompt({ user, headline, interests })
  const timeoutMs = config.llm.timeoutMs || 8000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await client.models.generateContent({
      model: config.llm.model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 80,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      },
    }, { signal: controller.signal })

    const text = response?.text?.trim()
    if (!text) return fallback
    // Never let the model bend the spoken greeting contract.
    return { text: text.replace(/[“”"']/g, ''), source: 'live' }
  } catch (err) {
    const reason = err?.name === 'AbortError' ? 'timeout' : (err?.message || 'error')
    console.warn(`[narration] gemini degraded to template (${reason})`)
    return fallback
  } finally {
    clearTimeout(timer)
  }
}

export default {
  buildNarrationLead,
  templateNarration,
}
