export default function Header({ onToggleSidebar }) {
  return (
    <header className="header">
      <button className="header-toggle" title="Menu" onClick={onToggleSidebar}>☰</button>
      <div className="header-search">
        <input type="text" placeholder="Pesquisar..." />
      </div>
      <div className="header-actions">
        <button className="header-toggle" title="Buscar">🔍</button>
        <button className="header-toggle" title="Configurações">⚙️</button>
        <div className="header-user">
          <span>👤</span>
          <span>admin ▾</span>
        </div>
      </div>
    </header>
  )
}
