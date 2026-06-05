import { useEffect, useCallback } from 'react'
import { useEditorStore } from '../stores/editorStore'

type Action = 'save' | 'pdf' | 'docx' | 'html'

interface UseKeyboardShortcutsOptions {
  onAction: (action: Action) => void
}

export function useKeyboardShortcuts({ onAction }: UseKeyboardShortcutsOptions) {
  const { markSaved } = useEditorStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return

      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault()
          markSaved()
          onAction('save')
          break
        case 'p':
          e.preventDefault()
          onAction('pdf')
          break
        case 'd':
          e.preventDefault()
          onAction('docx')
          break
        case 'h':
          e.preventDefault()
          onAction('html')
          break
      }
    },
    [onAction, markSaved]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
