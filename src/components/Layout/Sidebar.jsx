import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const menuItems = [
  {
    label: 'Protocolos', icon: '📋', path: null,
    children: [
      { label: 'Todos os Protocolos', path: '/protocolos' },
      { label: 'Novo Protocolo', path: '/protocolos/novo' },
    ],
  },
  {
    label: 'Contrato', icon: '📄', path: null,
    children: [
      { label: 'Contratos', path: '/contratos' },
    ],
  },
  {
    label: 'Admin. e Jurídico', icon: '⚖️', path: null,
    children: [
      { label: 'Pareceres', path: '/admin/pareceres' },
    ],
  },
  {
    label: 'Gestão Operacional', icon: '📁', path: null,
    children: [
      { label: 'Relatórios', path: '/gestao/relatorios' },
    ],
  },
  {
    label: 'Cadastros Básicos', icon: '🗃️', path: null,
    children: [
      { label: 'Regionais', path: '/cadastros/regionais' },
      { label: 'Contratadas', path: '/cadastros/contratadas' },
    ],
  },
]

const bottomItems = [
  { label: 'Usuários', icon: '👤', path: '/usuarios' },
  { label: 'API', icon: '🔌', path: '/api' },
]

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({ 'Contrato': true })
  const location = useLocation()

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (path) => {
    if (!path) return false
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">S</div>
        <span className="sidebar-logo-text">SIGDV</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  className={`sidebar-item ${item.children.some(c => isActive(c.path)) ? 'active' : ''}`}
                  onClick={() => toggleMenu(item.label)}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className={`sidebar-chevron ${openMenus[item.label] ? 'open' : ''}`}>
                    ▸
                  </span>
                </button>
                <div className={`sidebar-submenu ${openMenus[item.label] ? 'open' : ''}`}>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive: active }) =>
                        `sidebar-item ${active ? 'active' : ''}`
                      }
                    >
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive: active }) =>
                  `sidebar-item ${active ? 'active' : ''}`
                }
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}

        <div className="sidebar-divider" />

        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive: active }) =>
              `sidebar-item ${active ? 'active' : ''}`
            }
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
