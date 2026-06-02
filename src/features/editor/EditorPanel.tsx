import React, { useCallback, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { languages } from '@codemirror/language-data'
import { FileText, Palette, RotateCcw, Type } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { countWords, countChars } from '../../lib/utils'
import { AICopilot } from '../ai/AICopilot'

function useIsDark() {
  return document.documentElement.classList.contains('dark')
}

export function EditorPanel() {
  const {
    markdown: mdContent,
    customCss,
    activeTab,
    setMarkdown,
    setCustomCss,
    setActiveTab,
    resetCss,
  } = useEditorStore()

  const isDark = useIsDark()

  const wordCount = useMemo(() => countWords(mdContent), [mdContent])
  const charCount = useMemo(() => countChars(mdContent), [mdContent])

  const markdownExtensions = useMemo(
    () => [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      EditorView.lineWrapping,
    ],
    []
  )

  const cssExtensions = useMemo(
    () => [css(), EditorView.lineWrapping],
    []
  )

  const baseTheme = useMemo(
    () =>
      EditorView.theme({
        '&': {
          height: '100%',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '13.5px',
        },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { padding: '12px 0' },
        '.cm-line': { padding: '0 16px' },
        '.cm-gutters': {
          background: 'var(--bg-muted)',
          borderRight: '1px solid var(--border)',
          color: 'var(--text-muted)',
        },
        '.cm-activeLineGutter': { background: 'var(--bg-hover)' },
        '.cm-activeLine': { background: 'var(--bg-hover)' },
        '.cm-cursor': { borderLeftColor: 'var(--accent)' },
        '.cm-selectionBackground': { background: 'var(--accent-light) !important' },
        '&.cm-focused': { outline: 'none' },
      }),
    []
  )

  const lightTheme = useMemo(
    () =>
      EditorView.theme({
        '&': { background: 'var(--bg-base)', color: 'var(--text-primary)' },
        '.cm-gutters': { background: 'var(--bg-muted)', color: 'var(--text-muted)' },
      }),
    []
  )

  const isAiTab = activeTab === 'ai'

  return (
    <div className="panel panel-left" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Tab bar */}
      <div className="panel-header">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'markdown' ? 'active' : ''}`}
            onClick={() => setActiveTab('markdown')}
            id="tab-markdown"
            aria-selected={activeTab === 'markdown'}
          >
            <FileText size={13} />
            Markdown
          </button>
          <button
            className={`tab ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
            id="tab-css"
            aria-selected={activeTab === 'css'}
          >
            <Palette size={13} />
            Custom CSS
          </button>

          {/* ✦ AI Copilot Tab — animated */}
          <button
            className={`tab tab-ai ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
            id="tab-ai"
            aria-selected={activeTab === 'ai'}
          >
            <span className="tab-ai-sparkle">✦</span>
            <span className="tab-ai-label">AI Copilot</span>
            {activeTab === 'ai' && <span className="tab-ai-pip" />}
          </button>
        </div>
      </div>

      {/* CSS toolbar */}
      {activeTab === 'css' && (
        <div className="css-toolbar">
          <span className="css-toolbar-label">styles applied instantly to preview</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={resetCss}
            title="Reset CSS to defaults"
            id="reset-css-btn"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      )}

      {/* Content area */}
      {isAiTab ? (
        <AICopilot />
      ) : (
        <>
          <div className="editor-container">
            {activeTab === 'markdown' ? (
              <CodeMirror
                value={mdContent}
                onChange={setMarkdown}
                extensions={markdownExtensions}
                theme={isDark ? [oneDark, baseTheme] : [baseTheme, lightTheme]}
                height="100%"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: true,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  rectangularSelection: false,
                  crosshairCursor: false,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                  closeBracketsKeymap: true,
                  searchKeymap: true,
                  foldKeymap: true,
                  completionKeymap: true,
                  lintKeymap: true,
                }}
                style={{ height: '100%' }}
              />
            ) : (
              <CodeMirror
                value={customCss}
                onChange={setCustomCss}
                extensions={cssExtensions}
                theme={isDark ? [oneDark, baseTheme] : [baseTheme, lightTheme]}
                height="100%"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  autocompletion: true,
                  highlightActiveLine: true,
                }}
                style={{ height: '100%' }}
              />
            )}
          </div>

          {/* Status bar */}
          <div className="status-bar">
            <span className="status-item">
              <span className="status-dot" />
              Auto-saved
            </span>
            {activeTab === 'markdown' && (
              <>
                <span className="status-item">
                  <Type size={10} />
                  {wordCount} words
                </span>
                <span className="status-item">
                  {charCount} chars
                </span>
              </>
            )}
            {activeTab === 'css' && (
              <span className="status-item">
                <Palette size={10} />
                {countChars(customCss)} chars
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
