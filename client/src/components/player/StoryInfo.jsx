import { formatDuration } from '../../utils'
import './StoryInfo.css'

function StoryInfo({ story, playing = false }) {
  return (
    <div className="story-info">
      {playing && (
        <span className="live-eq" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      <div className="story-info-text">
        <p className="story-info-title">{story.title}</p>
        <p className="story-info-meta">
          {story.source}
          {story.duration ? ` · ${formatDuration(story.duration)}` : ''}
        </p>
      </div>
    </div>
  )
}

export default StoryInfo