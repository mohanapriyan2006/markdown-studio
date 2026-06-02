import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HorizontalPositionAlign,
} from 'docx'
import { saveAs } from 'file-saver'

/* ── Minimal CSS parser for DOCX-relevant props ─────────────── */
function extractCssProps(css: string, selector: string): Record<string, string> {
  const props: Record<string, string> = {}
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
  const selEsc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`${selEsc}\\s*\\{([^}]*)\\}`, 'gi')
  let m
  while ((m = regex.exec(cleaned)) !== null) {
    m[1].split(';').forEach((decl) => {
      const [k, v] = decl.split(':').map((s) => s.trim())
      if (k && v) props[k] = v
    })
  }
  return props
}

function toHalfPoints(val: string): number | undefined {
  const n = parseFloat(val)
  if (Number.isNaN(n)) return undefined
  if (val.includes('rem')) return Math.round(n * 16 * 2)   // 16px base * 2 for half-points
  if (val.includes('px')) return Math.round(n * 0.75 * 2) // px → pt → half-points
  if (val.includes('pt')) return Math.round(n * 2)
  if (val.includes('em')) return Math.round(n * 16 * 2)
  return Math.round(n * 2) // fallback: treat as pt
}

function cleanFont(font: string | undefined): string | undefined {
  if (!font) return undefined
  const q = font.match(/"([^"]+)"|'([^']+)'/)
  if (q) return q[1] || q[2]
  return font.split(',')[0].trim()
}

