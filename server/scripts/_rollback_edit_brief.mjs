import { readFileSync, writeFileSync } from 'node:fs'

const p = 'C:/Users/user/OneDrive/Desktop/nuzio ai/server/src/modules/brief/brief.service.js'
const src = readFileSync(p, 'utf8')
const lines = src.split(/\r?\n/)

const dead = [
  "import { buildNarrationLead } from '../narration/narration.service.js'",
  "import { attachLiveAudio } from '../tts/tts.live.service.js'",
]

const hitIdx = {}
for (const d of dead) {
  hitIdx[d] = lines.indexOf(d)
}
const allPresent = Object.values(hitIdx).every((i) => i >= 0)
console.log('UPGRADE_IMPORTS_PRESENT=' + allPresent + ' at ' + JSON.stringify(hitIdx))

if (!allPresent) {
  console.log('ABORT: literal imports not all present on disk; NO write. Report, do not guess.')
  process.exit(1)
}

const wavLine = lines.findIndex((l) => l.includes('attachAudio(') && l.includes('audioBaseUrl'))
console.log('WAV_CALL_PRESENT_LINE=' + (wavLine + 1))
if (wavLine < 0) {
  console.log('ABORT: baseline WAV call attachAudio(articles, audioBaseUrl) must survive; missing. NO write.')
  process.exit(1)
}

const next = lines.filter((l) => !dead.includes(l))
const removedCount = lines.length - next.length
console.log('REMOVED_LINES=' + removedCount)
if (removedCount !== 2) {
  console.log('ABORT: expected exactly 2 removed lines, got ' + removedCount + '. NO write.')
  process.exit(1)
}

writeFileSync(p, next.join('\r\n'), 'utf8')
console.log('WROTE brief.service.js (removed 2 upgrade-only imports; WAV body untouched)')
