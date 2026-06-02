import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Send, Trash2, Settings2, ChevronRight } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'
import { useEditorStore } from '../../stores/editorStore'
import { AIMessage } from './AIMessage'
import { sendAIMessage, parseAIResponse } from '../../services/ai/aiService'
import { QUICK_ACTIONS } from '../../types/ai'
import type { ChatMessage } from '../../types/ai'

function nanoid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function AIChatPanel() {
  const {
    config, messages, isGenerating,
    addMessage, updateLastMessage, clearMessages,
    setIsGenerating, setShowSettings, connectionStatus,
  } = useAIStore()

  const { markdown, customCss } = useEditorStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isGenerating])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [input])

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isGenerating) return

      const userMsg: ChatMessage = {
        id: nanoid(),
        role: 'user',
        content: userText.trim(),
        timestamp: Date.now(),
      }
      const loadingMsg: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isLoading: true,
      }

      addMessage(userMsg)
      addMessage(loadingMsg)
      setIsGenerating(true)
      setInput('')

      try {
        const responseText = await sendAIMessage(
          config,
          messages,
          userText.trim(),
          markdown,
          customCss
        )
        const parsed = parseAIResponse(responseText)
        updateLastMessage({
          content: responseText,
          parsed,
          isLoading: false,
          timestamp: Date.now(),
        })
      } catch (err) {
        updateLastMessage({
          content: '',
          isLoading: false,
          error: err instanceof Error ? err.message : 'Something went wrong',
        })
      } finally {
        setIsGenerating(false)
      }
    },
    [config, isGenerating, markdown, customCss, messages, addMessage, updateLastMessage, setIsGenerating]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const isConnected = connectionStatus === 'success' || config.apiKey.trim()

  return (
    <div className="ai-chat-panel">
      {/* Top bar */}
      <div className="ai-chat-topbar">
        <div className="ai-chat-status">
          <span className={`ai-status-dot ${isConnected ? 'ai-status-connected' : 'ai-status-idle'}`} />
          <span className="ai-status-label">
            {isConnected ? `${config.model || 'AI'}` : 'Not configured'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {messages.length > 0 && (
            <button
              className="ai-icon-btn"
              onClick={clearMessages}
              title="Clear chat history"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            className="ai-icon-btn"
            onClick={() => setShowSettings(true)}
            title="AI Settings"
          >
            <Settings2 size={13} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-messages-list">
        {messages.length === 0 && (
          <div className="ai-empty-chat">
            <div className="ai-empty-icon">✦</div>
            <p className="ai-empty-title">AI Copilot</p>
            <p className="ai-empty-sub">Ask anything about your document, generate content, or pick a quick action below.</p>
          </div>
        )}
        {messages.map((msg) => (
          <AIMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      <div className="ai-quick-actions">
        <div className="ai-quick-actions-scroll">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              className="ai-quick-chip"
              onClick={() => handleQuickAction(action.userPrompt)}
              disabled={isGenerating}
              title={action.userPrompt}
            >
              <span>{action.emoji}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form className="ai-input-area" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="ai-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI anything… (Enter to send, Shift+Enter for newline)"
          rows={1}
          disabled={isGenerating}
        />
        <button
          className={`ai-send-btn ${isGenerating ? 'ai-send-loading' : ''}`}
          type="submit"
          disabled={!input.trim() || isGenerating}
          title="Send (Enter)"
        >
          <Send size={14} />
        </button>
      </form>
      <p className="ai-input-hint">Enter ↵ send · Shift+Enter newline · Context auto-included</p>
    </div>
  )
}
