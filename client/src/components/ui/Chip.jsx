import { Check } from 'lucide-react'
import './Chip.css'

function Chip({ label, selected = false, disabled = false, icon, onClick }) {
  return (
    <button
      type="button"
      className={['chip', selected && 'chip--selected'].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
    >
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
      {selected && <Check size={14} className="chip-check" aria-hidden="true" />}
    </button>
  )
}

export default Chip