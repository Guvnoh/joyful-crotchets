import { useEffect } from 'react'

interface Shortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  handler: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue
        const ctrlOrMeta = shortcut.ctrl || shortcut.meta
        const matchesCtrl = ctrlOrMeta ? (e.ctrlKey || e.metaKey) : true
        const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (matchesCtrl && matchesKey) {
          e.preventDefault()
          shortcut.handler()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
