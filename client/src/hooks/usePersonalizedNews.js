import { useCallback, useEffect, useMemo, useState } from 'react'
import { newsApi } from '../services/newsApi'
import { DEFAULT_CATEGORY } from '../features/news'

function usePersonalizedNews() {
  const [feed, setFeed] = useState({ brief: null, articles: [], provider: null })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY)

  const applyFeed = useCallback((data) => {
    setFeed({ brief: data.brief, articles: data.articles || [], provider: data.provider || null })
    setError(null)
  }, [])

  const load = useCallback(async () => {
    try {
      applyFeed(await newsApi.getPersonalized())
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load your briefing')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [applyFeed])

  useEffect(() => {
    let active = true
    newsApi
      .getPersonalized()
      .then((data) => {
        if (active) applyFeed(data)
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.message || 'Could not load your briefing')
      })
      .finally(() => {
        if (active) {
          setLoading(false)
          setRefreshing(false)
        }
      })
    return () => {
      active = false
    }
  }, [applyFeed])

  const refresh = useCallback(() => {
    setRefreshing(true)
    return load()
  }, [load])

  const categories = useMemo(() => {
    const set = new Set(feed.articles.map((a) => a.category).filter(Boolean))
    return [DEFAULT_CATEGORY, ...set]
  }, [feed.articles])

  const articles = useMemo(() => {
    if (activeCategory === DEFAULT_CATEGORY) return feed.articles
    return feed.articles.filter((a) => a.category === activeCategory)
  }, [feed.articles, activeCategory])

  const setCategory = useCallback((category) => {
    setActiveCategory(category)
  }, [])

  return {
    brief: feed.brief,
    provider: feed.provider,
    categories,
    activeCategory,
    setCategory,
    articles,
    loading,
    refreshing,
    error,
    refresh,
  }
}

export default usePersonalizedNews