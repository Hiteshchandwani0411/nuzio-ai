import './LoadingSpinner.css'

function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <span
      className={['spinner', `spinner--${size}`, className].filter(Boolean).join(' ')}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
    </span>
  )
}

export default LoadingSpinner