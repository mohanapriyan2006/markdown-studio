import { downloadBlob } from '../../lib/utils'
import { buildPreviewHtml } from '../preview/IframePreview'

export function exportHtml(markdown: string, customCss = '', filename = 'document.html') {
  if (!markdown.trim()) {
    alert('Nothing to export yet — write some Markdown first.')
    return
  }

  const html = buildPreviewHtml(markdown, customCss)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  downloadBlob(blob, filename)
}
