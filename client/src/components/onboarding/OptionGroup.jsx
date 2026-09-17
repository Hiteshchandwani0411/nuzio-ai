import './OptionGroup.css'

function OptionGroup({ children, className = '' }) {
  return (
    <div className={`option-group ${className}`.trim()} role="group">
      {children}
    </div>
  )
}

export default OptionGroup