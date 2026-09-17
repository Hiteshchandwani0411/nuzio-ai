import { useMemo } from 'react'
import { stableHash } from '../../utils'
import './Waveform.css'

const BAR_COUNT = 28

// Deterministic pseudo-random heights derived from the story id so the art
// never changes while a story stays in place.
function barsFor(seed) {
  const bars = []
  let x = stableHash(seed || '')
  for (let i = 0; i < BAR_COUNT; i += 1) {
    x = (x * 48271) % 2147483647
    const unit = x / 2147483647
    bars.push(0.25 + unit * 0.75)
  }
  return bars
}

function Waveform({
  seed = '',
  progress = 0,
  className = '',
  'aria-label': ariaLabel = 'Audio waveform',
}) {
  const bars = useMemo(() => barsFor(seed), [seed])
  const pct = Math.max(0, Math.min(1, progress))

  return (
    <div
      className={['waveform', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      {bars.map((height, i) => {
        const filled = i / bars.length < pct
        return (
          <span
            key={i}
            className={['waveform-bar', filled && 'is-filled'].filter(Boolean).join(' ')}
            style={{ height: `${Math.round(height * 100)}%` }}
          />
        )
      })}
    </div>
  )
}

export default Waveform