import React from 'react'
import { Eye, FileText } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { IframePreview } from './IframePreview'
import { ExportMenu } from '../../components/ExportMenu'
import { exportPdf } from '../export/exportPdf'
import { exportDocx } from '../export/exportDocx'
import { exportMarkdown } from '../export/exportMarkdown'
import { exportHtml } from '../export/exportHtml'

export function PreviewPanel() {
  const { markdown: mdContent, customCss } = useEditorStore()
  const isEmpty = !mdContent.trim()

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="panel-header">
        <Eye size={13} style={{ color: 'var(--text-muted)' }} />
        <span className="panel-title" style={{ marginLeft: 6 }}>Live Preview</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-glow 2s ease infinite' }} />
          Live
        </span>
      </div>

      {/* Preview — isolated in an iframe so custom CSS cannot leak */}
      <div className="preview-container preview-light" style={{ position: 'relative' }}>
        {isEmpty ? (
          <div className="preview-empty">
            <div className="preview-empty-icon">
              <FileText size={28} />
            </div>
            <p>Start typing to see your preview</p>
            <span style={{ fontSize: 12 }}>Supports GFM, tables, task lists &amp; code blocks</span>
          </div>
        ) : (
          <IframePreview markdown={mdContent} customCss={customCss} />
        )}

        {/* Floating Export Button (mobile only) */}
        <div className="preview-export-menu">
          <ExportMenu
            onExportMarkdown={() => exportMarkdown(mdContent)}
            onExportPdf={() => exportPdf(mdContent, customCss)}
            onExportDocx={() => exportDocx(mdContent, customCss)}
            onExportHtml={() => exportHtml(mdContent, customCss)}
          />
        </div>
      </div>
    </div>
  )
}
