/**
 * A single line item from the payslip
 */
export interface PayslipLineItem {
  code: string
  name: string
  description: string
  cantidadBase: number | null
  precio: number | null
  devengos: number | null
  deducciones: number | null
}

/**
 * Parsed payslip data
 */
export interface Payslip {
  paymentDate: string
  /** ISO date string for sorting (YYYY-MM-DD) */
  sortableDate: string
  earnings: PayslipLineItem[]
  deductions: PayslipLineItem[]
  totalEarnings: number
  totalDeductions: number
  netPay: number
}

/**
 * Unknown concept detected in a payslip
 */
export interface UnknownConcept {
  code: string
  name: string
  cantidadBase: number | null
  precio: number | null
  devengos: number | null
  deducciones: number | null
}
