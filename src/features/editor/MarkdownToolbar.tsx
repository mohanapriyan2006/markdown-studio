import React from 'react'
import {
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

export function MarkdownToolbar() {
  const { markdown, setMarkdown } = useEditorStore()

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.querySelector('.cm-content') as HTMLElement
    if (!textarea) return

    // Get the CodeMirror editor instance
    const cmEditor = document.querySelector('.cm-editor')?.closest('.panel-left')
    if (!cmEditor) return

    // Create a temporary textarea to get selection
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''

    const prefix = selectedText || placeholder
    const newText = `${before}${prefix}${after}`

    // Dispatch input event to update the editor
    const event = new CustomEvent('insert-markdown', { detail: { text: newText } })
    window.dispatchEvent(event)
  }

  const formatText = (before: string, after: string, placeholder: string) => {
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''
    const prefix = selectedText || placeholder

    // Use execCommand approach for CodeMirror
    const cm = (window as any).cmInstance
    if (cm) {
      const range = cm.state.selection.main
      const line = cm.state.doc.lineAt(range.from)
      const lineText = cm.state.doc.sliceString(range.from, range.to)
      const newText = `${before}${lineText || placeholder}${after}`
      cm.dispatch({
        changes: {
          from: range.from,
          to: range.to,
          insert: newText,
        },
      })
    }
  }

  const handleFormat = (before: string, after: string, placeholder: string) => {
    // Get CodeMirror view from the editor
    const view = (window as any).cmView
    if (view) {
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
    }
  }

  const tools = [
    { icon: Heading1, label: 'H1', before: '# ', after: '', placeholder: 'Heading 1' },
    { icon: Heading2, label: 'H2', before: '## ', after: '', placeholder: 'Heading 2' },
    { icon: Heading3, label: 'H3', before: '### ', after: '', placeholder: 'Heading 3' },
    { icon: Bold, label: 'Bold', before: '**', after: '**', placeholder: 'bold text' },
    { icon: Italic, label: 'Italic', before: '*', after: '*', placeholder: 'italic text' },
    { icon: Code, label: 'Code', before: '`', after: '`', placeholder: 'code' },
    { icon: List, label: 'List', before: '- ', after: '', placeholder: 'List item' },
    { icon: ListOrdered, label: 'List', before: '1. ', after: '', placeholder: 'List item' },
    { icon: Quote, label: 'Quote', before: '> ', after: '', placeholder: 'Quote' },
    { icon: Link, label: 'Link', before: '[', after: '](url)', placeholder: 'link text' },
    { icon: Image, label: 'Image', before: '![', after: '](url)', placeholder: 'alt text' },
    { icon: Minus, label: 'HR', before: '\n---\n', after: '', placeholder: '' },
  ]

  return (
    <div className="markdown-toolbar">
      <div className="toolbar-group">
        {tools.map((tool, index) => (
          <button
            key={index}
            className="toolbar-btn"
            onClick={() => handleFormat(tool.before, tool.after, tool.placeholder)}
            title={tool.label}
            aria-label={`Insert ${tool.label}`}
          >
            <tool.icon size={14} />
          </button>
        ))}
      </div>
    </div>
  )
}