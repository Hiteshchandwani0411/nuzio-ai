import './Divider.css'

function Divider({ orientation = 'horizontal', className = '' }) {
  return (
    <hr
      className={['divider', `divider--${orientation}`, className].filter(Boolean).join(' ')}
      role="separator"
      aria-orientation={orientation}
    />
  )
}

export default Divider