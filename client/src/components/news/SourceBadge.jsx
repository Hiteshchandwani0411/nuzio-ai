import './SourceBadge.css'

function SourceBadge({ source, url, className = '' }) {
  return (
    <span className={['source-badge', className].filter(Boolean).join(' ')} title={url || undefined}>
      {source}
    </span>
  )
}

export default SourceBadge