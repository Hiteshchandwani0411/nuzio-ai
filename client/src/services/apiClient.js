import axios from 'axios'
import authStorage from '../lib/storage'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT when present; every authenticated request sends it via Bearer.
apiClient.interceptors.request.use((config) => {
  const token = authStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Unwrap responses so callers receive the payload directly (data.token, etc.).
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url || ''
    const hasToken = authStorage.get()
    // A 401 on any authenticated request means the session expired. Clear it
    // and let AuthContext flip to unauthenticated (routes then bounce to login).
    if (status === 401 && hasToken && !url.startsWith('/auth/login')) {
      authStorage.clear()
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    return Promise.reject(error)
  },
)

export default apiClient