function cleanColor(color: string | undefined): string | undefined {
  if (!color) return undefined
  const hex = color.match(/#([0-9a-fA-F]{3,6})/)
  if (hex) return hex[1]
  if (color.startsWith('rgb')) {
    const vals = color.match(/\d+/g)
    if (vals && vals.length >= 3) {
      return (
        (parseInt(vals[0], 10) << 16 |
         parseInt(vals[1], 10) << 8 |
         parseInt(vals[2], 10))
        .toString(16)
        .padStart(6, '0')
      )
    }
  }
  return undefined
}

function wrapLine(line: string, maxLen: number): string[] {
  if (line.length <= maxLen) return [line]
  const chunks: string[] = []
  let start = 0
  while (start < line.length) {
    chunks.push(line.slice(start, start + maxLen))
    start += maxLen
  }
  return chunks
}

function wrapCodeBlock(lines: string[], maxLen = 100): string {
  return lines.flatMap((line) => wrapLine(line, maxLen)).join('\n')
}

/* ── Simple markdown-to-DOCX converter ───────────────────────── */
function parseMarkdownToDocx(markdown: string, customCss = '') {
  const aProps = extractCssProps(customCss, 'a')
  const codeProps = extractCssProps(customCss, 'code')
  const preProps = extractCssProps(customCss, 'pre')
  const bqProps = extractCssProps(customCss, 'blockquote')
  const thProps = extractCssProps(customCss, 'th')

  const linkColor = cleanColor(aProps['color']) ?? '6366f1'
  const codeColor = cleanColor(codeProps['color']) ?? '6366f1'
  const codeBg = cleanColor(codeProps['background']) ?? cleanColor(codeProps['background-color']) ?? cleanColor(preProps['background']) ?? cleanColor(preProps['background-color']) ?? 'F1F5F9'
  const bqTextColor = cleanColor(bqProps['color']) ?? '475569'
  const bqBorderColor = cleanColor(bqProps['border-left-color']) ?? cleanColor(bqProps['border-color']) ?? '6366f1'
  const bqBg = cleanColor(bqProps['background']) ?? cleanColor(bqProps['background-color']) ?? undefined
  const thBg = cleanColor(thProps['background']) ?? cleanColor(thProps['background-color']) ?? 'F8FAFC'

  const lines = markdown.split('\n')
  const children: (Paragraph | Table)[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Headings
    const h1 = line.match(/^#\s+(.+)/)
    const h2 = line.match(/^##\s+(.+)/)
    const h3 = line.match(/^###\s+(.+)/)
    const h4 = line.match(/^####\s+(.+)/)

    if (h1) {
      children.push(new Paragraph({ text: h1[1], heading: HeadingLevel.HEADING_1, spacing: { after: 200, before: 400 } }))
    } else if (h2) {
      children.push(new Paragraph({ text: h2[1], heading: HeadingLevel.HEADING_2, spacing: { after: 160, before: 320 } }))
    } else if (h3) {
      children.push(new Paragraph({ text: h3[1], heading: HeadingLevel.HEADING_3, spacing: { after: 120, before: 240 } }))
    } else if (h4) {
      children.push(new Paragraph({ text: h4[1], heading: HeadingLevel.HEADING_4, spacing: { after: 100, before: 200 } }))
    }
    // Horizontal rule
    else if (line.match(/^---+$/)) {
      children.push(new Paragraph({ text: '', border: { bottom: { color: 'E2E8F0', space: 1, style: BorderStyle.SINGLE, size: 6 } }, spacing: { after: 200 } }))
    }
    // Table detection
    else if (line.includes('|') && lines[i + 1] && lines[i + 1].includes('---')) {
      const headers = line.split('|').map(s => s.trim()).filter(Boolean)
      i++ // skip separator row
      const rows: string[][] = []

      while (i + 1 < lines.length && lines[i + 1].includes('|')) {
        i++
        const cells = lines[i].split('|').map(s => s.trim()).filter(Boolean)
        rows.push(cells)
      }

      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: headers.map(h => new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })], alignment: AlignmentType.LEFT })],
              shading: { fill: thBg },
            })),
          }),
          ...rows.map(row => new TableRow({
            children: row.map(cell => new TableCell({
              children: [new Paragraph({ text: stripInlineMarkdown(cell) })],
            })),
          })),
        ],
      })
      children.push(table)
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      const text = line.replace(/^>\s*/, '')
      const bqPara: any = {
        children: [new TextRun({ text: stripInlineMarkdown(text), italics: true, color: bqTextColor })],
        indent: { left: 720 },
        spacing: { after: 120 },
        border: { left: { color: bqBorderColor, space: 8, style: BorderStyle.SINGLE, size: 12 } },
      }
      if (bqBg) bqPara.shading = { fill: bqBg }
      children.push(new Paragraph(bqPara))
    }
    // Unordered list
    else if (line.match(/^[-*+]\s+/)) {
      const text = line.replace(/^[-*+]\s+/, '')
      children.push(new Paragraph({
        children: parseInlineRuns(text, linkColor, codeColor),
        bullet: { level: 0 },
        spacing: { after: 60 },
      }))
    }
    // Ordered list
    else if (line.match(/^\d+\.\s+/)) {
      const text = line.replace(/^\d+\.\s+/, '')
      children.push(new Paragraph({
        children: parseInlineRuns(text, linkColor, codeColor),
        numbering: { reference: 'numbered-list', level: 0 },
        spacing: { after: 60 },
      }))
    }
    // Code block
    else if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (codeLines.length) {
        const codeText = wrapCodeBlock(codeLines)
        children.push(new Paragraph({
          children: [new TextRun({ text: codeText, font: 'Courier New', size: 20, color: codeColor })],
          shading: { fill: codeBg },
          spacing: { after: 200, before: 200 },
          indent: { left: 360, right: 360 },
        }))
      }
    }
    // Empty line
    else if (!line.trim()) {
      children.push(new Paragraph({ spacing: { after: 80 } }))
    }
    // Normal paragraph
    else {
      const runs = parseInlineRuns(line, linkColor, codeColor)
      if (runs.length > 0) {
        children.push(new Paragraph({ children: runs, spacing: { after: 160 } }))
      }
    }

    i++
  }

  return children
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
}

