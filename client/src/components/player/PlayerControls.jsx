import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { IconButton } from '../ui'
import { LoadingSpinner } from '../feedback'
import SpeedControl from './SpeedControl'
import './PlayerControls.css'

function PlayerControls({
  playing = false,
  loading = false,
  onToggle,
  onPrev,
  onNext,
  speed = 1,
  onSpeed,
}) {
  return (
    <div className="player-controls">
      <IconButton label="Previous story" size="md" onClick={onPrev}>
        <ChevronLeft size={20} aria-hidden="true" />
      </IconButton>

      <IconButton
        label={playing ? 'Pause' : 'Play'}
        size="lg"
        variant="primary"
        onClick={onToggle}
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : playing ? (
          <Pause size={22} fill="currentColor" aria-hidden="true" />
        ) : (
          <Play size={22} fill="currentColor" aria-hidden="true" />
        )}
      </IconButton>

      <IconButton label="Next story" size="md" onClick={onNext}>
        <ChevronRight size={20} aria-hidden="true" />
      </IconButton>

      <SpeedControl speed={speed} onChange={onSpeed} />
    </div>
  )
}

export default PlayerControls