import { useCallback, useState } from 'react'
import preferenceApi from '../services/preferenceApi'

function usePreferences() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadPreferences = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      return await preferenceApi.getPreferences()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load preferences')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const savePreferences = useCallback(async (prefs) => {
    setLoading(true)
    setError(null)
    try {
      return await preferenceApi.updatePreferences(prefs)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save preferences')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loadPreferences, savePreferences, loading, error }
}

export default usePreferences