import { scopeCss } from '../../lib/scopeCss'
import { BASE_MARKDOWN_STYLES, markdownToHtml } from '../preview/IframePreview'

export async function exportPdf(
  markdown: string,
  customCss: string,
  filename = 'document.pdf'
): Promise<void> {
  if (!markdown.trim()) {
    alert('Nothing to export yet — write some Markdown first.')
    return
  }

  const html2pdf = (await import('html2pdf.js')).default
  const mdHtml = markdownToHtml(markdown)

  // Build the clone root exactly like the old inline preview:
  // .preview-container .preview-light  →  clone root
  //   <style> base + print overrides    </style>
  //   <style> scoped custom CSS        </style>
  //   .markdown-body  →  rendered HTML
  const clone = document.createElement('div')
  clone.className = 'preview-container preview-light'
  clone.style.padding = '32px'
  clone.style.maxWidth = 'none'
  clone.style.width = '100%'
  clone.style.background = '#ffffff'

  // Base markdown styles (baked-in light-mode colours, no CSS vars)
  const baseStyle = document.createElement('style')
  baseStyle.textContent = BASE_MARKDOWN_STYLES + `
    .markdown-body { max-width: none !important; padding: 0 !important; }
    pre { overflow: hidden !important; }
    img { max-width: 100%; border-radius: 8px; }
  `
  clone.appendChild(baseStyle)

  // Scoped custom CSS — same call that worked before.
  // body/html/:root → .preview-container
  // h1              → .preview-container h1
  if (customCss.trim()) {
    const customStyle = document.createElement('style')
    customStyle.textContent = scopeCss(customCss, '.preview-container')
    clone.appendChild(customStyle)
  }

  // Markdown content
  const content = document.createElement('div')
  content.className = 'markdown-body'
  content.innerHTML = mdHtml
  clone.appendChild(content)

  // Off-screen wrapper so html2canvas resolves getComputedStyle
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
