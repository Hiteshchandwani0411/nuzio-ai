import './PageContainer.css'

function PageContainer({ size = 'standard', as: Tag = 'div', className = '', children, ...props }) {
  const normalizedSize = ['narrow', 'standard', 'wide'].includes(size) ? size : 'standard'
  return (
    <Tag
      className={`page-container page-container--${normalizedSize} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default PageContainer
