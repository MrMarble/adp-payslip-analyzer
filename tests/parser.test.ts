import { describe, it, expect } from 'vitest'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { extractPdfText, groupByLines, linesToText } from '../src/parser'

const fixturesDir = join(import.meta.dirname, 'fixtures')

describe('PDF Parser', () => {
  it('should extract text from november PDF', async () => {
    const pdfBuffer = await readFile(join(fixturesDir, 'november.PDF'))
    const content = await extractPdfText(pdfBuffer.buffer as ArrayBuffer)

    expect(content.pages.length).toBeGreaterThan(0)
    expect(content.fullText.length).toBeGreaterThan(0)

    // Log the structured text for analysis
    console.log('=== NOVEMBER PAYSLIP - RAW TEXT ===')
    console.log(content.fullText)
    console.log('\n=== NOVEMBER PAYSLIP - BY LINES ===')
    for (const page of content.pages) {
      const lines = groupByLines(page.items)
      console.log(linesToText(lines))
    }
  })

  it('should extract text from december PDF', async () => {
    const pdfBuffer = await readFile(join(fixturesDir, 'december.PDF'))
    const content = await extractPdfText(pdfBuffer.buffer as ArrayBuffer)

    expect(content.pages.length).toBeGreaterThan(0)
    expect(content.fullText.length).toBeGreaterThan(0)

    // Log the structured text for analysis
    console.log('=== DECEMBER PAYSLIP - RAW TEXT ===')
    console.log(content.fullText)
    console.log('\n=== DECEMBER PAYSLIP - BY LINES ===')
    for (const page of content.pages) {
      const lines = groupByLines(page.items)
      console.log(linesToText(lines))
    }
  })
})
