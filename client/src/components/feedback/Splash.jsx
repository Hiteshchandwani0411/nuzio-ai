import Logo from '../ui/Logo'
import './Splash.css'

function Splash({ label }) {
  return (
    <div className="splash" role="status" aria-live="polite">
      <div className="splash-glow" aria-hidden="true" />
      <Logo size="splash" />
      {label && <p className="splash-label">{label}</p>}
    </div>
  )
}

export default Splash