import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Reusable HTML5 audio player hook.
 *
 * Owns a single Audio element, loads a queue of stories, and exposes transport
 * controls plus playback state. Auto-advances when a story ends; stops at the
 * end of the queue.
 *
 * @param {Array<{id?: string, audioUrl?: string}>} queue
 */
export function useAudioPlayer(queue = []) {
  const audioRef = useRef(null)
  const [index, setIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)

  const queueRef = useRef(queue)
  const speedRef = useRef(1)

  // Keep the latest queue visible to the mounted event listeners.
  useEffect(() => {
    queueRef.current = queue
  })

  // Which queue item is currently mounted into the Audio element.
  const loadedIndexRef = useRef(-1)

  // Tracks the active index for event handlers; kept in sync inside handlers.
  const activeIndexRef = useRef(-1)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onWaiting = () => {
      if (audioRef.current === audio) setIsLoading(true)
    }
    const onPlaying = () => setIsLoading(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      const finished = activeIndexRef.current + 1
      if (finished < queueRef.current.length) {
        setCurrentTime(0)
        activeIndexRef.current = finished
        setIndex(finished)
      } else {
        setIsPlaying(false)
        setCurrentTime(0)
        setDuration(0)
        activeIndexRef.current = -1
        loadedIndexRef.current = -1
      }
    }
    const onError = () => {
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [])

  // Load + start the story at `next`. Re-picking the current story rewinds it.
  const load = useCallback((next, autoplay = true) => {
    const audio = audioRef.current
    const story = queueRef.current[next]
    if (!audio || !story?.audioUrl) {
      setIsLoading(false)
      return
    }
    if (loadedIndexRef.current === next) {
      if (autoplay) audio.play().catch(() => setIsLoading(false))
      return
    }
    loadedIndexRef.current = next
    activeIndexRef.current = next
    setCurrentTime(0)
    setDuration(0)
    audio.playbackRate = speedRef.current
    setIndex(next)
    setIsLoading(true)
    audio.src = story.audioUrl
    if (autoplay) audio.play().catch(() => setIsLoading(false))
  }, [])

  const playStory = useCallback(
    (storyId) => {
      const next = queueRef.current.findIndex((s) => s.id === storyId)
      if (next === -1) return
      if (next !== loadedIndexRef.current) loadedIndexRef.current = -1
      load(next, true)
    },
    [load],
  )

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (activeIndexRef.current < 0) {
      if (queueRef.current.length > 0) playStory(queueRef.current[0].id)
      return
    }
    if (loadedIndexRef.current < 0) {
      load(activeIndexRef.current, true)
      return
    }
    if (audio.paused) {
      audio.play().catch(() => setIsLoading(false))
    } else {
      audio.pause()
    }
  }, [load, playStory])

  const next = useCallback(() => {
    const target = activeIndexRef.current + 1
    if (target < queueRef.current.length) load(target, true)
  }, [load])

  const prev = useCallback(() => {
    const from = activeIndexRef.current
    if (from > 0) {
      load(from - 1, true)
    } else {
      const audio = audioRef.current
      if (audio) audio.currentTime = 0
      setCurrentTime(0)
    }
  }, [load])

  const seek = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }, [])

  const changeSpeed = useCallback((nextSpeed) => {
    speedRef.current = nextSpeed
    const audio = audioRef.current
    if (audio && Number.isFinite(audio.duration)) audio.playbackRate = nextSpeed
    setSpeed(nextSpeed)
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    activeIndexRef.current = -1
    setIndex(-1)
    setIsPlaying(false)
    setIsLoading(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const currentStory = index >= 0 && index < queue.length ? queue[index] : null

  return {
    currentStory,
    index,
    queueLength: queue.length,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    speed,
    toggle,
    playStory,
    next,
    prev,
    seek,
    changeSpeed,
    stop,
  }
}

export default useAudioPlayer