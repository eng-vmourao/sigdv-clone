import { useState, useCallback, useEffect } from 'react'

/**
 * Hook para rastrear alterações não salvas e prevenir navegação acidental
 */
export default function useUnsavedChanges(initialState = false) {
  const [hasChanges, setHasChanges] = useState(initialState)

  // Previne fechamento da aba com alterações não salvas
  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = 'Existem alterações não salvas. Deseja sair?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasChanges])

  const markChanged = useCallback(() => setHasChanges(true), [])
  const markSaved = useCallback(() => setHasChanges(false), [])

  return { hasChanges, markChanged, markSaved }
}
