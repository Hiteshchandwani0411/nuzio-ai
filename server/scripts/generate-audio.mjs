// Generates deterministic, real-playable WAV clips for the audio player.
// Reads clip metadata from modules/news/audio-clips.js (single source of truth
// for file names AND durations), then writes 16-bit PCM mono WAV files into
// server/public/audio/.
//
// Run:  node scripts/generate-audio.mjs
//
// This is a stand-in audio source for the MVP. Swap `audioUrl` production for a
// TTS endpoint in a later part without touching the player contract.

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { CLIPS } from '../src/modules/news/audio-clips.js'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio')

const SAMPLE_RATE = 22050

// Deterministic pseudo-random generator.
function mulberry32(seed) {
  let a = seed
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// Soft attack/release envelope so clips never click.
function envelope(t, duration) {
  const attack = 0.08
  const release = 0.25
  if (t < attack) return t / attack
  if (t > duration - release) return Math.max(0, (duration - t) / release)
  return 1
}

// Build a pleasant deterministic phrase: three gentle sine voices cycling a
// pentatonic scale with a slow arpeggio, plus a soft sub root.
function sampleAt(time, rand) {
  const scale = [60, 64, 67, 69, 72] // C major pentatonic
  const beat = 0.5
  const bar = Math.floor(time / (4 * beat))
  const step = Math.floor(time / beat) % 4
  const note = scale[(bar + step) % scale.length]
  const root = 36 + (bar % 4) * 2

  const t = time
  const freq = midiToFreq(note)
  const rootFreq = midiToFreq(root)
  const vibrato = 0.6 * Math.sin(2 * Math.PI * 5 * t)

  const lead =
    Math.sin(2 * Math.PI * freq * t + vibrato) * 0.30 +
    Math.sin(2 * Math.PI * freq * 2 * t) * 0.06
  const bass = Math.sin(2 * Math.PI * rootFreq * t) * 0.18
  const shimmer = (rand() - 0.5) * 0.02
  return (lead + bass + shimmer) * envelope(t, DURATION_SHARED)
}

let DURATION_SHARED = 1

function writeWav(clip) {
  const duration = clip.duration
  DURATION_SHARED = duration
  const totalSamples = Math.floor(SAMPLE_RATE * duration)
  const dataSize = totalSamples * 2
  const rand = mulberry32(duration * 7919)

  const buffer = Buffer.alloc(44 + dataSize)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20) // PCM
  buffer.writeUInt16LE(1, 22) // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24)
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)

  for (let i = 0; i < totalSamples; i += 1) {
    const value = Math.max(-1, Math.min(1, sampleAt(i / SAMPLE_RATE, rand)))
    buffer.writeInt16LE(Math.round(value * 0.8 * 32767), 44 + i * 2)
  }

  return buffer
}

mkdirSync(OUT_DIR, { recursive: true })

for (const clip of CLIPS) {
  const target = join(OUT_DIR, clip.file)
  writeFileSync(target, writeWav(clip))
  console.log(`wrote ${clip.file} (${clip.duration}s, ${SAMPLE_RATE}Hz mono)`)
}

console.log(`Done. ${CLIPS.length} clips in ${OUT_DIR}`)
console.log(existsSync(join(OUT_DIR, CLIPS[0].file)) ? 'verified: clips exist' : 'ERROR: missing clip')