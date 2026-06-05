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
  line-height: 1.75;
  color: #1e293b;
  padding: 12px;
  animation: fadeIn 0.2s ease;
}

.markdown-body h1 {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 0.5em;
  margin-top: 1.4em;
  letter-spacing: -0.4px;
  color: #0f172a;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.3em;
}
.markdown-body h1:first-child { margin-top: 0; }

.markdown-body h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1.4em;
  margin-bottom: 0.5em;
  letter-spacing: -0.2px;
  color: #0f172a;
}
.markdown-body h3 {
  font-size: 1.2em;
  font-weight: 600;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
  color: #0f172a;
}
.markdown-body h4, .markdown-body h5, .markdown-body h6 {
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.3em;
  color: #334155;
}

.markdown-body p {
  margin-bottom: 1em;
  color: #334155;
}

.markdown-body a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s ease;
}
.markdown-body a:hover {
  border-bottom-color: #2563eb;
}

.markdown-body strong { font-weight: 700; color: #0f172a; }
.markdown-body em { font-style: italic; }

.markdown-body ul, .markdown-body ol {
  margin: 0.5em 0 1em 1.5em;
  color: #334155;
}
.markdown-body li { margin-bottom: 0.35em; }
.markdown-body li input[type="checkbox"] {
  margin-right: 6px;
  accent-color: #4f46e5;
}

.markdown-body blockquote {
  border-left: 4px solid #4f46e5;
  padding: 12px 18px;
  margin: 1em 0;
  background: #f8fafc;
  border-radius: 0 6px 6px 0;
  color: #475569;
  font-style: italic;
}

.markdown-body code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.85em;
  background: #f1f5f9;
  color: #be185d;
  padding: 2px 6px;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
}

.markdown-body pre {
  background: #f8fafc;
  border-radius: 10px;
  padding: 18px;
  overflow-x: auto;
  margin: 1em 0;
  border: 1px solid #e2e8f0;
}

.markdown-body pre code {
  background: none;
  border: none;
  padding: 0;
  color: #0f172a;
  font-size: 0.85em;
  line-height: 1.7;
}

/* Syntax highlighting fallbacks — ensures visible text even without hljs CSS */
.markdown-body pre code .hljs-keyword,
.markdown-body pre code .hljs-selector-tag,
.markdown-body pre code .hljs-title,
.markdown-body pre code .hljs-section,
.markdown-body pre code .hljs-doctag,
.markdown-body pre code .hljs-name { color: #0f172a; font-weight: 600; }

.markdown-body pre code .hljs-string,
.markdown-body pre code .hljs-meta,
.markdown-body pre code .hljs-regexp,
.markdown-body pre code .hljs-template-tag,
.markdown-body pre code .hljs-template-variable { color: #047857; }

.markdown-body pre code .hljs-number,
.markdown-body pre code .hljs-literal,
.markdown-body pre code .hljs-variable,
.markdown-body pre code .hljs-tag,
.markdown-body pre code .hljs-attr { color: #b45309; }

.markdown-body pre code .hljs-comment,
.markdown-body pre code .hljs-quote { color: #64748b; font-style: italic; }

.markdown-body pre code .hljs-built_in,
.markdown-body pre code .hljs-builtin-name,
.markdown-body pre code .hljs-type,
.markdown-body pre code .hljs-class,
.markdown-body pre code .hljs-function { color: #1d4ed8; }

.markdown-body pre code .hljs-emphasis { font-style: italic; }
.markdown-body pre code .hljs-strong { font-weight: 700; }

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 0.9em;
}

.markdown-body th {
  background: #f1f5f9;
  font-weight: 600;
  text-align: left;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.markdown-body td {
  padding: 8px 14px;
  border: 1px solid #cbd5e1;
  color: #334155;
}

.markdown-body tr:nth-child(even) td { background: #f8fafc; }

.markdown-body hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5em 0;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 10px;
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
