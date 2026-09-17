import { Pause, Play } from 'lucide-react'
import { Card, IconButton } from '../ui'
import { formatRelativeTime } from '../../utils'
import StoryMetadata from './StoryMetadata'
import './NewsCard.css'

function NewsCard({ story, playing = false, onPlay }) {
  return (
    <Card variant={playing ? 'highlighted' : 'default'} className="news-card" data-playing={playing || undefined}>
      <StoryMetadata story={story} />
      <h3 className="news-card-title">{story.title}</h3>
      {story.description ? <p className="news-card-desc">{story.description}</p> : null}
      <div className="news-card-footer">
        {story.publishedAt ? (
          <span className="news-card-time">{formatRelativeTime(story.publishedAt)}</span>
        ) : (
          <span />
        )}
        <IconButton
          label={playing ? 'Pause story' : 'Play story'}
          size="md"
          variant={playing ? 'primary' : 'ghost'}
          onClick={() => onPlay?.(story)}
          aria-pressed={playing || undefined}
        >
          {playing ? (
            <Pause size={18} aria-hidden="true" />
          ) : (
            <Play size={18} aria-hidden="true" />
          )}
        </IconButton>
      </div>
    </Card>
  )
}

export default NewsCard