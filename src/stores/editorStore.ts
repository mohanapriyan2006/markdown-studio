import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_MARKDOWN } from '../features/templates/templates'

export type Theme = 'light' | 'dark' | 'system'
export type ActiveTab = 'markdown' | 'css' | 'ai'

interface EditorState {
  markdown: string
  customCss: string
  activeTab: ActiveTab
  theme: Theme
  lastSaved: Date | null

  // Actions
  setMarkdown: (md: string) => void
  setCustomCss: (css: string) => void
  setActiveTab: (tab: ActiveTab) => void
  setTheme: (theme: Theme) => void
  resetCss: () => void
  loadTemplate: (md: string) => void
  markSaved: () => void
}

export const DEFAULT_CSS = `/* Custom CSS — styles applied to the preview */

h1 {
  color: #6366f1;
  border-color: #6366f1;
}

h2 {
  color: #8b5cf6;
}

a {
  color: #6366f1;
}

blockquote {
  border-left-color: #6366f1;
  background: rgba(99,102,241,0.05);
}

code {
  color: #6366f1;
}
`

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      markdown: DEFAULT_MARKDOWN,
      customCss: DEFAULT_CSS,
      activeTab: 'markdown',
      theme: 'system',
      lastSaved: null,

      setMarkdown: (md) => set({ markdown: md }),
      setCustomCss: (css) => set({ customCss: css }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setTheme: (theme) => set({ theme }),
      resetCss: () => set({ customCss: DEFAULT_CSS }),
      loadTemplate: (md) => set({ markdown: md, activeTab: 'markdown' }),
      markSaved: () => set({ lastSaved: new Date() }),
    }),
    {
      name: 'markdown-studio-storage',
      partialize: (state) => ({
        markdown: state.markdown,
        customCss: state.customCss,
        theme: state.theme,
      }),
    }
  )
)
