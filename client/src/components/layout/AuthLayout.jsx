import './AuthLayout.css'

function AuthLayout({ children, featureContent = null }) {
  return (
    <div className="auth-layout">
      <div className="auth-glow" aria-hidden="true" />
      <div className="auth-shell">
        <div className="auth-card">{children}</div>
        {featureContent && <aside className="auth-feature-panel">{featureContent}</aside>}
      </div>
    </div>
  )
}

export default AuthLayout