import { downloadBlob } from '../../lib/utils'

export function exportMarkdown(content: string, filename = 'document.md', customTitle?: string) {
  if (customTitle) {
    filename = customTitle.replace(/[/\\?%*:|"<>]/g, '_') + '.md'
  }
  const footer = '\n\n---\n\n*Made with [Markdown Studio](https://markdownstudio-ai.vercel.app/)*\n'
  const blob = new Blob([content + footer], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, filename)
}
