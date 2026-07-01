import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { languages } from '@codemirror/language-data'
import {
  FileText,
  Palette,
  RotateCcw,
  Type,
  Sparkles,
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Minus,
} from 'lucide-react'
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
    setMarkdown: rawSetMarkdown,
    setCustomCss: rawSetCustomCss,
    setActiveTab,
    resetCss,
  } = useEditorStore()

  const isDark = useIsDark()
  const cmRef = useRef<ReactCodeMirrorRef>(null)

  // Debounce store updates to avoid re-compiling the preview on every keystroke
  const mdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cssTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setMarkdown = useCallback((val: string) => {
    if (mdTimerRef.current) clearTimeout(mdTimerRef.current)
    mdTimerRef.current = setTimeout(() => rawSetMarkdown(val), 150)
  }, [rawSetMarkdown])

  const setCustomCss = useCallback((val: string) => {
    if (cssTimerRef.current) clearTimeout(cssTimerRef.current)
    cssTimerRef.current = setTimeout(() => rawSetCustomCss(val), 150)
  }, [rawSetCustomCss])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (mdTimerRef.current) clearTimeout(mdTimerRef.current)
      if (cssTimerRef.current) clearTimeout(cssTimerRef.current)
    }
  }, [])

  const wordCount = useMemo(() => countWords(mdContent), [mdContent])
  const charCount = useMemo(() => countChars(mdContent), [mdContent])

  const insertMarkdown = useCallback((before: string, after: string = '', placeholder: string = '') => {
    if (!cmRef.current) return

    const view = cmRef.current.view
    if (!view) return

    const { state, dispatch } = view
    const range = state.selection.main
    const selectedText = state.doc.sliceString(range.from, range.to)
    const newText = `${before}${selectedText || placeholder}${after}`

    dispatch({
      changes: {
        from: range.from,
        to: range.to,
        insert: newText,
      },
    })
  }, [])

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

          {/* AI Copilot Tab */}
          <button
            className={`tab tab-ai ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
            id="tab-ai"
            aria-selected={activeTab === 'ai'}
          >
            <Sparkles size={13} />
            <span className="tab-ai-label">AI Copilot</span>
            {activeTab === 'ai' && <span className="tab-ai-pip" />}
          </button>
        </div>
      </div>

      {/* Markdown toolbar */}
      {activeTab === 'markdown' && (
        <div className="markdown-toolbar">
          <div className="toolbar-group">
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('# ', '', 'Heading 1')}
              title="Heading 1"
              aria-label="Insert Heading 1"
            >
              <Heading1 size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('## ', '', 'Heading 2')}
              title="Heading 2"
              aria-label="Insert Heading 2"
            >
              <Heading2 size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('### ', '', 'Heading 3')}
              title="Heading 3"
              aria-label="Insert Heading 3"
            >
              <Heading3 size={14} />
            </button>
            <div className="toolbar-divider" />
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('**', '**', 'bold')}
              title="Bold"
              aria-label="Insert Bold"
            >
              <Bold size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('*', '*', 'italic')}
              title="Italic"
              aria-label="Insert Italic"
            >
              <Italic size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('`', '`', 'code')}
              title="Inline Code"
              aria-label="Insert Inline Code"
            >
              <Code size={14} />
            </button>
            <div className="toolbar-divider" />
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('- ', '', 'List item')}
              title="Bullet List"
              aria-label="Insert Bullet List"
            >
              <List size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('1. ', '', 'List item')}
              title="Numbered List"
              aria-label="Insert Numbered List"
            >
              <ListOrdered size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('> ', '', 'Quote')}
              title="Blockquote"
              aria-label="Insert Blockquote"
            >
              <Quote size={14} />
            </button>
            <div className="toolbar-divider" />
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('[', '](url)', 'link text')}
              title="Link"
              aria-label="Insert Link"
            >
              <Link size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('![', '](url)', 'alt text')}
              title="Image"
              aria-label="Insert Image"
            >
              <Image size={14} />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => insertMarkdown('\n---\n')}
              title="Horizontal Rule"
              aria-label="Insert Horizontal Rule"
            >
              <Minus size={14} />
            </button>
          </div>
        </div>
      )}

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
                ref={cmRef}
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
