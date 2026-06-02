import { useEffect, useCallback } from 'react'
import { useEditorStore, type Theme } from '../stores/editorStore'

export function useTheme() {
  const { theme, setTheme } = useEditorStore()

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement
    if (t === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', dark)
    } else {
      root.classList.toggle('dark', t === 'dark')
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, applyTheme])

  return { theme, setTheme }
}
