export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'openrouter' | 'custom'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  endpoint: string
  model: string
  temperature: number
  maxTokens: number
}

export interface ProviderPreset {
  label: string
  endpoint: string
  model: string
  models: string[]
}

export const PROVIDER_PRESETS: Record<AIProvider, ProviderPreset> = {
  openai: {
    label: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'o3', 'o4-mini'],
  },
  anthropic: {
    label: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    models: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-3-7-sonnet-20250219', 'claude-3-5-haiku-20241022'],
  },
  gemini: {
    label: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-flash-latest',
    models: ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-preview-05-20', 'gemini-2.5-pro', 'gemini-2.5-pro-preview-05-06', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  },
  groq: {
    label: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama-4-scout-17b-16e', 'llama-4-maverick-17b-128e', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
  openrouter: {
    label: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-4o',
    models: ['openai/gpt-4o', 'openai/gpt-4o-mini', 'anthropic/claude-3.7-sonnet', 'google/gemini-2.5-flash', 'meta-llama/llama-3.3-70b-instruct', 'deepseek/deepseek-chat-v3-0324'],
  },
  custom: {
    label: 'Custom Provider',
    endpoint: '',
    model: '',
    models: [],
  },
}

export type MessageRole = 'user' | 'assistant'
export type OutputType = 'markdown' | 'css' | 'mixed' | 'text'

export interface ParsedOutput {
  type: OutputType
  markdownCode?: string
  cssCode?: string
  rawText: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  parsed?: ParsedOutput
  timestamp: number
  isLoading?: boolean
  error?: string
}

export type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error'

export interface QuickAction {
  id: string
  label: string
  icon: string
  systemHint: string
  userPrompt: string
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'gen-md',
    label: 'Generate Markdown',
    icon: 'FileText',
    systemHint: 'Generate clean, well-structured Markdown content. Wrap output in ```markdown blocks.',
    userPrompt: 'Generate well-structured Markdown based on my current document context: ',
  },
  {
    id: 'gen-css',
    label: 'Generate CSS',
    icon: 'Palette',
    systemHint: 'Generate beautiful CSS styles for the markdown preview. Wrap output in ```css blocks.',
    userPrompt: 'Generate beautiful custom CSS styles for my markdown document: ',
  },
  {
    id: 'improve',
    label: 'Improve Document',
    icon: 'Zap',
    systemHint: 'Improve the document structure, clarity, and formatting. Return improved version in ```markdown blocks.',
    userPrompt: 'Improve my current markdown document — better structure, clarity, and formatting.',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: 'AlignLeft',
    systemHint: 'Write a concise summary of the document. Return summary in ```markdown blocks.',
    userPrompt: 'Write a concise TL;DR summary of my current document.',
  },
  {
    id: 'fix',
    label: 'Fix Markdown',
    icon: 'Wrench',
    systemHint: 'Fix any Markdown syntax errors and improve formatting. Return fixed version in ```markdown blocks.',
    userPrompt: 'Fix any Markdown syntax issues and improve the formatting of my document.',
  },
  {
    id: 'template',
    label: 'Create Template',
    icon: 'LayoutTemplate',
    systemHint: 'Create a reusable Markdown template based on the document type. Wrap in ```markdown blocks.',
    userPrompt: 'Create a reusable Markdown template for: ',
  },
  {
    id: 'style',
    label: 'Convert Style',
    icon: 'RefreshCw',
    systemHint: 'Convert the document style (e.g., technical → casual, formal → friendly). Return in ```markdown blocks.',
    userPrompt: 'Convert my document to a different style: ',
  },
  {
    id: 'explain',
    label: 'Explain Document',
    icon: 'Lightbulb',
    systemHint: 'Explain the document structure, key points, and purpose in plain language.',
    userPrompt: 'Explain what this document covers and its key points.',
  },
]
