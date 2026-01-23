/**
 * Known ADP payslip concepts with descriptions
 */
export interface ConceptDefinition {
  code: string
  name: string
  description: string
  type: 'earning' | 'deduction'
}

export const KNOWN_CONCEPTS: Record<string, ConceptDefinition> = {
  // Earnings (DEVENGOS)
  '321': {
    code: '321',
    name: 'SALARIO BASE',
    description: 'Base monthly salary before any additions or deductions',
    type: 'earning',
  },
  '413': {
    code: '413',
    name: 'Q BONUS',
    description: 'Quarterly bonus payment',
    type: 'earning',
  },
  '438': {
    code: '438',
    name: 'BONUS',
    description: 'Variable bonus payment',
    type: 'earning',
  },
  '637': {
    code: '637',
    name: 'SEGURO ME',
    description: 'Medical insurance benefit paid by employer (in-kind benefit)',
    type: 'earning',
  },
  '638': {
    code: '638',
    name: 'AP.PENSIO',
    description: 'Employer contribution to pension plan (in-kind benefit)',
    type: 'earning',
  },
  '702': {
    code: '702',
    name: 'IN KIND M',
    description: 'In-kind medical benefit (taxable value of medical insurance)',
    type: 'earning',
  },
  '711': {
    code: '711',
    name: 'DENTAL IN',
    description: 'Dental insurance benefit paid by employer',
    type: 'earning',
  },
  '715': {
    code: '715',
    name: 'T.RESTAU',
    description: 'Restaurant vouchers/tickets (tax-exempt up to legal limit)',
    type: 'earning',
  },
  '716': {
    code: '716',
    name: 'STOCK PP',
    description: 'Stock purchase plan benefit (taxable discount on company stock)',
    type: 'earning',
  },

  // Deductions (DEDUCCIONES)
  '1005': {
    code: '1005',
    name: 'SEGURIDAD SOCIAL',
    description: 'Employee Social Security contribution (contingencias comunes)',
    type: 'deduction',
  },
  '1008': {
    code: '1008',
    name: 'DESEMPLEO',
    description: 'Unemployment insurance contribution',
    type: 'deduction',
  },
  '1009': {
    code: '1009',
    name: 'FORMACION PROFES',
    description: 'Professional training contribution',
    type: 'deduction',
  },
  '1010': {
    code: '1010',
    name: 'SEG.SOCIAL MEI',
    description: 'Intergenerational Equity Mechanism (MEI) for pension sustainability',
    type: 'deduction',
  },
  '1012': {
    code: '1012',
    name: 'COTIZACION SOLIDARIA',
    description: 'Solidarity contribution on earnings above Social Security ceiling',
    type: 'deduction',
  },
  '1051': {
    code: '1051',
    name: 'IMP A CUENTA RENTA',
    description: 'Income tax withholding (IRPF)',
    type: 'deduction',
  },
  '1057': {
    code: '1057',
    name: 'IMP A CTA SEG.MEDICO',
    description: 'IRPF withholding on medical insurance benefit (in-kind taxation)',
    type: 'deduction',
  },
  '1075': {
    code: '1075',
    name: 'IMP A CTA SEG.DENTAL',
    description: 'IRPF withholding on dental insurance benefit (in-kind taxation)',
    type: 'deduction',
  },
  '1085': {
    code: '1085',
    name: 'IMP A CTA STOCK P.P',
    description: 'IRPF withholding on stock purchase plan benefit',
    type: 'deduction',
  },
  '1122': {
    code: '1122',
    name: 'COTIZAC.SOLIDARIA SS',
    description: 'Additional solidarity contribution to Social Security',
    type: 'deduction',
  },
  '1542': {
    code: '1542',
    name: 'ESPP1',
    description: 'Employee Stock Purchase Plan deduction (voluntary savings for stock purchase)',
    type: 'deduction',
  },
  '1550': {
    code: '1550',
    name: 'DEDUC.PLAN PENSIONES',
    description: 'Pension plan deduction (employee contribution to company pension)',
    type: 'deduction',
  },
}

/**
 * Get concept definition by code
 */
export function getConcept(code: string): ConceptDefinition | undefined {
  return KNOWN_CONCEPTS[code]
}

/**
 * Check if a concept code is known
 */
export function isKnownConcept(code: string): boolean {
  return code in KNOWN_CONCEPTS
}

/**
 * Bonus concept codes (for special highlighting)
 */
export const BONUS_CODES = ['413', '438']

/**
 * Check if a concept code is a bonus
 */
export function isBonusConcept(code: string): boolean {
  return BONUS_CODES.includes(code)
}
