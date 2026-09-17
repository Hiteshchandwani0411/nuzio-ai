import './Avatar.css'

const SIZE_MAP = { sm: 32, md: 40, lg: 56 }
const INITIAL_BG = 'linear-gradient(135deg, #7c5cff 0%, #36d9c8 100%)'

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length === 1 ? parts[0][0].toUpperCase() : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function Avatar({ name, src, size = 'md', status, className = '' }) {
  const px = SIZE_MAP[size] || SIZE_MAP.md
  const initials = getInitials(name)

  return (
    <div className={['avatar', `avatar--${size}`, className].filter(Boolean).join(' ')} style={{ width: px, height: px }}>
      {src ? (
        <img src={src} alt={name || ''} className="avatar-img" />
      ) : (
        <span className="avatar-initials" aria-hidden="true" style={{ background: INITIAL_BG }}>
          {initials}
        </span>
      )}
      {status && <span className="avatar-status" aria-label={status === true ? 'online' : status} />}
    </div>
  )
}

export default Avatar