import React, { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import type { Theme } from '../stores/editorStore'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun size={13} />, label: 'Light' },
    { value: 'dark', icon: <Moon size={13} />, label: 'Dark' },
    { value: 'system', icon: <Monitor size={13} />, label: 'System' },
  ]

  return (
    <div className="theme-group" role="group" aria-label="Theme switcher">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`theme-btn ${theme === opt.value ? 'active' : ''}`}
          onClick={() => setTheme(opt.value)}
          title={`${opt.label} theme`}
          id={`theme-${opt.value}`}
          aria-pressed={theme === opt.value}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}
