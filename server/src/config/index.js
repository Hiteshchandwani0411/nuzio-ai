import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const currentDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(currentDir, '../..')
const envPath = join(projectRoot, '.env')
const envExamplePath = join(projectRoot, '.env.example')

if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else if (existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath })
} else {
  dotenv.config()
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri:
    process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/nuzio',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  // Live LLM narration (Gemini). Empty apiKey degrades to the deterministic
  // template narration — the brief pipeline must never dead-end on a missing key.
  llm: {
    provider: 'gemini',
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    timeoutMs: parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 8000,
  },

  // Live TTS (edge-tts — free, no key required). When disabled or on synthesis
  // failure the app falls back to the deterministic WAV clips (audio-clips.js).
  tts: {
    enabled: process.env.TTS_ENABLED !== 'false',
    provider: 'edge-tts',
    voice: process.env.TTS_VOICE || 'en-US-GuyNeural',
    rate: process.env.TTS_RATE || '+0%',
    pitch: process.env.TTS_PITCH || '+0Hz',
    volume: process.env.TTS_VOLUME || '+0%',
  },

  news: {
    apiKey: process.env.NEWS_API_KEY || '',
    baseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
    timeoutMs: parseInt(process.env.NEWS_TIMEOUT_MS, 10) || 6000,
    pageSize: parseInt(process.env.NEWS_PAGE_SIZE, 10) || 20,
    personalizedLimit: parseInt(process.env.NEWS_PERSONALIZED_LIMIT, 10) || 12,
    // Live top-headlines country (NewsAPI 2-letter ISO code). Defaults to India
    // to match the product's "Indian professionals" positioning.
    country: process.env.NEWS_API_COUNTRY || 'in',
    // ISO 639-1 language filter for the feed. 'en' keeps the product English-only.
    language: process.env.NEWS_API_LANGUAGE || 'en',
  },

  audio: {
    // Optional override for CDN/custom domain. When empty, audio URLs are
    // derived from the incoming request origin so nothing is hardcoded.
    baseUrl: process.env.AUDIO_BASE_URL || '',
  },
}

export default config