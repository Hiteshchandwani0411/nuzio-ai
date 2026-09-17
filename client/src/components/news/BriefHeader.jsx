import { Badge } from '../ui'
import { Skeleton } from '../feedback'
import './BriefHeader.css'

function splitGreeting(greeting) {
  const commaIndex = (greeting || '').indexOf(',')
  if (commaIndex === -1) return { lead: `${greeting || ''} `, rest: '' }
  return {
    lead: `${greeting.slice(0, commaIndex + 1)} `,
    rest: greeting.slice(commaIndex + 1),
  }
}

function BriefHeader({ brief, provider, loading = false }) {
  if (loading || !brief) {
    return (
      <header className="brief-header" aria-busy="true">
        <Skeleton variant="text" width="90%" height={14} className="brief-kicker-skeleton" />
        <Skeleton variant="text" width="70%" height={40} />
        <Skeleton variant="text" width="40%" height={12} />
      </header>
    )
  }

  const { lead, rest } = splitGreeting(brief.greeting)

  return (
    <header className="brief-header">
      <p className="brief-kicker">Morning Brief</p>
      <h1 className="brief-title">
        {lead}
        {rest ? <em>{rest}</em> : null}
      </h1>
      <div className="brief-meta">
        <span>{brief.date}</span>
        <span className="brief-meta-sep" aria-hidden="true">
          ·
        </span>
        <span>
          {brief.storyCount} stories · {brief.minReadMinutes} min read
        </span>
        {provider?.mode === 'live' ? (
          <Badge variant="live">Live</Badge>
        ) : provider ? (
          <Badge variant="status">Sample</Badge>
        ) : null}
      </div>
    </header>
  )
}

export default BriefHeader