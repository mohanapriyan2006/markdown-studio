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

body {
  color: #1a1a1a;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.7;
}

h1, h2, h3, h4, h5, h6 {
  color: #0d0d0d;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 1.8em;
  margin-bottom: 0.6em;
}

h1 {
  font-size: 2.2em;
  border-bottom: 2px solid #0d0d0d;
  padding-bottom: 0.3em;
}

h2 {
  font-size: 1.6em;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 0.25em;
}

h3 {
  font-size: 1.25em;
}

a {
  color: #0d0d0d;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 500;
}

a:hover {
  color: #404040;
}

blockquote {
  border-left: 3px solid #0d0d0d;
  background: #f7f7f7;
  padding: 1em 1.2em;
  margin: 1.2em 0;
  color: #333;
  font-style: italic;
}

code {
  background: #f2f2f2;
  color: #c7254e;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9em;
}

pre {
  background: #0d0d0d;
  color: #f2f2f2;
  padding: 1.2em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.2em 0;
}

pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: 0.85em;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2em 0;
  font-size: 0.95em;
}

th, td {
  border: 1px solid #e5e5e5;
  padding: 0.6em 0.8em;
  text-align: left;
}

th {
  background: #0d0d0d;
  color: #ffffff;
  font-weight: 600;
}

tr:nth-child(even) {
  background: #f9f9f9;
}

hr {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 2em 0;
}

ul, ol {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

li {
  margin: 0.3em 0;
}

img {
  max-width: 100%;
  border-radius: 6px;
  margin: 1em 0;
}

p {
  margin: 0.8em 0;
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
