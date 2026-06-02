import { scopeCss } from '../../lib/scopeCss'
import { BASE_MARKDOWN_STYLES, markdownToHtml } from '../preview/IframePreview'

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

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

  // Use a UNIQUE scope class that does NOT exist on the real page.
  // <style> tags are global regardless of DOM position, so we must ensure
  // the scoped selectors never match any live element.
  const scopeClass = `pdf-export-clone-${generateId()}`

  const clone = document.createElement('div')
  clone.className = `${scopeClass} preview-light`
  clone.style.padding = '32px'
  clone.style.maxWidth = 'none'
  clone.style.width = '100%'
  clone.style.background = '#ffffff'

  // Base markdown styles — scope EVERY selector to the unique class so
  // body/html/* rules cannot leak to the real page.
  const baseStyle = document.createElement('style')
  baseStyle.textContent = scopeCss(BASE_MARKDOWN_STYLES, `.${scopeClass}`) + `
    .${scopeClass} .markdown-body { max-width: none !important; padding: 0 !important; }
    .${scopeClass} pre { overflow: hidden !important; }
    .${scopeClass} img { max-width: 100%; border-radius: 8px; }
  `
  clone.appendChild(baseStyle)

  // Scoped custom CSS — scoped to the UNIQUE class so it can ONLY
  // match this off-screen clone, never the live preview or page body.
  if (customCss.trim()) {
    const customStyle = document.createElement('style')
    customStyle.textContent = scopeCss(customCss, `.${scopeClass}`)
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
