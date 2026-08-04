import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_MARKDOWN } from '../features/templates/templates'
import { persistImages, restoreImages } from '../lib/imageStore'

restoreImages()

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
  color: #2d2d3f;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.75;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Headings ─────────────────────────────────────────── */

h1, h2, h3, h4, h5, h6 {
  color: #1a1a2e;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 2em;
  margin-bottom: 0.6em;
  line-height: 1.3;
}

h1 {
  font-size: 2.25em;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 3px solid #7c3aed;
  padding-bottom: 0.35em;
}

h2 {
  font-size: 1.6em;
  color: #1a1a2e;
  border-bottom: 2px solid #ede9fe;
  padding-bottom: 0.3em;
  position: relative;
}

h2::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: #7c3aed;
}

h3 {
  font-size: 1.3em;
  color: #2d2d3f;
}

h3::before {
  content: '▸ ';
  color: #7c3aed;
  font-weight: 700;
}

h4 {
  font-size: 1.1em;
  color: #4c1d95;
}

h5 {
  font-size: 1em;
  color: #6d28d9;
}

h6 {
  font-size: 0.9em;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Paragraphs & Text ────────────────────────────────── */

p {
  margin: 0 0 1.1em;
  color: #3d3d4e;
}

strong {
  color: #1a1a2e;
  font-weight: 700;
}

em {
  color: #4c1d95;
}

del {
  color: #9ca3af;
}

/* ── Links ────────────────────────────────────────────── */

a {
  color: #7c3aed;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #c4b5fd;
  transition: all 0.2s ease;
}

a:hover {
  color: #6d28d9;
  border-bottom-color: #7c3aed;
  background: #f5f3ff;
}

/* ── Blockquotes ──────────────────────────────────────── */

blockquote {
  border-left: 4px solid #7c3aed;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  padding: 1em 1.5em;
  margin: 1.5em 0;
  border-radius: 0 8px 8px 0;
  color: #4c1d95;
  font-style: italic;
  position: relative;
}

blockquote::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 10px;
  font-size: 3em;
  color: #c4b5fd;
  font-family: Georgia, serif;
  line-height: 1;
}

blockquote p {
  margin: 0.3em 0;
  color: #4c1d95;
}

/* ── Inline Code ──────────────────────────────────────── */

code {
  background: #f5f3ff;
  color: #7c3aed;
  padding: 0.15em 0.45em;
  border-radius: 5px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 0.875em;
  border: 1px solid #ddd6fe;
  font-weight: 500;
}

/* ── Code Blocks ──────────────────────────────────────── */

pre {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 1.25em 1.5em;
  border-radius: 10px;
  overflow-x: auto;
  margin: 1.5em 0;
  border: 1px solid #313244;
  box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.1);
  position: relative;
}

pre::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed);
  border-radius: 10px 10px 0 0;
}

pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
  font-size: 0.875em;
  line-height: 1.7;
  font-weight: 400;
}

/* ── Tables ───────────────────────────────────────────── */

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: 0.95em;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(124, 58, 237, 0.08);
}

th, td {
  border: 1px solid #ede9fe;
  padding: 0.7em 1em;
  text-align: left;
}

th {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: none;
}

td {
  color: #3d3d4e;
}

tr:nth-child(even) td {
  background: #faf9ff;
}

tr:hover td {
  background: #f5f3ff;
  transition: background 0.15s ease;
}

/* ── Horizontal Rule ──────────────────────────────────── */

hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #7c3aed, transparent);
  margin: 2.5em 0;
}

/* ── Lists ────────────────────────────────────────────── */

ul, ol {
  padding-left: 1.6em;
  margin: 0.8em 0 1.2em;
  color: #3d3d4e;
}

li {
  margin: 0.4em 0;
}

ul li::marker {
  color: #7c3aed;
}

ol li::marker {
  color: #7c3aed;
  font-weight: 700;
}

li input[type="checkbox"] {
  margin-right: 8px;
  accent-color: #7c3aed;
  transform: translateY(2px);
}

/* ── Images ───────────────────────────────────────────── */

img {
  max-width: 100%;
  border-radius: 10px;
  margin: 1.2em 0;
  box-shadow: 0 4px 12px -2px rgba(124, 58, 237, 0.15);
  border: 1px solid #ede9fe;
}

/* ── Keyboard / KBD ───────────────────────────────────── */

kbd {
  background: #f5f3ff;
  border: 1px solid #c4b5fd;
  border-radius: 5px;
  padding: 0.15em 0.5em;
  font-size: 0.85em;
  font-family: 'JetBrains Mono', monospace;
  color: #6d28d9;
  box-shadow: 0 2px 0 #c4b5fd;
}
`

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
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
      markSaved: () => {
        persistImages(get().markdown)
        set({ lastSaved: new Date() })
      },
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
