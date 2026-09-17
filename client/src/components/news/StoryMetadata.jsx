import { Badge } from '../ui'
import { formatDuration, formatRelativeTime } from '../../utils'
import SourceBadge from './SourceBadge'
import './StoryMetadata.css'

function StoryMetadata({ story }) {
  return (
    <div className="story-metadata">
      <Badge variant="category">{story.category}</Badge>
      <SourceBadge source={story.source} url={story.url} className="story-metadata-source" />
      {story.duration ? (
        <span className="story-metadata-duration">{formatDuration(story.duration)} listen</span>
      ) : story.publishedAt ? (
        <span className="story-metadata-time">{formatRelativeTime(story.publishedAt)}</span>
      ) : null}
    </div>
  )
}

export default StoryMetadata