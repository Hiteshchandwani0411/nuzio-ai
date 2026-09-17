import { RefreshCw } from 'lucide-react'
import { Button } from '../ui'
import NewsCard from './NewsCard'
import { Skeleton } from '../feedback'
import './NewsList.css'

const SKELETON_ROWS = 6

function NewsList({
  articles = [],
  playingId = null,
  onPlay,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No stories yet',
  emptyBody = 'Adjust your interests and refresh — new stories will appear here.',
}) {
  if (loading) {
    return (
      <div className="news-feed" aria-hidden="true">
        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
          <div className="news-skeleton-card" key={i}>
            <Skeleton variant="text" width="40%" height={12} />
            <Skeleton variant="text" width="90%" height={22} />
            <Skeleton variant="text" width="75%" height={14} />
            <Skeleton variant="text" width="30%" height={12} />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="news-feed-state" role="alert">
        <p className="news-feed-state-title">Couldn't load your briefing</p>
        <p className="news-feed-state-body">{error}</p>
        {onRetry && (
          <Button variant="secondary" size="md" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" /> Try again
          </Button>
        )}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="news-feed-state">
        <p className="news-feed-state-title">{emptyTitle}</p>
        {emptyBody && <p className="news-feed-state-body">{emptyBody}</p>}
      </div>
    )
  }

  return (
    <ul className="news-list">
      {articles.map((story) => (
        <li key={story.id}>
          <NewsCard
            story={story}
            playing={story.id === playingId}
            onPlay={(s) => onPlay?.(s)}
          />
        </li>
      ))}
    </ul>
  )
}

export default NewsList