function parseInlineRuns(text: string, linkColor = '6366f1', codeColor = '6366f1'): TextRun[] {
  const runs: TextRun[] = []
  // Simple parser for **bold**, *italic*, `code`, ~~strikethrough~~
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~|(\[.+?\]\(.+?\))|([^*`~[\]]+))/g
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match[2]) runs.push(new TextRun({ text: match[2], bold: true }))
    else if (match[3]) runs.push(new TextRun({ text: match[3], italics: true }))
    else if (match[4]) runs.push(new TextRun({ text: match[4], font: 'Courier New', size: 20, color: codeColor }))
    else if (match[5]) runs.push(new TextRun({ text: match[5], strike: true }))
    else if (match[6]) {
      const linkMatch = match[6].match(/\[(.+?)\]\(.+?\)/)
      if (linkMatch) runs.push(new TextRun({ text: linkMatch[1], color: linkColor }))
    }
    else if (match[7]) runs.push(new TextRun({ text: match[7] }))
  }
  return runs.length ? runs : [new TextRun({ text })]
}

export async function exportDocx(markdown: string, customCss = '', filename = 'document.docx') {
  const children = parseMarkdownToDocx(markdown, customCss)

  // Extract CSS-derived defaults
  const bodyProps = extractCssProps(customCss, 'body')
  const h1Props = extractCssProps(customCss, 'h1')
  const h2Props = extractCssProps(customCss, 'h2')
  const h3Props = extractCssProps(customCss, 'h3')

  const bodyFont = bodyProps['font-family'] ? cleanFont(bodyProps['font-family']) : 'Calibri'
  const bodyColor = bodyProps['color'] ? cleanColor(bodyProps['color']) : undefined
  const bodySize = bodyProps['font-size'] ? toHalfPoints(bodyProps['font-size']) : 24
  const bodyLine = bodyProps['line-height']
    ? Math.round(parseFloat(bodyProps['line-height']) * 240)
    : 360

  const doc = new Document({
    numbering: {
      config: [{
        reference: 'numbered-list',
        levels: [{
          level: 0,
          format: 'decimal',
          text: '%1.',
          alignment: AlignmentType.LEFT,
        }],
      }],
    },
    styles: {
      default: {
        document: {
          run: { font: bodyFont, size: bodySize, ...(bodyColor && { color: bodyColor }) },
          paragraph: { spacing: { line: bodyLine } },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          run: {
            size: h1Props['font-size'] ? toHalfPoints(h1Props['font-size']) : 48,
            bold: !h1Props['font-weight'] || h1Props['font-weight'] === 'bold' || parseInt(h1Props['font-weight'], 10) >= 600,
            color: h1Props['color'] ? cleanColor(h1Props['color']) : '0f172a',
            font: h1Props['font-family'] ? cleanFont(h1Props['font-family']) : bodyFont,
          },
          paragraph: { spacing: { after: 200, before: 400 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          run: {
            size: h2Props['font-size'] ? toHalfPoints(h2Props['font-size']) : 36,
            bold: !h2Props['font-weight'] || h2Props['font-weight'] === 'bold' || parseInt(h2Props['font-weight'], 10) >= 600,
            color: h2Props['color'] ? cleanColor(h2Props['color']) : '1e293b',
            font: h2Props['font-family'] ? cleanFont(h2Props['font-family']) : bodyFont,
          },
          paragraph: { spacing: { after: 160, before: 320 } },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          run: {
            size: h3Props['font-size'] ? toHalfPoints(h3Props['font-size']) : 28,
            bold: !h3Props['font-weight'] || h3Props['font-weight'] === 'bold' || parseInt(h3Props['font-weight'], 10) >= 600,
            color: h3Props['color'] ? cleanColor(h3Props['color']) : '334155',
            font: h3Props['font-family'] ? cleanFont(h3Props['font-family']) : bodyFont,
          },
          paragraph: { spacing: { after: 120, before: 240 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, filename)
}
