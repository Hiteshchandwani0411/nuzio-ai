import { useContext } from 'react'
import AuthContext from '../features/auth/AuthContext'

function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export default useAuth