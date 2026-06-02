import React, { useState, useRef, useEffect } from 'react'
import { LayoutTemplate, ChevronDown } from 'lucide-react'
import { TEMPLATES } from '../features/templates/templates'
import { useEditorStore } from '../stores/editorStore'

export function TemplateSelector() {
  const [open, setOpen] = useState(false)
  const { loadTemplate, markdown } = useEditorStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (content: string) => {
    const hasContent = markdown.trim().length > 0
    if (hasContent) {
      if (!window.confirm('Replace current content with this template?')) return
    }
    loadTemplate(content)
    setOpen(false)
  }

  return (
    <div className="dropdown" ref={ref}>
      <button
        className="btn btn-ghost"
        onClick={() => setOpen((o) => !o)}
        id="template-selector-btn"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <LayoutTemplate size={14} />
        Templates
        <ChevronDown
          size={12}
          style={{
            opacity: 0.7,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {open && (
        <div className="dropdown-menu" role="menu" style={{ minWidth: 220 }}>
          <div className="dropdown-label">Choose a Template</div>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className="dropdown-item"
              role="menuitem"
              id={`template-${t.id}`}
              onClick={() => handleSelect(t.content)}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                  {t.name}
                </span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                  {t.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
