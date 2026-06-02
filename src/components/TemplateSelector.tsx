import React, { useState, useRef, useEffect } from 'react'
import {
  LayoutTemplate, ChevronDown,
  Package, User, ClipboardList, BookText, Newspaper, BarChart3, FileCog, Briefcase, GitBranch,
  Layers, X, Check,
} from 'lucide-react'
import { TEMPLATES } from '../features/templates/templates'
import { useEditorStore } from '../stores/editorStore'

const TEMPLATE_ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Package,
  User,
  ClipboardList,
  BookText,
  Newspaper,
  BarChart3,
  FileCog,
  Briefcase,
  GitBranch,
}

function TemplateIcon({ name }: { name: string }) {
  const Icon = TEMPLATE_ICON_MAP[name]
  return Icon ? <Icon size={16} /> : <LayoutTemplate size={16} />
}

export function TemplateSelector() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState<{ name: string; content: string } | null>(null)
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

  const handleSelect = (t: { name: string; content: string }) => {
    const hasContent = markdown.trim().length > 0
    if (hasContent) {
      setPendingTemplate(t)
      setModalOpen(true)
      return
    }
    loadTemplate(t.content)
    setOpen(false)
  }

  const confirmReplace = () => {
    if (pendingTemplate) loadTemplate(pendingTemplate.content)
    setModalOpen(false)
    setPendingTemplate(null)
    setOpen(false)
  }

  const cancelReplace = () => {
    setModalOpen(false)
    setPendingTemplate(null)
  }

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && modalOpen) {
        cancelReplace()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [modalOpen])

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
                onClick={() => handleSelect({ name: t.name, content: t.content })}
              >
                <TemplateIcon name={t.icon} />
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
          <div className="template-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="template-modal-title">
            <button
              className="template-modal-close"
              onClick={cancelReplace}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            <div className="template-modal-icon">
              <Layers size={28} />
            </div>

            <h3 id="template-modal-title" className="template-modal-title">
              Replace with {pendingTemplate?.name ?? 'Template'}?
            </h3>
            <p className="template-modal-desc">
              Your current editor content will be replaced. This action cannot be undone.
            </p>

            <div className="template-modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={cancelReplace}>
                <X size={13} />
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={confirmReplace}>
                <Check size={13} />
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
