import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button, Input } from '../ui'
import { useToast } from '../feedback'
import useAuth from '../../hooks/useAuth'
import GoogleIcon from './GoogleIcon'
import './LoginForm.css'

function validateEmail(email) {
  if (!email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address'
  return null
}

function LoginForm() {
  const { login } = useAuth()
  const { show: toast } = useToast()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [loading, setLoading] = useState(false)

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
    setServerError(null)
  }

  const validate = () => {
    const emailError = validateEmail(form.email)
    const passwordError = !form.password ? 'Password is required' : null
    return {
      email: emailError,
      password: passwordError,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setServerError(null)

    if (nextErrors.email || nextErrors.password) return

    setLoading(true)
    try {
      await login(form.email, form.password)
      // Route changes automatically: auth state flips → ProtectedRoute redirects.
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong. Please try again.'
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    toast('Google sign-in is coming soon', 'info')
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="login-error" role="alert">
          {serverError}
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setField('email', e.target.value)}
        error={errors.email}
        leadingIcon={null}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        value={form.password}
        onChange={(e) => setField('password', e.target.value)}
        error={errors.password}
        required
      />

      <Button type="submit" size="xl" fullWidth loading={loading}>
        Sign in <ArrowRight size={16} aria-hidden="true" />
      </Button>

      <div className="login-divider" role="separator" aria-hidden="true">
        <span>or</span>
      </div>

      <Button type="button" variant="secondary" size="xl" fullWidth onClick={handleGoogle}>
        <GoogleIcon />
        Continue with Google
      </Button>
    </form>
  )
}

export default LoginForm