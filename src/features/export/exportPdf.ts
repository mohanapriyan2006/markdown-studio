/**
 * Pixel-perfect PDF export that prints exactly what is visible in the preview iframe.
 *
 * Uses the browser's native print engine via the sandboxed iframe so fonts,
 * layout, margins, and custom CSS are identical to the live preview canvas.
 *
 * (File / directory name export from the print dialog is controlled by the
 * filename hint passed through the document title inside the iframe.)
 */

export async function exportPdf(
  _markdown?: string,
  _customCss?: string,
  filename = 'document.pdf',
  customTitle?: string
): Promise<void> {
  // Use the custom title for the final filename if provided
  const displayTitle = customTitle
    ? customTitle.replace(/[/\\?%*:|"<>]/g, '_')
    : filename.replace(/\.pdf$/i, '')

  // Locate the preview iframe by its data attribute
  const iframe = document.querySelector<HTMLIFrameElement>(
    'iframe[data-print-target="preview"]'
  )

  // Guard against missing iframe (e.g. empty state when no markdown has been typed)
  if (!iframe) {
    // Fallback: if no iframe is present, alert the user
    const html2pdf = (await import('html2pdf.js')).default
    const { markdownToHtml } = await import('../preview/IframePreview')
    const { scopeCss } = await import('../../lib/scopeCss')

    const placeholderHtml = markdownToHtml(
      _markdown || '# No Preview Available\n\nThe preview iframe was not found. This usually happens when the document is empty.'
    )

    // Render a minimal off-screen document for printing
    const blob = new Blob(
      [
        `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body { font-family: system-ui, sans-serif; padding: 32px; color: #1e293b; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 15mm; }
  }
</style>
${_customCss ? `<style>${scopeCss(_customCss, 'body')}</style>` : ''}
</head><body>${placeholderHtml}</body></html>`,
      ],
      { type: 'text/html' }
    )
    const url = URL.createObjectURL(blob)
    const fallbackIframe = document.createElement('iframe')
    fallbackIframe.style.position = 'fixed'
    fallbackIframe.style.left = '-9999px'
    fallbackIframe.style.top = '0'
    fallbackIframe.style.width = '0'
    fallbackIframe.style.height = '0'
    fallbackIframe.src = url
    document.body.appendChild(fallbackIframe)

    await new Promise<void>((resolve, reject) => {
      fallbackIframe.onload = async () => {
        try {
          fallbackIframe.contentDocument!.title = displayTitle
          fallbackIframe.contentWindow!.focus()
          fallbackIframe.contentWindow!.print()
          const cleanup = () => {
            document.body.removeChild(fallbackIframe)
            URL.revokeObjectURL(url)
          }
          fallbackIframe.contentWindow!.addEventListener('afterprint', cleanup, { once: true })
          // Timeout fallback if afterprint doesn't fire
          setTimeout(cleanup, 10_000)
          resolve()
        } catch (e) {
          document.body.removeChild(fallbackIframe)
          URL.revokeObjectURL(url)
          // Fall back to html2pdf if iframe printing fails
          try {
            const wrapper = document.createElement('div')
            wrapper.style.position = 'fixed'
            wrapper.style.left = '-9999px'
            wrapper.style.top = '0'
            wrapper.innerHTML = placeholderHtml
            document.body.appendChild(wrapper)
            await html2pdf().set({
              margin: [15, 15, 15, 15],
              filename: `${displayTitle}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            } as Record<string, unknown>).from(wrapper).save()
            document.body.removeChild(wrapper)
          } catch {
            reject(e)
          }
        }
      }
      fallbackIframe.onerror = () => {
        document.body.removeChild(fallbackIframe)
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load fallback print iframe'))
      }
    })
    return
  }

  // Primary path: use the existing preview iframe
  const iframeWindow = iframe.contentWindow
  if (!iframeWindow) {
    alert('Could not access the preview for printing. Please try again.')
    return
  }

  // Set the document title so "Save as PDF" uses our filename
  try {
    iframeWindow.document.title = displayTitle
  } catch {
    // Sandboxed iframe may not allow title setting; ignore
  }

  // Focus the iframe to ensure print() targets the right document
  iframeWindow.focus()

  // Wait a microtask so the focus settles
  await new Promise((r) => setTimeout(r, 0))

  // Trigger native print (Save as PDF in Chrome / Edge / Firefox)
  iframeWindow.print()

  // Return a promise that resolves after the print dialog closes.
  // On most browsers the `afterprint` event fires when the user
  // confirms or cancels the dialog.
  return new Promise<void>((resolve) => {
    const onAfterPrint = () => {
      iframeWindow?.removeEventListener('afterprint', onAfterPrint)
      resolve()
    }
    iframeWindow.addEventListener('afterprint', onAfterPrint, { once: true })

    // Safety timeout – if afterprint never fires (e.g. print dialog cancelled
    // on some browsers), still resolve after 30 seconds.
    setTimeout(() => {
      iframeWindow?.removeEventListener('afterprint', onAfterPrint)
      resolve()
    }, 30_000)
  })
}