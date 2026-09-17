import Logo from '../ui/Logo'
import './Header.css'

function Header({ actions, children, className = '' }) {
  return (
    <header className={['app-header', className].filter(Boolean).join(' ')}>
      <div className="page-container app-header-inner">
        <Logo size="app-header" wordmark />
        {children && <div className="app-header-center">{children}</div>}
        {actions && <div className="app-header-actions">{actions}</div>}
      </div>
    </header>
  )
}

export default Header