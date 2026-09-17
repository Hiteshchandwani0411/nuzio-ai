import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import authApi from '../../services/authApi'
import authStorage from '../../lib/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('restoring')

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password })
    authStorage.set(data.token)
    setUser(data.user)
    setStatus('authenticated')
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password })
    authStorage.set(data.token)
    setUser(data.user)
    setStatus('authenticated')
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      /* server session is stateless (JWT); always clear locally */
    } finally {
      authStorage.clear()
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function restore() {
      const token = authStorage.get()
      if (!token) {
        setStatus('unauthenticated')
        return
      }
      try {
        const { user: restored } = await authApi.getMe()
        if (!cancelled) {
          setUser(restored)
          setStatus('authenticated')
        }
      } catch {
        if (!cancelled) {
          authStorage.clear()
          setUser(null)
          setStatus('unauthenticated')
        }
      }
    }

    restore()
    return () => {
      cancelled = true
    }
  }, [])

  // A 401 from any authenticated request (see apiClient interceptor) means the
  // token expired mid-session; flip straight to unauthenticated so routes bounce.
  const handleAuthExpired = useCallback(() => {
    authStorage.clear()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  useEffect(() => {
    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [handleAuthExpired])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isRestoring: status === 'restoring',
      onboardingCompleted: user?.onboardingCompleted ?? false,
      setUser,
      login,
      register,
      logout,
    }),
    [user, status, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext