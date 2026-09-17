import { Link } from 'react-router-dom'
import './Button.css'

function ButtonLink({
  to,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, fullWidth && 'btn--block', className]
    .filter(Boolean)
    .join(' ')
  return (
    <Link to={to} className={classes} {...props}>
      {children}
    </Link>
  )
}

export default ButtonLink
