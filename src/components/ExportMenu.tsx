import React, { useState, useRef, useEffect } from 'react'
import {
  Download, FileText, FileType2, ChevronDown,
  FileJson2, Loader2
} from 'lucide-react'

interface ExportMenuProps {
  onExportMarkdown: () => void
  onExportPdf: () => Promise<void>
  onExportDocx: () => Promise<void>
}

export function ExportMenu({ onExportMarkdown, onExportPdf, onExportDocx }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
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

  const handle = async (key: string, fn: () => Promise<void> | void) => {
    setLoading(key)
    setOpen(false)
    try {
      await fn()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="dropdown" ref={ref}>
      <button
        className="btn btn-primary"
        onClick={() => setOpen((o) => !o)}
        id="export-menu-btn"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={14} />}
        <span className="btn-label">Export</span>
        <ChevronDown size={12} style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-label">Export As</div>

          <button
            className="dropdown-item"
            role="menuitem"
            id="export-pdf-btn"
            onClick={() => handle('pdf', onExportPdf)}
            disabled={loading !== null}
          >
            <FileType2 size={15} style={{ color: '#ef4444' }} />
            <span>PDF Document</span>
            <kbd style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5, fontFamily: 'var(--font-mono)' }}>⌘P</kbd>
          </button>

          <button
            className="dropdown-item"
            role="menuitem"
            id="export-docx-btn"
            onClick={() => handle('docx', onExportDocx)}
            disabled={loading !== null}
          >
            <FileText size={15} style={{ color: '#2563eb' }} />
            <span>Word Document</span>
            <kbd style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5, fontFamily: 'var(--font-mono)' }}>⌘D</kbd>
          </button>

          <div className="dropdown-divider" />

          <button
            className="dropdown-item"
            role="menuitem"
            id="export-md-btn"
            onClick={() => handle('md', () => { onExportMarkdown(); return Promise.resolve() })}
            disabled={loading !== null}
          >
            <FileJson2 size={15} style={{ color: '#6366f1' }} />
            <span>Markdown File</span>
            <kbd style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5, fontFamily: 'var(--font-mono)' }}>⌘S</kbd>
          </button>
        </div>
      )}
    </div>
  )
}
