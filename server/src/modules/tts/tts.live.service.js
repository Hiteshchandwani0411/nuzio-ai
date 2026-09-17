// Live TTS via edge-tts (free, no key — Microsoft Edge neural voices).
//
// Synthesizes an article's narration into MP3 and caches it under
// `server/public/audio/live/`, which is already served by the exact `/audio`
// static mount the deterministic WAV clips use (see app.js). The returned
// object keeps the player contract — { audioUrl, duration, id } — so the
// client needs zero changes. On any synthesis failure it resolves to null and
// the caller (brief.service) falls back to the deterministic WAV clip.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// edge-tts ships its ESM `main` as raw index.ts, which Node cannot execute.
// The package also publishes a compiled entry (`out/index.js`) — import that
// subpath directly so the live TTS seam stays dependency-free and runs on
// stock Node (no --experimental-strip-types, no build step).
import { tts } from 'edge-tts/out/index.js'
import config from '../../config/index.js'
import { stableHash } from '../news/audio-clips.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// server/public/audio/live — must live under the Node static root.
const LIVE_DIR = path.resolve(__dirname, '../../../public/audio/live')

// Words-per-second at the default (+0%) edge-tts rate. Used to derive a
// deterministic duration so the player's progress bar stays honest even though
// edge-tts doesn't return timing metadata.
const WORDS_PER_SECOND = 2.9

function ensureLiveDir() {
  fs.mkdirSync(LIVE_DIR, { recursive: true })
}

function narrationToFile(text) {
  const hash = stableHash(text)
  return `live-${hash}.mp3`
}

export function estimateDuration(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(3, Math.round(words / WORDS_PER_SECOND))
}

/**
 * Synthesize an article's spoken narration to a cached MP3.
 *
 * @param {object} args
 * @param {string} args.text         The spoken narration for this article.
 * @param {string} args.baseUrl      Origin-derived base URL (see brief.service).
 * @returns {Promise<{ audioUrl: string, duration: number, source: 'live' } | null>}
 */
export async function synthesizeArticleAudio({ text, baseUrl }) {
  if (!config.tts.enabled || !text) return null

  const file = narrationToFile(text)
  const filePath = path.join(LIVE_DIR, file)

  // Disk cache hit — reuse the immutable MP3 (also keeps repeat briefs instant).
  if (fs.existsSync(filePath)) {
    return {
      audioUrl: `${baseUrl.replace(/\/$/, '')}/audio/live/${file}`,
      duration: estimateDuration(text),
      source: 'live',
    }
  }

  try {
    // Edge TTS needs the raw Unicode text (pre-encoded, no HTML).
    const audioBuffer = await tts(text, {
      voice: config.tts.voice,
      rate: config.tts.rate,
      pitch: config.tts.pitch,
      volume: config.tts.volume,
    })

    if (!audioBuffer || !audioBuffer.length) return null

    ensureLiveDir()
    fs.writeFileSync(filePath, audioBuffer)

    return {
      audioUrl: `${baseUrl.replace(/\/$/, '')}/audio/live/${file}`,
      duration: estimateDuration(text),
      source: 'live',
    }
  } catch (err) {
    console.warn(`[tts] edge-tts degraded to WAV clip (${err?.message || 'error'})`)
    return null
  }
}

/**
 * Orchestration wrapper over the single low-level TTS operation
 * (`synthesizeArticleAudio`). Keeps the brief->player seam honest:
 *   - articles that get a real MP3 report `source: 'live'`
 *   - articles whose live synthesis failed report `source: 'fallback'` and are
 *     re-attached to the deterministic WAV clip (existing `attachAudio`), so the
 *     app stays resilient but never lets a placeholder masquerade as live TTS.
 * `id` mirrors the brief player contract (`{ audioUrl, duration, id }`).
 *
 * @param {Array<object>} articles
 * @param {string} baseUrl
 * @returns {Promise<Array<object>>} articles with live-or-fallback audio contract
 */
export async function attachLiveAudio(articles, baseUrl) {
  const withAudio = attachAudio(articles, baseUrl)
  const wavByIndex = new Map(withAudio.map((a, i) => [a.id, { i, wav: a }]))

  const out = []
  for (const article of articles || []) {
    const narrationText = String(article?.narrationText || article?.title || '').trim()
    const live = narrationText ? await synthesizeArticleAudio({ text: narrationText, baseUrl }) : null
    if (live) {
      out.push({
        id: article?.id ?? article?.externalId ?? article?.url,
        title: article?.title || '',
        description: article?.description || '',
        category: article?.category || '',
        audioUrl: live.audioUrl,
        duration: live.duration,
        source: 'live',
      })
      continue
    }
    const fallback = wavByIndex.get(article?.id ?? article?.externalId ?? article?.url)
    out.push({
      ...(fallback?.wav || {}),
      id: article?.id ?? article?.externalId ?? article?.url,
      source: 'fallback',
    })
  }
  return out
}

export default {
  synthesizeArticleAudio,
  estimateDuration,
  attachLiveAudio,
  liveDir: LIVE_DIR,
}
