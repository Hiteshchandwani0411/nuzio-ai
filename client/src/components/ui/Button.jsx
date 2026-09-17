import LoadingSpinner from '../feedback/LoadingSpinner'
import './Button.css'

function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled,
  fullWidth = false,
  children,
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--block',
    loading && 'btn--loading',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

export default Button