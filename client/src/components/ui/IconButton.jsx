import './IconButton.css'

function IconButton({
  label,
  'aria-label': ariaLabel = label,
  size = 'md',
  variant = 'ghost',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={['icon-btn', `icon-btn--${variant}`, `icon-btn--${size}`]
        .filter(Boolean)
        .join(' ')}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton