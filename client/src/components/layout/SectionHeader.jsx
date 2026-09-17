import './SectionHeader.css'

function SectionHeader({ label, action }) {
  return (
    <div className="section-header">
      <span className="section-label">{label}</span>
      {action && (
        <span className="section-action">
          {action}
        </span>
      )}
    </div>
  )
}

export default SectionHeader