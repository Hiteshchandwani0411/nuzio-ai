import './Badge.css'

const VARIANT_MAP = {
  category: 'badge--category',
  source: 'badge--source',
  live: 'badge--live',
  status: 'badge--status',
  promotion: 'badge--promotion',
}

function Badge({ variant = 'category', children, className = '' }) {
  const classes = ['badge', VARIANT_MAP[variant], className].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      {variant === 'live' && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Badge