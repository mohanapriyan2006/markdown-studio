import type { AIConfig, ChatMessage, ParsedOutput } from '../../types/ai'

// ─── Demo Fallback Models ───────────────────────────────────────────────────
// Only used when demoMode is active. Tried in order if the previous model fails.
const DEMO_FALLBACK_MODELS = [
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-2.5-pro',
  'gemini-3.1-pro-preview',
]

function isModelUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message.toLowerCase()
  return msg.includes('404') || msg.includes('not found') || msg.includes('model') || msg.includes('unavailable') || msg.includes('does not exist') || msg.includes('invalid')
}

// ─── Output Parser ──────────────────────────────────────────────────────────

export function parseAIResponse(content: string): ParsedOutput {
  // Match ```markdown or ```md blocks (case-insensitive, handles optional space)
  const mdMatch = content.match(/```(?:markdown|md)\s*\n?([\s\S]*?)```/i)
  // Match ```css blocks (case-insensitive, handles optional space)
  const cssMatch = content.match(/```css\s*\n?([\s\S]*?)```/i)

  if (mdMatch && cssMatch) {
    return { type: 'mixed', markdownCode: mdMatch[1].trim(), cssCode: cssMatch[1].trim(), rawText: content }
  }
  if (mdMatch) {
    return { type: 'markdown', markdownCode: mdMatch[1].trim(), rawText: content }
  }
  if (cssMatch) {
    return { type: 'css', cssCode: cssMatch[1].trim(), rawText: content }
  }
  return { type: 'text', rawText: content }
}

// ─── System Prompt Builder ──────────────────────────────────────────────────

export function buildSystemPrompt(markdown: string, css: string): string {
  return `You are an AI writing assistant integrated into Markdown Studio, a premium document editor.

Your role is to help users create, improve, and style Markdown documents.

CURRENT DOCUMENT CONTEXT:
\`\`\`markdown
${markdown.slice(0, 3000) || '(empty document)'}
\`\`\`

CURRENT CUSTOM CSS:
\`\`\`css
${css.slice(0, 1500) || '(no custom styles)'}
\`\`\`

RESPONSE RULES:
- When generating Markdown content, always wrap it in \`\`\`markdown blocks
- When generating CSS, always wrap it in \`\`\`css blocks
- Be concise and direct
- Produce production-quality output
- Preserve the user's existing document structure unless told to replace it`
}

// ─── AI Request ─────────────────────────────────────────────────────────────

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function callOpenAICompat(
  config: AIConfig,
  messages: OpenAIMessage[]
): Promise<string> {
  const res = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API Error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function callAnthropic(
  config: AIConfig,
  messages: OpenAIMessage[]
): Promise<string> {
  const system = messages.find((m) => m.role === 'system')?.content ?? ''
  const userMessages = messages.filter((m) => m.role !== 'system')

  const res = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      system,
      messages: userMessages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic Error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function sendAIMessage(
  config: AIConfig,
  chatHistory: ChatMessage[],
  userPrompt: string,
  markdown: string,
  css: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt(markdown, css)

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    // Include last 8 turns of chat history for context
    ...chatHistory.slice(-8).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userPrompt },
  ]

  if (config.provider === 'anthropic') {
    return callAnthropic(config, messages)
  }
  return callOpenAICompat(config, messages)
}

export async function sendDemoAIMessage(
  baseConfig: AIConfig,
  chatHistory: ChatMessage[],
  userPrompt: string,
  markdown: string,
  css: string
): Promise<{ text: string; modelUsed: string }> {
  const systemPrompt = buildSystemPrompt(markdown, css)
  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-8).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userPrompt },
  ]

  let lastError: Error | undefined

  for (const model of DEMO_FALLBACK_MODELS) {
    const config = { ...baseConfig, model }
    try {
      const text = config.provider === 'anthropic'
        ? await callAnthropic(config, messages)
        : await callOpenAICompat(config, messages)
      return { text, modelUsed: model }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (!isModelUnavailableError(lastError)) {
        throw lastError
      }
    }
  }

  throw lastError ?? new Error('All demo fallback models are unavailable.')
}

export async function testAIConnection(config: AIConfig): Promise<void> {
  if (!config.apiKey.trim()) throw new Error('API key is required')
  if (!config.endpoint.trim()) throw new Error('Endpoint URL is required')
  if (!config.model.trim()) throw new Error('Model name is required')

  // Send a minimal test message
  const testMessages: OpenAIMessage[] = [
    { role: 'user', content: 'Reply with exactly: OK' },
  ]

  if (config.provider === 'anthropic') {
    await callAnthropic({ ...config, maxTokens: 10 }, testMessages)
  } else {
    await callOpenAICompat({ ...config, maxTokens: 10 }, testMessages)
  }
}
