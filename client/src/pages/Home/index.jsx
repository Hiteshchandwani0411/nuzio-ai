import { useEffect } from 'react'
import { Info, LogOut, Play, RefreshCw } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import usePersonalizedNews from '../../hooks/usePersonalizedNews'
import AppShell from '../../components/layout/AppShell'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import PageContainer from '../../components/layout/PageContainer'
import { IconButton, Button } from '../../components/ui'
import { BriefHeader, CategoryTabs, NewsList, StoryMetadata } from '../../components/news'
import { NewsPlayer } from '../../components/player'
import { useAudioPlayer } from '../../features/player'
import { DEFAULT_CATEGORY, PROVIDER_WARNING_LABELS } from '../../features/news'
import { formatDuration } from '../../utils'
import './Home.css'

function HeaderActions({ refreshing, onRefresh, onLogout }) {
  return (
    <div className="home-header-actions">
      <IconButton label="Refresh briefing" variant="ghost" onClick={onRefresh} disabled={refreshing}>
        <RefreshCw size={18} aria-hidden="true" className={refreshing ? 'is-spinning' : ''} />
      </IconButton>
      <IconButton label="Sign out" variant="ghost" onClick={onLogout}>
        <LogOut size={18} aria-hidden="true" />
      </IconButton>
    </div>
  )
}

function FeaturedStory({ story, player, isTopRanked }) {
  if (!story) return null
  const isActive = player.currentStory?.id === story.id

  return (
    <section className="home-featured">
      <div className="home-featured-head">
        <p className="home-featured-kicker">
          {isActive ? (isTopRanked ? 'Top story · now narrating' : 'Now narrating') : 'Top story for you'}
        </p>
        <StoryMetadata story={story} />
      </div>
      <h2 className="home-featured-title">{story.title}</h2>
      {story.description ? <p className="home-featured-desc">{story.description}</p> : null}
      {isActive ? (
        <NewsPlayer player={player} variant="expanded" className="home-featured-player" />
      ) : (
        <div className="home-featured-cta">
          <Button variant="primary" size="lg" onClick={() => player.playStory(story.id)}>
            <Play size={18} fill="currentColor" aria-hidden="true" /> Play top story
          </Button>
          <span className="home-featured-note">{formatDuration(story.duration)} narrate</span>
        </div>
      )}
    </section>
  )
}

function Home() {
  const { logout } = useAuth()
  const feed = usePersonalizedNews()
  const player = useAudioPlayer(feed.articles)

  // Stop the player if the story it's narrating disappears (e.g. after a
  // refresh) so the mini-player never points at a phantom story.
  useEffect(() => {
    const currentId = player.currentStory?.id
    if (currentId && !feed.articles.some((a) => a.id === currentId)) player.stop()
  }, [feed.articles, player])

  const briefLoading = feed.loading && !feed.brief
  const featured = player.currentStory || feed.articles[0] || null
  const isTopRanked = featured?.id === feed.articles[0]?.id
  const showFeatured = feed.activeCategory === DEFAULT_CATEGORY

  const listArticles = showFeatured && featured
    ? feed.articles.filter((a) => a.id !== featured.id)
    : feed.articles

  const warning =
    feed.provider?.mode === 'sampled' && feed.provider.warning
      ? PROVIDER_WARNING_LABELS[feed.provider.warning] || feed.provider.warning
      : null

  const handleLogout = async () => {
    await logout()
  }

  return (
    <AppShell
      header={
        <Header
          actions={<HeaderActions refreshing={feed.refreshing} onRefresh={feed.refresh} onLogout={handleLogout} />}
        />
      }
      bottomNav={<BottomNavigation />}
      player={player.currentStory ? <NewsPlayer player={player} variant="docked" /> : null}
    >
      <PageContainer size="standard">
        <BriefHeader brief={feed.brief} provider={feed.provider} loading={briefLoading} />

        {warning && (
          <div className="home-banner" role="status">
            <Info size={16} aria-hidden="true" />
            <span>{warning}</span>
          </div>
        )}

        <CategoryTabs
          categories={feed.categories}
          activeCategory={feed.activeCategory}
          onChange={feed.setCategory}
        />

        {feed.loading && !featured ? (
          <NewsList loading />
        ) : feed.error && !featured ? (
          <NewsList error={feed.error} onRetry={feed.refresh} />
        ) : (
          <div className="home-stack">
            {showFeatured && <FeaturedStory story={featured} player={player} isTopRanked={isTopRanked} />}

            <NewsList
              articles={listArticles}
              playingId={player.currentStory?.id}
              onPlay={(story) => player.playStory(story.id)}
              emptyTitle="No stories match this filter yet"
              emptyBody={feed.activeCategory === DEFAULT_CATEGORY ? 'Adjust your interests and refresh — new stories will appear here.' : 'Try another category.'}
            />
          </div>
        )}
      </PageContainer>
    </AppShell>
  )
}

export default Home