import React, { useState, useRef, useEffect } from 'react'
import { LayoutTemplate, ChevronDown, AlertTriangle } from 'lucide-react'
import { TEMPLATES } from '../features/templates/templates'
import { useEditorStore } from '../stores/editorStore'

export function TemplateSelector() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null)
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
      setPendingTemplate(content)
      setModalOpen(true)
      return
    }
    loadTemplate(content)
    setOpen(false)
  }

  const confirmReplace = () => {
    if (pendingTemplate) loadTemplate(pendingTemplate)
    setModalOpen(false)
    setPendingTemplate(null)
    setOpen(false)
  }

  const cancelReplace = () => {
    setModalOpen(false)
    setPendingTemplate(null)
  }

  return (
    <>
      <div className="dropdown" ref={ref}>
        <button
          className="btn btn-ghost"
          onClick={() => setOpen((o) => !o)}
          id="template-selector-btn"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <LayoutTemplate size={14} />
          <span className="btn-label">Templates</span>
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

      {modalOpen && (
        <div className="template-modal-overlay" onClick={cancelReplace}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-icon">
              <AlertTriangle size={24} />
            </div>
            <h3 className="template-modal-title">Replace Current Content?</h3>
            <p className="template-modal-desc">
              Your current editor content will be replaced with this template.
            </p>
            <div className="template-modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={cancelReplace}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={confirmReplace}>
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
