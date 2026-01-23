import { describe, it, expect } from 'vitest'
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import { parsePayslip, detectUnknownConcepts } from '../src/payslip-parser'

const fixturesDir = join(import.meta.dirname, 'fixtures')

async function getPdfFiles(): Promise<string[]> {
  try {
    const files = await readdir(fixturesDir)
    return files.filter(f => f.toLowerCase().endsWith('.pdf'))
  } catch {
    return []
  }
}

async function loadPdf(name: string): Promise<ArrayBuffer> {
  const fileBuffer = await readFile(join(fixturesDir, name))
  // Create a copy to avoid detached buffer issues
  return fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength
  )
}

describe('Payslip Parser', () => {
  it('should parse all fixture PDFs without unknown concepts', async () => {
    const pdfFiles = await getPdfFiles()

    if (pdfFiles.length === 0) {
      console.warn('No PDF fixtures found in tests/fixtures/ - skipping test')
      console.warn('Add your payslip PDFs to tests/fixtures/ to run this test locally')
      return
    }

    console.log(`Found ${pdfFiles.length} PDF fixture(s)`)

    for (const name of pdfFiles) {
      console.log(`\nProcessing: ${name}`)

      // Parse the payslip
      const parseBuffer = await loadPdf(name)
      const payslip = await parsePayslip(parseBuffer)

      // Check required fields are present
      expect(payslip.paymentDate, `${name}: missing payment date`).toBeTruthy()
      expect(payslip.sortableDate, `${name}: missing sortable date`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(payslip.netPay, `${name}: net pay should be positive`).toBeGreaterThan(0)
      expect(payslip.totalEarnings, `${name}: total earnings should be positive`).toBeGreaterThan(0)
      expect(payslip.totalDeductions, `${name}: total deductions should be positive`).toBeGreaterThan(0)

      // Check base salary is present (code 321)
      const baseSalary = payslip.earnings.find(e => e.code === '321')
      expect(baseSalary, `${name}: missing base salary (code 321)`).toBeDefined()
      expect(baseSalary?.devengos, `${name}: base salary should have amount`).toBeGreaterThan(0)

      console.log(`  Date: ${payslip.paymentDate}`)
      console.log(`  Base Salary: ${baseSalary?.devengos?.toFixed(2)}€`)
      console.log(`  Net Pay: ${payslip.netPay.toFixed(2)}€`)
      console.log(`  Earnings: ${payslip.earnings.length} items`)
      console.log(`  Deductions: ${payslip.deductions.length} items`)

      // Check for unknown concepts (need fresh buffer)
      const detectBuffer = await loadPdf(name)
      const unknown = await detectUnknownConcepts(detectBuffer)

      if (unknown.length > 0) {
        console.error(`\nUnknown concepts found in ${name}:`)
        for (const concept of unknown) {
          console.error(`  Code: ${concept.code}, Name: ${concept.name}`)
          if (concept.devengos) console.error(`    Devengos: ${concept.devengos}`)
          if (concept.deducciones) console.error(`    Deducciones: ${concept.deducciones}`)
        }
      }

      expect(unknown, `Unknown concepts found in ${name}`).toHaveLength(0)
    }
  })
})
