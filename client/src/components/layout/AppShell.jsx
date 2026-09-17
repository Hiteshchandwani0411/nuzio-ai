import './AppShell.css'

function AppShell({ header = null, bottomNav = null, player = null, children }) {
  return (
    <div className={['app-shell', player && 'app-shell--has-player'].filter(Boolean).join(' ')}>
      {header}
      <main className="app-main">{children}</main>
      {player && <div className="app-player">{player}</div>}
      {bottomNav}
    </div>
  )
}

export default AppShell