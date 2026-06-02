import { downloadBlob } from '../../lib/utils'

export function exportMarkdown(content: string, filename = 'document.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, filename)
}
