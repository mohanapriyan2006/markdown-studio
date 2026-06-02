import React, { useRef, useState, useCallback, useEffect } from 'react'
import { FileText, Eye } from 'lucide-react'
import { Header } from './components/Header'
import { EditorPanel } from './features/editor/EditorPanel'
import { PreviewPanel } from './features/preview/PreviewPanel'
import { AboutPage } from './pages/AboutPage'
import { useEditorStore } from './stores/editorStore'
import { useTheme } from './hooks/useTheme'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { exportMarkdown } from './features/export/exportMarkdown'
import { exportPdf } from './features/export/exportPdf'
import { exportDocx } from './features/export/exportDocx'
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  useTheme()

  const { markdown, customCss, setMarkdown } = useEditorStore()
  const previewRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState<'editor' | 'about'>('editor')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')

  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(50) // percent
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<HTMLDivElement>(null)
  const mobileViewRef = useRef(mobileView)
  mobileViewRef.current = mobileView

  // Export handlers
  const handleExportMarkdown = useCallback(() => {
    exportMarkdown(markdown)
  }, [markdown])

  const handleExportPdf = useCallback(async () => {
    const isMobile = window.innerWidth <= 768
    if (isMobile && mobileViewRef.current === 'editor') {
      setMobileView('preview')
      await new Promise((r) => requestAnimationFrame(r))
      await new Promise((r) => setTimeout(r, 50))
    }
    if (!previewRef.current) {
      alert('Nothing to export yet — write some Markdown first.')
      return
    }
    await exportPdf(previewRef.current, customCss)
  }, [customCss])

  const handleExportDocx = useCallback(async () => {
    await exportDocx(markdown)
  }, [markdown])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'save') handleExportMarkdown()
      if (action === 'pdf') handleExportPdf()
      if (action === 'docx') handleExportDocx()
    },
  })

  // Resizer drag logic
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    if (resizerRef.current) resizerRef.current.classList.add('dragging')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newLeft = ((e.clientX - rect.left) / rect.width) * 100
      setLeftWidth(Math.min(Math.max(newLeft, 25), 75))
    }

    const handleMouseUp = () => {
      isDragging.current = false
      if (resizerRef.current) resizerRef.current.classList.remove('dragging')
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className="app">
      <Header
        onUpload={setMarkdown}
        onExportMarkdown={handleExportMarkdown}
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onAbout={() => setPage('about')}
        onHome={() => setPage('editor')}
      />

      {page === 'about' ? (
        <AboutPage onBack={() => setPage('editor')} />
      ) : (
        <>
          {/* Mobile view toggle tabs */}
          <div className="mobile-tabs" role="tablist" aria-label="Editor and Preview">
            <button
              className={`mobile-tab ${mobileView === 'editor' ? 'active' : ''}`}
              onClick={() => setMobileView('editor')}
              role="tab"
              aria-selected={mobileView === 'editor'}
            >
              <FileText size={13} />
              Editor
            </button>
            <button
              className={`mobile-tab ${mobileView === 'preview' ? 'active' : ''}`}
              onClick={() => setMobileView('preview')}
              role="tab"
              aria-selected={mobileView === 'preview'}
            >
              <Eye size={13} />
              Preview
            </button>
          </div>

          <main
            className="workspace"
            ref={containerRef}
            role="main"
            data-mobile-view={mobileView}
          >
            {/* Left panel */}
            <div
              className="workspace-panel workspace-panel-editor"
              style={{
                width: `${leftWidth}%`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <EditorPanel />
            </div>

            {/* Resizer */}
            <div
              ref={resizerRef}
              className="resizer"
              onMouseDown={handleMouseDown}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize panels"
              title="Drag to resize panels"
            />

            {/* Right panel */}
            <div className="workspace-panel workspace-panel-preview" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
              <PreviewPanel previewRef={previewRef} />
            </div>
          </main>
        </>
      )}

      <Analytics />
    </div>
  )
}
