import { downloadBlob } from '../../lib/utils'
import { resolveImageRefs } from '../../lib/imageStore'

export function exportMarkdown(content: string, filename = 'document.md', customTitle?: string) {
  if (customTitle) {
    filename = customTitle.replace(/[/\\?%*:|"<>]/g, '_') + '.md'
  }
  const footer = '\n\n---\n\n*Made with [Markdown Studio](https://markdownstudio-ai.vercel.app/)*\n'
  const resolved = resolveImageRefs(content)
  const blob = new Blob([resolved + footer], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, filename)
}
