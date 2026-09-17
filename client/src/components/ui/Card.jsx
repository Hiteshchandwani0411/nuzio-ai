import './Card.css'

function Card({
  variant = 'default',
  interactive = false,
  selected = false,
  className = '',
  as: Tag = 'div',
  children,
  ...props
}) {
  const classes = [
    'card',
    `card--${variant}`,
    interactive && 'card--interactive',
    selected && 'card--selected',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (interactive && Tag === 'div') {
    return (
      <div
        className={classes}
        role="button"
        tabIndex={0}
        aria-pressed={selected || undefined}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  )
}

export default Card