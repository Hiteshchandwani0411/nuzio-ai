import { formatDuration } from '../../utils'
import ProgressBar from './ProgressBar'
import Waveform from './Waveform'
import StoryInfo from './StoryInfo'
import PlayerControls from './PlayerControls'
import './NewsPlayer.css'

/**
 * Top-level reusable audio player. Consumes the transport object returned by
 * useAudioPlayer; it never fetches stories itself.
 *
 * @param {{currentStory?: Story|null, isPlaying: boolean, isLoading: boolean, currentTime: number, duration: number, speed: number, toggle: fn, next: fn, prev: fn, seek: fn, changeSpeed: fn}} player
 * @param {'docked'|'expanded'} [variant]
 */
function NewsPlayer({ player, variant = 'docked', className = '' }) {
  const {
    currentStory: story,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    speed,
    toggle,
    next,
    prev,
    seek,
    changeSpeed,
  } = player

  if (!story) return null

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <section
      className={['news-player', `news-player--${variant}`, className].filter(Boolean).join(' ')}
      aria-label="Audio player"
    >
      {variant === 'expanded' ? (
        <>
          <StoryInfo story={story} playing={isPlaying} />
          <Waveform seed={story.id} progress={progress} className="news-player-wave" />
          <div className="news-player-times" aria-hidden="true">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
          <PlayerControls
            playing={isPlaying}
            loading={isLoading}
            onToggle={toggle}
            onPrev={prev}
            onNext={next}
            speed={speed}
            onSpeed={changeSpeed}
          />
        </>
      ) : (
        <>
          <ProgressBar value={currentTime} max={duration} onChange={seek} />
          <div className="news-player-body">
            <StoryInfo story={story} playing={isPlaying} />
            <PlayerControls
              playing={isPlaying}
              loading={isLoading}
              onToggle={toggle}
              onPrev={prev}
              onNext={next}
              speed={speed}
              onSpeed={changeSpeed}
            />
          </div>
        </>
      )}
    </section>
  )
}

export default NewsPlayer