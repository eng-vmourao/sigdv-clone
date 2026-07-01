import { useState, useEffect } from 'react'

/**
 * Seção colapsável — accordion pattern (como no SIGDV original)
 */
export default function CollapsibleSection({ title, children, defaultOpen = false, storageKey = null }) {
  const [isOpen, setIsOpen] = useState(() => {
    if (storageKey) {
      const saved = sessionStorage.getItem(`collapsible_${storageKey}`)
      if (saved !== null) {
        return saved === 'true'
      }
    }
    return defaultOpen
  })

  useEffect(() => {
    if (storageKey) {
      sessionStorage.setItem(`collapsible_${storageKey}`, isOpen)
    }
  }, [isOpen, storageKey])

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
