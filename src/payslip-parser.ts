import { extractPdfText, groupByLines, type TextPosition } from './parser'
import { KNOWN_CONCEPTS, isKnownConcept, getConcept } from './concepts'
import type { Payslip, PayslipLineItem, UnknownConcept } from './types'

/**
 * Parse a Spanish number (comma as decimal separator)
 */
function parseSpanishNumber(str: string): number | null {
  if (!str || str.trim() === '') return null
  // Replace comma with dot for parsing
  const normalized = str.trim().replace(',', '.')
  const num = parseFloat(normalized)
  return isNaN(num) ? null : num
}

const SPANISH_MONTHS: Record<string, string> = {
  ENERO: '01',
  FEBRERO: '02',
  MARZO: '03',
  ABRIL: '04',
  MAYO: '05',
  JUNIO: '06',
  JULIO: '07',
  AGOSTO: '08',
  SEPTIEMBRE: '09',
  OCTUBRE: '10',
  NOVIEMBRE: '11',
  DICIEMBRE: '12',
}

/**
 * Parse Spanish date to ISO format (YYYY-MM-DD)
 */
function parseSpanishDate(dateStr: string): string {
  const match = dateStr.match(/(\d{1,2})\s+DE\s+(\w+)\s+DE\s+(\d{4})/i)
  if (!match) return ''
  const [, day, month, year] = match
  const monthNum = SPANISH_MONTHS[month.toUpperCase()]
  if (!monthNum) return ''
  return `${year}-${monthNum}-${day.padStart(2, '0')}`
}

/**
 * Extract payment date from payslip text
 */
function extractPaymentDate(lines: TextPosition[][]): { display: string; sortable: string } {
  for (const line of lines) {
    const text = line.map(item => item.text).join(' ')
    // Look for "FECHA DE ABONO" pattern
    const match = text.match(/FECHA DE ABONO\s+(\d{1,2}\s+DE\s+\w+\s+DE\s+\d{4})/i)
    if (match) {
      return {
        display: match[1],
        sortable: parseSpanishDate(match[1]),
      }
    }
  }
  return { display: '', sortable: '' }
}

/**
 * Extract net pay from payslip
 */
function extractNetPay(lines: TextPosition[][]): number {
  for (const line of lines) {
    const text = line.map(item => item.text).join(' ')
    // Look for "LIQUIDO A RECIBIR" pattern
    const match = text.match(/LIQUIDO A RECIBIR\s+([\d.,]+)€?/i)
    if (match) {
      return parseSpanishNumber(match[1]) ?? 0
    }
  }
  return 0
}

/**
 * Extract totals from payslip
 */
function extractTotals(lines: TextPosition[][]): { totalEarnings: number; totalDeductions: number } {
  for (const line of lines) {
    const text = line.map(item => item.text).join(' ')
    // Look for "TOTALES" line with two amounts
    const match = text.match(/TOTALES\s+([\d.,]+)\s+([\d.,]+)/i)
    if (match) {
      return {
        totalEarnings: parseSpanishNumber(match[1]) ?? 0,
        totalDeductions: parseSpanishNumber(match[2]) ?? 0,
      }
    }
  }
  return { totalEarnings: 0, totalDeductions: 0 }
}

interface RawLineItem {
  code: string
  name: string
  values: string[]
}

/**
 * Extract line items from payslip
 * Line items start with a numeric code (3-4 digits)
 */
function extractRawLineItems(lines: TextPosition[][]): RawLineItem[] {
  const items: RawLineItem[] = []

  for (const line of lines) {
    // Sort by X position to get left-to-right order
    const sorted = [...line].sort((a, b) => a.x - b.x)
    const texts = sorted.map(item => item.text.trim()).filter(t => t !== '')

    if (texts.length === 0) continue

    // Check if line starts with a code (3-4 digit number)
    const codeMatch = texts[0].match(/^(\d{3,4})$/)
    if (!codeMatch) continue

    const code = codeMatch[1]
    const rest = texts.slice(1)

    // Find where the name ends and numbers begin
    let nameEndIndex = 0
    for (let i = 0; i < rest.length; i++) {
      // Check if this looks like a number (may have comma as decimal)
      if (/^[\d.,]+$/.test(rest[i])) {
        nameEndIndex = i
        break
      }
      nameEndIndex = i + 1
    }

    const name = rest.slice(0, nameEndIndex).join(' ')
    const values = rest.slice(nameEndIndex)

    items.push({ code, name, values })
  }

  return items
}

