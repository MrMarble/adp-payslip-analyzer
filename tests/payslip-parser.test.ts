import { describe, it, expect } from 'vitest'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { parsePayslip, detectUnknownConcepts } from '../src/payslip-parser'

const fixturesDir = join(import.meta.dirname, 'fixtures')

describe('Payslip Parser', () => {
  describe('parsePayslip', () => {
    it('should parse november payslip', async () => {
      const pdfBuffer = await readFile(join(fixturesDir, 'november.PDF'))
      const payslip = await parsePayslip(pdfBuffer.buffer as ArrayBuffer)

      console.log('=== NOVEMBER PARSED ===')
      console.log(JSON.stringify(payslip, null, 2))

      // Check payment date
      expect(payslip.paymentDate).toBe('26 DE NOVIEMBRE DE 2025')

      // Check totals
      expect(payslip.totalEarnings).toBe(5692.05)
      expect(payslip.totalDeductions).toBe(2336.04)
      expect(payslip.netPay).toBe(3356.01)

      // Check earnings exist
      expect(payslip.earnings.length).toBeGreaterThan(0)
      const baseSalary = payslip.earnings.find(e => e.code === '321')
      expect(baseSalary).toBeDefined()
      expect(baseSalary?.devengos).toBe(4709.25)

      // Check deductions exist
      expect(payslip.deductions.length).toBeGreaterThan(0)
      const irpf = payslip.deductions.find(d => d.code === '1051')
      expect(irpf).toBeDefined()
      expect(irpf?.deducciones).toBe(1294.37)
    })

    it('should parse december payslip', async () => {
      const pdfBuffer = await readFile(join(fixturesDir, 'december.PDF'))
      const payslip = await parsePayslip(pdfBuffer.buffer as ArrayBuffer)

      console.log('=== DECEMBER PARSED ===')
      console.log(JSON.stringify(payslip, null, 2))

      // Check payment date
      expect(payslip.paymentDate).toBe('19 DE DICIEMBRE DE 2025')

      // Check totals
      expect(payslip.totalEarnings).toBe(4709.25)
      expect(payslip.totalDeductions).toBe(2049.9)
      expect(payslip.netPay).toBe(2659.35)

      // December has STOCK PP that November doesn't
      const stockPP = payslip.earnings.find(e => e.code === '716')
      expect(stockPP).toBeDefined()
    })
  })

  describe('detectUnknownConcepts', () => {
    it('should detect no unknown concepts in november', async () => {
      const pdfBuffer = await readFile(join(fixturesDir, 'november.PDF'))
      const unknown = await detectUnknownConcepts(pdfBuffer.buffer as ArrayBuffer)

      console.log('=== NOVEMBER UNKNOWN CONCEPTS ===')
      console.log(JSON.stringify(unknown, null, 2))

      // All concepts should be known
      expect(unknown.length).toBe(0)
    })

    it('should detect no unknown concepts in december', async () => {
      const pdfBuffer = await readFile(join(fixturesDir, 'december.PDF'))
      const unknown = await detectUnknownConcepts(pdfBuffer.buffer as ArrayBuffer)

      console.log('=== DECEMBER UNKNOWN CONCEPTS ===')
      console.log(JSON.stringify(unknown, null, 2))

      // All concepts should be known
      expect(unknown.length).toBe(0)
    })
  })
})
