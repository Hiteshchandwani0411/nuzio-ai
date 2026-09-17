import { useId } from 'react'
import './Toggle.css'

function Toggle({ checked = false, onChange, disabled = false, label }) {
  const id = useId()

  return (
    <label className="toggle-row" htmlFor={id}>
      {label && <span className="toggle-label">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={['toggle', checked && 'toggle--on'].filter(Boolean).join(' ')}
        id={id}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
    </label>
  )
}

export default Toggle