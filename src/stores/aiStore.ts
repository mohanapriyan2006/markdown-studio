import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIConfig, ChatMessage, ConnectionStatus, AIProvider } from '../types/ai'
import { PROVIDER_PRESETS } from '../types/ai'

const DEFAULT_CONFIG: AIConfig = {
  provider: 'openai',
  apiKey: '',
  endpoint: PROVIDER_PRESETS.openai.endpoint,
  model: PROVIDER_PRESETS.openai.model,
  temperature: 0.7,
  maxTokens: 2048,
}

interface AIState {
  config: AIConfig
  isConfigured: boolean
  connectionStatus: ConnectionStatus
  connectionError: string | null
  messages: ChatMessage[]
  isGenerating: boolean
  showSettings: boolean
  demoMode: boolean

  // Actions
  setConfig: (config: Partial<AIConfig>) => void
  setProvider: (provider: AIProvider) => void
  setConnectionStatus: (status: ConnectionStatus, error?: string) => void
  addMessage: (msg: ChatMessage) => void
  updateLastMessage: (updates: Partial<ChatMessage>) => void
  clearMessages: () => void
  setIsGenerating: (v: boolean) => void
  setShowSettings: (v: boolean) => void
  resetConfig: () => void
  setDemoMode: (v: boolean) => void
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      isConfigured: false,
      connectionStatus: 'idle',
      connectionError: null,
      messages: [],
      isGenerating: false,
      showSettings: true,
      demoMode: false,

      setConfig: (updates) =>
        set((s) => {
          const newConfig = { ...s.config, ...updates }
          return {
            config: newConfig,
            isConfigured: (!!newConfig.apiKey.trim() && !!newConfig.endpoint.trim()) || s.demoMode,
            demoMode: newConfig.apiKey.trim() ? false : s.demoMode,
          }
        }),

      setProvider: (provider) => {
        const preset = PROVIDER_PRESETS[provider]
        set((s) => ({
          config: {
            ...s.config,
            provider,
            endpoint: preset.endpoint,
            model: preset.model,
          },
        }))
      },

      setConnectionStatus: (status, error) =>
        set({ connectionStatus: status, connectionError: error ?? null }),

      addMessage: (msg) =>
        set((s) => ({
          messages: [...s.messages.slice(-49), msg], // keep last 50
        })),

      updateLastMessage: (updates) =>
        set((s) => {
          const msgs = [...s.messages]
          if (msgs.length === 0) return {}
          msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], ...updates }
          return { messages: msgs }
        }),

      clearMessages: () => set({ messages: [] }),

      setIsGenerating: (v) => set({ isGenerating: v }),

      setShowSettings: (v) => set({ showSettings: v }),

      resetConfig: () =>
        set({ config: DEFAULT_CONFIG, isConfigured: false, connectionStatus: 'idle', connectionError: null, demoMode: false }),

      setDemoMode: (v) =>
        set({ demoMode: v, isConfigured: v, showSettings: !v }),
    }),
    {
      name: 'markdown-studio-ai',
      partialize: (s) => ({
        config: s.config,
        isConfigured: s.isConfigured,
        demoMode: s.demoMode,
        messages: s.messages.slice(-20), // persist last 20
        showSettings: s.showSettings,
      }),
    }
  )
)
