import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, Check, FileText, Palette, ChevronDown, ChevronUp, Replace, Plus, Sparkles } from 'lucide-react'
import type { ChatMessage } from '../../types/ai'
import { useEditorStore } from '../../stores/editorStore'

interface AIMessageProps {
  message: ChatMessage
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className="ai-code-copy" onClick={handle} title="Copy to clipboard">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function MarkdownOutputCard({ code }: { code: string }) {
  const { setMarkdown, markdown, setActiveTab, markSaved } = useEditorStore()
  const [preview, setPreview] = useState(false)

  const handleReplace = () => {
    setMarkdown(code)
    setActiveTab('markdown')
    markSaved()
  }
  const handleAppend = () => {
    setMarkdown(markdown + '\n\n' + code)
    setActiveTab('markdown')
    markSaved()
  }

  return (
    <div className="ai-output-card ai-output-md">
      <div className="ai-output-card-header">
        <span className="ai-output-badge ai-badge-md">
          <FileText size={11} />
          Markdown Output
        </span>
        <div className="ai-output-actions">
          <CopyButton text={code} />
          <button className="ai-output-btn" onClick={() => setPreview((v) => !v)} title="Toggle preview">
            {preview ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {preview ? 'Hide' : 'Preview'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="ai-output-preview markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{code}</ReactMarkdown>
        </div>
      )}

      <pre className="ai-output-code"><code>{code}</code></pre>

      <div className="ai-output-apply-row">
        <button
          className="ai-apply-btn ai-apply-replace"
          onClick={handleReplace}
          title="Replace editor content"
        >
          <Replace size={12} />
          Replace Document
        </button>
        <button
          className="ai-apply-btn ai-apply-append"
          onClick={handleAppend}
          title="Append to editor"
        >
          <Plus size={12} />
          Append
        </button>
      </div>
    </div>
  )
}

function CSSOutputCard({ code }: { code: string }) {
  const { setCustomCss, customCss, setActiveTab, markSaved } = useEditorStore()
  const [expanded, setExpanded] = useState(false)

  const handleReplace = () => {
    setCustomCss(code)
    setActiveTab('css')
    markSaved()
  }
  const handleAppend = () => {
    setCustomCss(customCss + '\n\n' + code)
    setActiveTab('css')
    markSaved()
  }

  return (
    <div className="ai-output-card ai-output-css">
      <div className="ai-output-card-header">
        <span className="ai-output-badge ai-badge-css">
          <Palette size={11} />
          CSS Output
        </span>
        <div className="ai-output-actions">
          <CopyButton text={code} />
          <button className="ai-output-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      </div>

      <pre className={`ai-output-code ${!expanded ? 'ai-output-code-collapsed' : ''}`}>
        <code>{code}</code>
      </pre>

      <div className="ai-output-apply-row">
        <button
          className="ai-apply-btn ai-apply-replace"
          onClick={handleReplace}
          title="Replace current CSS"
        >
          <Replace size={12} />
          Apply CSS
        </button>
        <button
          className="ai-apply-btn ai-apply-append"
          onClick={handleAppend}
          title="Append to CSS"
        >
          <Plus size={12} />
          Append CSS
        </button>
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="ai-loading-dots">
      <span /><span /><span />
    </div>
  )
}

export function AIMessage({ message }: AIMessageProps) {
  if (message.role === 'user') {
    return (
      <div className="ai-msg ai-msg-user">
        <div className="ai-msg-bubble ai-msg-bubble-user">
          {message.content}
        </div>
      </div>
    )
  }

  // Assistant message
  if (message.isLoading) {
    return (
      <div className="ai-msg ai-msg-assistant">
        <div className="ai-msg-avatar"><Sparkles size={14} /></div>
        <div className="ai-msg-bubble ai-msg-bubble-assistant">
          <LoadingDots />
        </div>
      </div>
    )
  }

  if (message.error) {
    return (
      <div className="ai-msg ai-msg-assistant">
        <div className="ai-msg-avatar"><Sparkles size={14} /></div>
        <div className="ai-msg-bubble ai-msg-bubble-error">
          {message.error}
        </div>
      </div>
    )
  }

  const parsed = message.parsed
  const hasStructuredOutput = parsed?.type === 'markdown' || parsed?.type === 'css' || parsed?.type === 'mixed'

  // Normal text response — render markdown directly without output cards
  if (!hasStructuredOutput) {
    return (
      <div className="ai-msg ai-msg-assistant">
        <div className="ai-msg-avatar"><Sparkles size={14} /></div>
        <div className="ai-msg-body">
          <div className="ai-msg-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    )
  }

  // Structured response with code blocks — show explanation + output cards
  const explanationText = parsed.rawText
    .replace(/```[\s\S]*?```/g, '')
    .trim()

  return (
    <div className="ai-msg ai-msg-assistant">
      <div className="ai-msg-avatar"><Sparkles size={14} /></div>
      <div className="ai-msg-body">
        {explanationText && (
          <div className="ai-msg-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{explanationText}</ReactMarkdown>
          </div>
        )}
        {parsed.markdownCode && <MarkdownOutputCard code={parsed.markdownCode} />}
        {parsed.cssCode && <CSSOutputCard code={parsed.cssCode} />}
      </div>
    </div>
  )
}
