import './ProgressBar.css'

function ProgressBar({
  value = 0,
  max = 0,
  onChange,
  disabled = false,
  label = 'Seek within story',
}) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0
  const safeValue = Math.max(0, Math.min(safeMax, value))
  const pct = safeMax > 0 ? (safeValue / safeMax) * 100 : 0

  return (
    <div className="progress">
      <input
        type="range"
        className="progress-slider"
        min={0}
        max={safeMax}
        step={0.1}
        value={safeValue}
        disabled={disabled || safeMax === 0}
        aria-label={label}
        onChange={(e) => {
          if (onChange && safeMax > 0) onChange(Number(e.target.value))
        }}
      />
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar