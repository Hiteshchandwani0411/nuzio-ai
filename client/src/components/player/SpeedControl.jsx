import { PLAYBACK_SPEEDS } from '../../features/news'
import './SpeedControl.css'

function SpeedControl({ speed = 1, onChange }) {
  const cycle = () => {
    const current = PLAYBACK_SPEEDS.indexOf(speed)
    const next = PLAYBACK_SPEEDS[(current + 1) % PLAYBACK_SPEEDS.length]
    if (onChange) onChange(next)
  }

  return (
    <button
      type="button"
      className="speed-control"
      onClick={cycle}
      aria-label={`Playback speed ${speed} times`}
    >
      {speed}×
    </button>
  )
}

export default SpeedControl