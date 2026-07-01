import { useState } from 'react'

/**
 * Seção colapsável — accordion pattern (como no SIGDV original)
 */
export default function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="collapsible-section">
      <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-toggle">{isOpen ? '−' : '+'}</span>
      </div>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {isOpen && children}
      </div>
    </div>
  )
}
