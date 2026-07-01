import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar isCollapsed={sidebarCollapsed} />
      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="app-content">
          <Outlet />
        </main>
        <footer className="footer">
          Copyright © 2024 <a href="#">DER</a>. Todos os direitos reservados.
          <span style={{ float: 'right' }}>Version 1.1.0</span>
        </footer>
      </div>
    </div>
  )
}
