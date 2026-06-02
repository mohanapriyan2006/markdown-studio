import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      className="theme-btn active"
      onClick={handleToggle}
      title={`${isDark ? 'Dark' : 'Light'} theme — click to toggle`}
      id="theme-toggle"
      aria-label={`${isDark ? 'Dark' : 'Light'} theme`}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} /> }
    </button>
  )
}
