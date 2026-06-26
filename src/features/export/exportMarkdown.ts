import { downloadBlob } from '../../lib/utils'

export function exportMarkdown(content: string, filename = 'document.md', customTitle?: string) {
  if (customTitle) {
    filename = customTitle.replace(/[/\\?%*:|"<>]/g, '_') + '.md'
  }
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, filename)
}
