import './StepIndicator.css'

function StepIndicator({ step = 0, total = 1 }) {
  return (
    <div
      className="step-indicator"
      role="progressbar"
      aria-valuenow={Math.min(step + 1, total)}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${Math.min(step + 1, total)} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={['step-bar', i <= step && 'step-bar--filled'].filter(Boolean).join(' ')}
        />
      ))}
    </div>
  )
}

export default StepIndicator