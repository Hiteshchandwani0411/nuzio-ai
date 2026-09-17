import { NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import './BottomNavigation.css'

const ITEMS = [
  { to: '/home', label: 'Morning brief', Icon: Sparkles },
]

function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/home'}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' bottom-nav-item--active' : ''}`}
          aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
        >
          <Icon size={20} aria-hidden="true" />
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNavigation
