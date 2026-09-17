import './Logo.css'

const SIZE_VAR = {
  splash: 'var(--logo-size-splash)',
  language: 'var(--logo-size-language)',
  login: 'var(--logo-size-login)',
  onboarding: 'var(--logo-size-onboarding)',
  'app-header': 'var(--logo-size-app-header)',
  canvas: 'var(--logo-size-canvas)',
}

function Logo({ size = 'app-header', withGlow = false, wordmark = false, className = '' }) {
  const sizeVar = SIZE_VAR[size] || size

  return (
    <div
      className={['logo', withGlow && 'logo--glow', wordmark && 'logo--wordmark', className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--logo-w': typeof sizeVar === 'string' && sizeVar.startsWith('var') ? sizeVar : `${sizeVar}px` }}
      role="img"
      aria-label="Nuzio AI logo"
    >
      <div className="logo-icon" aria-hidden="true">
        <svg viewBox="0 0 86 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-mark">
          <defs>
            <linearGradient id="nuzio-bars" x1="10" y1="8" x2="58" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8E7BFF" />
              <stop offset="1" stopColor="#C9B8FF" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="82" height="50" rx="16" fill="#0b0c12" />
          <g opacity="0.98">
            <rect x="12" y="18" width="7" height="18" rx="3.5" fill="url(#nuzio-bars)" />
            <rect x="22" y="15" width="7" height="24" rx="3.5" fill="url(#nuzio-bars)" />
            <rect x="32" y="12" width="7" height="30" rx="3.5" fill="url(#nuzio-bars)" />
            <rect x="42" y="18" width="7" height="18" rx="3.5" fill="url(#nuzio-bars)" />
            <rect x="52" y="14" width="7" height="26" rx="3.5" fill="url(#nuzio-bars)" />
            <rect x="62" y="20" width="7" height="14" rx="3.5" fill="url(#nuzio-bars)" />
          </g>
        </svg>
      </div>
      {wordmark && (
        <span className="logo-wordmark" aria-label="Nuzio AI">
          <span className="logo-wordmark-main">Nuzio</span>
          <span className="logo-wordmark-accent">AI</span>
        </span>
      )}
    </div>
  )
}

export default Logo