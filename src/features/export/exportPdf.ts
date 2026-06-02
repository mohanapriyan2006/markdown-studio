import { scopeCss } from '../../lib/scopeCss'

export async function exportPdf(
  previewElement: HTMLElement,
  customCss: string,
  filename = 'document.pdf'
): Promise<void> {
  // Dynamically import html2pdf
  const html2pdf = (await import('html2pdf.js')).default

  // Clone the preview container (already has .preview-light class + custom CSS)
  const clone = previewElement.cloneNode(true) as HTMLElement
  clone.style.padding = '32px'
  clone.style.maxWidth = 'none'
  clone.style.width = '100%'

  // Inject scoped custom CSS as a style tag inside the clone
  if (customCss) {
    const style = document.createElement('style')
    style.textContent = scopeCss(customCss, '.preview-container')
    clone.prepend(style)
  }

  // Minimal print-specific base styles
  const baseStyle = document.createElement('style')
  baseStyle.textContent = `
    * { box-sizing: border-box; }
    pre { overflow: hidden !important; }
    img { max-width: 100%; border-radius: 8px; }
  `
  clone.prepend(baseStyle)

  // Append clone to the DOM off-screen so html2canvas getComputedStyle
  // resolves CSS custom properties correctly.
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
