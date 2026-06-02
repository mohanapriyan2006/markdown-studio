export async function exportPdf(
  previewElement: HTMLElement,
  customCss: string,
  filename = 'document.pdf'
): Promise<void> {
  // Dynamically import html2pdf
  const html2pdf = (await import('html2pdf.js')).default

  // Clone preview element
  const clone = previewElement.cloneNode(true) as HTMLElement
  clone.style.padding = '32px'
  clone.style.background = '#ffffff'
  clone.style.color = '#0f172a'
  clone.style.fontFamily = "'Inter', system-ui, sans-serif"
  clone.style.fontSize = '14px'
  clone.style.lineHeight = '1.8'
  clone.style.maxWidth = 'none'
  clone.style.width = '100%'

  // Override dark-mode CSS variables so the export is always light
  const lightVars: Record<string, string> = {
    '--bg-base': '#ffffff',
    '--bg-card': '#f8fafc',
    '--bg-muted': '#f1f5f9',
    '--bg-hover': '#e8eef6',
    '--border': '#e2e8f0',
    '--border-focus': '#6366f1',
    '--text-primary': '#0f172a',
    '--text-secondary': '#475569',
    '--text-muted': '#94a3b8',
    '--accent': '#6366f1',
    '--accent-hover': '#4f46e5',
    '--accent-light': '#eef2ff',
    '--accent-glow': 'rgba(99,102,241,0.15)',
  }
  Object.entries(lightVars).forEach(([k, v]) => clone.style.setProperty(k, v))

  // Inject custom CSS as a style tag inside the clone
  if (customCss) {
    const style = document.createElement('style')
    style.textContent = customCss
    clone.prepend(style)
  }

  // Base styles for PDF
  const baseStyle = document.createElement('style')
  baseStyle.textContent = `
    * { box-sizing: border-box; }
    h1 { font-size: 2em; font-weight: 700; margin-bottom: 0.5em; margin-top: 1em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }
    h2 { font-size: 1.4em; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.4em; }
    h3 { font-size: 1.15em; font-weight: 600; margin-top: 1em; margin-bottom: 0.3em; }
    p { margin-bottom: 1em; }
    code { font-family: 'JetBrains Mono', monospace; font-size: 0.85em; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
    pre { background: #f6f8fa; color: #24292e; padding: 16px; border-radius: 8px; overflow: hidden; margin: 1em 0; border: 1px solid #e2e8f0; }
    pre code { background: none; color: inherit; padding: 0; }
    blockquote { border-left: 3px solid #6366f1; padding: 8px 16px; margin: 1em 0; background: rgba(99,102,241,0.05); }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th { background: #f8fafc; font-weight: 600; text-align: left; padding: 10px 14px; border: 1px solid #e2e8f0; }
    td { padding: 8px 14px; border: 1px solid #e2e8f0; }
    ul, ol { margin: 0.5em 0 1em 1.5em; }
    a { color: #6366f1; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5em 0; }
    img { max-width: 100%; border-radius: 8px; }
  `
  clone.prepend(baseStyle)

  // Append clone to the DOM off-screen so html2canvas getComputedStyle
  // resolves CSS custom properties correctly (detached elements often
  // keep the dark-theme variable values in some browsers).
  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.left = '-9999px'
  wrapper.style.top = '0'
  wrapper.style.zIndex = '-1'
  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  const opt = {
    margin: [15, 15, 15, 15] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4',
      orientation: 'portrait' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  try {
    await html2pdf().set(opt).from(clone).save()
  } finally {
    document.body.removeChild(wrapper)
  }
}
