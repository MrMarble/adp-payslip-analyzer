import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'

// Configure worker for browser usage
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.mjs',
    import.meta.url
  ).toString()
}

export interface TextPosition {
  text: string
  x: number
  y: number
  width: number
  height: number
}

export interface PageContent {
  pageNumber: number
  items: TextPosition[]
  rawText: string
}

export interface PdfContent {
  pages: PageContent[]
  fullText: string
}

/**
 * Extract text content from a PDF buffer
 */
export async function extractPdfText(data: ArrayBuffer): Promise<PdfContent> {
  const pdf = await pdfjsLib.getDocument({ data }).promise
  const pages: PageContent[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()

    const items: TextPosition[] = textContent.items
      .filter((item): item is TextItem => 'str' in item)
      .map(item => ({
        text: item.str,
        x: item.transform[4],
        y: item.transform[5],
        width: item.width,
        height: item.height,
      }))

    const rawText = items.map(item => item.text).join(' ')

    pages.push({
      pageNumber: i,
      items,
      rawText,
    })
  }

  const fullText = pages.map(p => p.rawText).join('\n\n')

  return { pages, fullText }
}

/**
 * Group text items by approximate Y position (same line)
 */
export function groupByLines(items: TextPosition[], tolerance = 3): TextPosition[][] {
  if (items.length === 0) return []

  // Sort by Y (descending - PDF coordinates start from bottom) then X
  const sorted = [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) > tolerance) return b.y - a.y
    return a.x - b.x
  })

  const lines: TextPosition[][] = []
  let currentLine: TextPosition[] = [sorted[0]]
  let currentY = sorted[0].y

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i]
    if (Math.abs(item.y - currentY) <= tolerance) {
      currentLine.push(item)
    } else {
      lines.push(currentLine)
      currentLine = [item]
      currentY = item.y
    }
  }
  lines.push(currentLine)

  return lines
}

/**
 * Convert lines to readable text
 */
export function linesToText(lines: TextPosition[][]): string {
  return lines
    .map(line => line.map(item => item.text).join(' '))
    .join('\n')
}