/**
 * Determine if a raw item is an earning or deduction based on its code
 */
function categorizeItem(item: RawLineItem): 'earning' | 'deduction' | 'unknown' {
  const code = parseInt(item.code, 10)
  // Earnings typically have codes < 1000, deductions >= 1000
  if (code < 1000) return 'earning'
  return 'deduction'
}

/**
 * Convert raw item to PayslipLineItem
 */
function toPayslipLineItem(item: RawLineItem): PayslipLineItem {
  const concept = getConcept(item.code)
  const category = categorizeItem(item)

  // Parse values based on how many we have
  // Possible patterns:
  // - [cantidad, precio, amount] - full format
  // - [amount] - just the value
  // - [cantidad, precio, empty, amount] - deduction with base/rate
  let cantidadBase: number | null = null
  let precio: number | null = null
  let devengos: number | null = null
  let deducciones: number | null = null

  const values = item.values

  if (values.length === 1) {
    // Just the amount
    const amount = parseSpanishNumber(values[0])
    if (category === 'earning') {
      devengos = amount
    } else {
      deducciones = amount
    }
  } else if (values.length === 2) {
    // Could be [base, amount] for deductions without rate
    cantidadBase = parseSpanishNumber(values[0])
    if (category === 'earning') {
      devengos = parseSpanishNumber(values[1])
    } else {
      deducciones = parseSpanishNumber(values[1])
    }
  } else if (values.length >= 3) {
    // Full format: [cantidad, precio, amount]
    cantidadBase = parseSpanishNumber(values[0])
    precio = parseSpanishNumber(values[1])
    if (category === 'earning') {
      devengos = parseSpanishNumber(values[2])
    } else {
      deducciones = parseSpanishNumber(values[2])
    }
  }

  return {
    code: item.code,
    name: concept?.name ?? item.name,
    description: concept?.description ?? '',
    cantidadBase,
    precio,
    devengos,
    deducciones,
  }
}

/**
 * Parse a payslip PDF and extract structured data
 */
export async function parsePayslip(data: ArrayBuffer): Promise<Payslip> {
  const content = await extractPdfText(data)

  // Only process first page (page 2 is employer contributions)
  const page1 = content.pages[0]
  if (!page1) {
    throw new Error('PDF has no pages')
  }

  const lines = groupByLines(page1.items)

  const { display: paymentDate, sortable: sortableDate } = extractPaymentDate(lines)
  const netPay = extractNetPay(lines)
  const { totalEarnings, totalDeductions } = extractTotals(lines)

  const rawItems = extractRawLineItems(lines)

  const earnings: PayslipLineItem[] = []
  const deductions: PayslipLineItem[] = []

  for (const item of rawItems) {
    // Skip unknown concepts
    if (!isKnownConcept(item.code)) continue

    const lineItem = toPayslipLineItem(item)
    const category = categorizeItem(item)

    if (category === 'earning') {
      earnings.push(lineItem)
    } else {
      deductions.push(lineItem)
    }
  }

  return {
    paymentDate,
    sortableDate,
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    netPay,
  }
}

/**
 * Detect unknown concepts in a payslip PDF
 * Use this to find new concepts that need to be added to the map
 */
export async function detectUnknownConcepts(data: ArrayBuffer): Promise<UnknownConcept[]> {
  const content = await extractPdfText(data)
  const page1 = content.pages[0]
  if (!page1) return []

  const lines = groupByLines(page1.items)
  const rawItems = extractRawLineItems(lines)

  const unknown: UnknownConcept[] = []

  for (const item of rawItems) {
    if (!isKnownConcept(item.code)) {
      const lineItem = toPayslipLineItem(item)
      unknown.push({
        code: item.code,
        name: item.name,
        cantidadBase: lineItem.cantidadBase,
        precio: lineItem.precio,
        devengos: lineItem.devengos,
        deducciones: lineItem.deducciones,
      })
    }
  }

  return unknown
}
