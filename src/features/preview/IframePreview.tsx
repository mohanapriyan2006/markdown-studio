import { useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

/* ── Base markdown styles (baked-in, no CSS-variables) ─────────────── */
export const BASE_MARKDOWN_STYLES = `
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
}

.markdown-body {
  max-width: 740px;
  margin: 0 auto;
  font-size: 15px;
  line-height: 1.8;
  color: #1f2937;
  padding: 32px;
  animation: fadeIn 0.2s ease;
}

.markdown-body h1 {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 0.5em;
  margin-top: 1.5em;
  letter-spacing: -0.5px;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.3em;
}
.markdown-body h1:first-child { margin-top: 0; }

.markdown-body h2 {
  font-size: 1.4em;
  font-weight: 600;
  margin-top: 1.4em;
  margin-bottom: 0.5em;
  letter-spacing: -0.3px;
  color: #111827;
}
.markdown-body h3 {
  font-size: 1.15em;
  font-weight: 600;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
  color: #111827;
}
.markdown-body h4, .markdown-body h5, .markdown-body h6 {
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.3em;
  color: #374151;
}

.markdown-body p {
  margin-bottom: 1em;
  color: #374151;
}

.markdown-body a {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s ease;
}
.markdown-body a:hover {
  border-bottom-color: #2563eb;
}

.markdown-body strong { font-weight: 700; color: #111827; }
.markdown-body em { font-style: italic; }

.markdown-body ul, .markdown-body ol {
  margin: 0.5em 0 1em 1.5em;
  color: #374151;
}
.markdown-body li { margin-bottom: 0.3em; }
.markdown-body li input[type="checkbox"] {
  margin-right: 6px;
  accent-color: #6366f1;
}

.markdown-body blockquote {
  border-left: 3px solid #6366f1;
  padding: 8px 16px;
  margin: 1em 0;
  background: #f3f4f6;
  border-radius: 0 4px 4px 0;
  color: #374151;
  font-style: italic;
}

.markdown-body code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.875em;
  background: #f3f4f6;
  color: #7c3aed;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.markdown-body pre {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 1em 0;
  border: 1px solid #e2e8f0;
}

.markdown-body pre code {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font-size: 0.875em;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 0.9em;
}

.markdown-body th {
  background: #f3f4f6;
  font-weight: 600;
  text-align: left;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  color: #111827;
}

.markdown-body td {
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  color: #374151;
}

.markdown-body tr:nth-child(even) td { background: #f3f4f6; }

.markdown-body hr {
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 1.5em 0;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

/* ── Convert markdown string → HTML string (server render) ─────────── */
export function markdownToHtml(md: string): string {
  const element = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={{
        a: ({ children, href, ...props }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        ),
        input: ({ type, checked, ...props }) => {
          if (type === 'checkbox') {
            return (
              <input
                type="checkbox"
                checked={checked}
                readOnly
                style={{ marginRight: 6, accentColor: '#6366f1' }}
                {...props}
              />
            )
          }
          return <input type={type} {...props} />
        },
      }}
    >
      {md}
    </ReactMarkdown>
  )
  return renderToStaticMarkup(element)
}

/* ── Public helper: build the full HTML document string ────────────── */
export function buildPreviewHtml(markdown: string, customCss: string): string {
  const html = markdownToHtml(markdown)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${BASE_MARKDOWN_STYLES}</style>
  ${customCss ? `<style>${customCss}</style>` : ''}
</head>
<body>
  <div class="markdown-body">${html}</div>
</body>
</html>`
}

/* ── Component ──────────────────────────────────────────────────────── */
interface IframePreviewProps {
  markdown: string
  customCss: string
}

export function IframePreview({ markdown, customCss }: IframePreviewProps) {
  const srcDoc = useMemo(
    () => buildPreviewHtml(markdown, customCss),
    [markdown, customCss]
  )

  return (
    <iframe
      title="Markdown Preview"
      srcDoc={srcDoc}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      sandbox="allow-same-origin"
    />
  )
}
