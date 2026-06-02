import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Header } from './components/Header'
import { EditorPanel } from './features/editor/EditorPanel'
import { PreviewPanel } from './features/preview/PreviewPanel'
import { useEditorStore } from './stores/editorStore'
import { useTheme } from './hooks/useTheme'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { exportMarkdown } from './features/export/exportMarkdown'
import { exportPdf } from './features/export/exportPdf'
import { exportDocx } from './features/export/exportDocx'

export default function App() {
  useTheme()

  const { markdown, customCss, setMarkdown } = useEditorStore()
  const previewRef = useRef<HTMLDivElement>(null)

  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(50) // percent
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<HTMLDivElement>(null)

  // Export handlers
  const handleExportMarkdown = useCallback(() => {
    exportMarkdown(markdown)
  }, [markdown])

  const handleExportPdf = useCallback(async () => {
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
      />

      <main
        className="workspace"
        ref={containerRef}
        role="main"
      >
        {/* Left panel */}
        <div
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <PreviewPanel previewRef={previewRef} />
        </div>
      </main>
    </div>
  )
}
