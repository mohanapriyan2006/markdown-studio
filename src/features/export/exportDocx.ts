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

// Simple markdown-to-DOCX converter
function parseMarkdownToDocx(markdown: string) {
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
              shading: { fill: 'F8FAFC' },
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
      children.push(new Paragraph({
        children: [new TextRun({ text: stripInlineMarkdown(text), italics: true, color: '475569' })],
        indent: { left: 720 },
        spacing: { after: 120 },
        border: { left: { color: '6366f1', space: 8, style: BorderStyle.SINGLE, size: 12 } },
      }))
    }
    // Unordered list
    else if (line.match(/^[-*+]\s+/)) {
      const text = line.replace(/^[-*+]\s+/, '')
      children.push(new Paragraph({
        children: parseInlineRuns(text),
        bullet: { level: 0 },
        spacing: { after: 60 },
      }))
    }
    // Ordered list
    else if (line.match(/^\d+\.\s+/)) {
      const text = line.replace(/^\d+\.\s+/, '')
      children.push(new Paragraph({
        children: parseInlineRuns(text),
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
        children.push(new Paragraph({
          children: [new TextRun({ text: codeLines.join('\n'), font: 'Courier New', size: 20, color: '6366f1' })],
          shading: { fill: 'F1F5F9' },
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
      const runs = parseInlineRuns(line)
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

function parseInlineRuns(text: string): TextRun[] {
  const runs: TextRun[] = []
  // Simple parser for **bold**, *italic*, `code`, ~~strikethrough~~
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~|(\[.+?\]\(.+?\))|([^*`~[\]]+))/g
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match[2]) runs.push(new TextRun({ text: match[2], bold: true }))
    else if (match[3]) runs.push(new TextRun({ text: match[3], italics: true }))
    else if (match[4]) runs.push(new TextRun({ text: match[4], font: 'Courier New', size: 20, color: '6366f1' }))
    else if (match[5]) runs.push(new TextRun({ text: match[5], strike: true }))
    else if (match[6]) {
      const linkMatch = match[6].match(/\[(.+?)\]\(.+?\)/)
      if (linkMatch) runs.push(new TextRun({ text: linkMatch[1], color: '6366f1' }))
    }
    else if (match[7]) runs.push(new TextRun({ text: match[7] }))
  }
  return runs.length ? runs : [new TextRun({ text })]
}

export async function exportDocx(markdown: string, filename = 'document.docx') {
  const children = parseMarkdownToDocx(markdown)

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
          run: { font: 'Calibri', size: 24 },
          paragraph: { spacing: { line: 360 } },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          run: { size: 48, bold: true, color: '0f172a', font: 'Calibri' },
          paragraph: { spacing: { after: 200, before: 400 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          run: { size: 36, bold: true, color: '1e293b', font: 'Calibri' },
          paragraph: { spacing: { after: 160, before: 320 } },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          run: { size: 28, bold: true, color: '334155', font: 'Calibri' },
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
