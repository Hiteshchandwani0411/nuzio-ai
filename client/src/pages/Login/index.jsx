import { AuthLayout } from '../../components/layout'
import { Logo } from '../../components/ui'
import LoginForm from '../../components/auth/LoginForm'

function Login() {
  return (
    <AuthLayout
      featureContent={
        <div className="auth-feature-copy">
          <h1>
            Good morning.
            <em>News on go.</em>
          </h1>
          <p>
            Personalized audio news for Indian professionals — curated every morning with the stories
            that matter most to your work, interests, and pace.
          </p>
        </div>
      }
    >
      <div className="auth-brand-copy">
        <Logo size="login" withGlow wordmark />
        <h2 className="auth-brand-title">News on go</h2>
      </div>
      <LoginForm />
    </AuthLayout>
  )
}

export default Login