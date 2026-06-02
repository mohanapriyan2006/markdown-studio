import React, { useRef, useId } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Eye, FileText } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

interface PreviewPanelProps {
  previewRef: React.RefObject<HTMLDivElement | null>
}

export function PreviewPanel({ previewRef }: PreviewPanelProps) {
  const { markdown: mdContent, customCss } = useEditorStore()
  const styleId = useId()

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

      {/* Preview — always rendered in light mode */}
      <div
        className="preview-container"
        style={{
          /* Force light-mode CSS variables so dark theme never bleeds into the preview */
          '--bg-base': '#ffffff',
          '--bg-card': '#f8fafc',
          '--bg-muted': '#f1f5f9',
          '--bg-hover': '#e8eef6',
          '--border': '#e2e8f0',
          '--border-focus': '#6366f1',
          '--text-primary': '#0f172a',
          '--text-secondary': '#475569',
          '--text-muted': '#94a3b8',
          '--accent': '#6366f1',
          '--accent-hover': '#4f46e5',
          '--accent-light': '#eef2ff',
          '--accent-glow': 'rgba(99,102,241,0.15)',
          background: '#ffffff',
          color: '#0f172a',
        } as React.CSSProperties}
      >
        {/* Inject custom CSS */}
        {customCss && (
          <style
            id={`custom-css-${styleId}`}
            dangerouslySetInnerHTML={{ __html: customCss }}
          />
        )}

        {isEmpty ? (
          <div className="preview-empty">
            <div className="preview-empty-icon">
              <FileText size={28} />
            </div>
            <p>Start typing to see your preview</p>
            <span style={{ fontSize: 12 }}>Supports GFM, tables, task lists &amp; code blocks</span>
          </div>
        ) : (
          <div
            ref={previewRef}
            className="markdown-body"
            id="markdown-preview"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                input: ({ type, checked, ...props }) => {
                  if (type === 'checkbox') {
                    return (
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        style={{ marginRight: 6, accentColor: '#6366f1' }}
                        {...props}
                      />
                    )
                  }
                  return <input type={type} {...props} />
                },
                a: ({ children, href, ...props }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                ),
                pre: ({ children, ...props }) => (
                  <pre {...props} style={{ position: 'relative' }}>
                    {children}
                  </pre>
                ),
              }}
            >
              {mdContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>

  )
}
