import React from 'react'
import { Info } from 'lucide-react'
import { FileUploader } from './FileUploader'
import { ExportMenu } from './ExportMenu'
import { ThemeToggle } from './ThemeToggle'
import { TemplateSelector } from './TemplateSelector'
import { useEditorStore } from '../stores/editorStore'
import logoImg from '../assets/logo.png'

interface HeaderProps {
  onUpload: (content: string) => void
  onExportMarkdown: () => void
  onExportPdf: () => Promise<void>
  onExportDocx: () => Promise<void>
  onAbout: () => void
}

export function Header({ onUpload, onExportMarkdown, onExportPdf, onExportDocx, onAbout }: HeaderProps) {
  const { lastSaved } = useEditorStore()

  return (
    <header className="header" role="banner">
      {/* Logo */}
      <div className="header-logo">
        <img src={logoImg} alt="Markdown Studio" className="header-logo-img" />
        <span className="header-logo-text">
          Markdown <span>Studio</span>
        </span>
        <button
          className="header-info-btn"
          onClick={onAbout}
          title="About Markdown Studio"
        >
          <Info size={14} />
        </button>
      </div>

      {/* Center — saved status */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {lastSaved && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
            Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="header-actions">
        <TemplateSelector />
        <FileUploader onFileLoad={onUpload} />

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        <ExportMenu
          onExportMarkdown={onExportMarkdown}
          onExportPdf={onExportPdf}
          onExportDocx={onExportDocx}
        />

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        <ThemeToggle />
      </div>
    </header>
  )
}
