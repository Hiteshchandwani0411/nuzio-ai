import './Skeleton.css'

function Skeleton({ variant = 'card', width, height, className = '', ...rest }) {
  return (
    <div
      className={['skeleton', `skeleton--${variant}`, className].filter(Boolean).join(' ')}
      style={{ width, height }}
      aria-hidden="true"
      {...rest}
    />
  )
}

export default Skeleton