import type { Payslip } from '../types'

export const demoPayslips: Payslip[] = [
  {
    paymentDate: '31 DE ENERO DE 2024',
    sortableDate: '2024-01-31',
    earnings: [
      {
        code: '321',
        name: 'SALARIO BASE',
        description: 'Base monthly salary before any additions or deductions',
        cantidadBase: 30,
        precio: 1250.00,
        devengos: 3750.00,
        deducciones: null
      },
      {
        code: '413',
        name: 'Q BONUS',
        description: 'Quarterly bonus payment',
        cantidadBase: 1,
        precio: 1200.00,
        devengos: 1200.00,
        deducciones: null
      },
      {
        code: '637',
        name: 'SEGURO ME',
        description: 'Medical insurance benefit paid by employer (in-kind benefit)',
        cantidadBase: 1,
        precio: 85.50,
        devengos: 85.50,
        deducciones: null
      },
      {
        code: '715',
        name: 'T.RESTAU',
        description: 'Restaurant vouchers/tickets (tax-exempt up to legal limit)',
        cantidadBase: 22,
        precio: 11.00,
        devengos: 242.00,
        deducciones: null
      }
    ],
    deductions: [
      {
        code: '1005',
        name: 'SEGURIDAD SOCIAL',
        description: 'Employee Social Security contribution (contingencias comunes)',
        cantidadBase: 3750.00,
        precio: 4.70,
        devengos: null,
        deducciones: 176.25
      },
      {
        code: '1008',
        name: 'DESEMPLEO',
        description: 'Unemployment insurance contribution',
        cantidadBase: 3750.00,
        precio: 1.55,
        devengos: null,
        deducciones: 58.13
      },
      {
        code: '1009',
        name: 'FORMACION PROFES',
        description: 'Professional training contribution',
        cantidadBase: 3750.00,
        precio: 0.10,
        devengos: null,
        deducciones: 3.75
      },
      {
        code: '1010',
        name: 'SEG.SOCIAL MEI',
        description: 'Intergenerational Equity Mechanism (MEI) for pension sustainability',
        cantidadBase: 3750.00,
        precio: 0.13,
        devengos: null,
        deducciones: 4.88
      },
      {
        code: '1012',
        name: 'COTIZACION SOLIDARIA',
        description: 'Solidarity contribution on earnings above Social Security ceiling',
        cantidadBase: 3750.00,
        precio: 0.15,
        devengos: null,
        deducciones: 5.63
      },
      {
        code: '1051',
        name: 'IMP A CUENTA RENTA',
        description: 'Income tax withholding (IRPF)',
        cantidadBase: null,
        precio: null,
        devengos: null,
        deducciones: 890.50
      }
    ],
    totalEarnings: 5277.50,
    totalDeductions: 1139.14,
    netPay: 4138.36
  },
  {
    paymentDate: '29 DE FEBRERO DE 2024',
    sortableDate: '2024-02-29',
    earnings: [
      {
        code: '321',
        name: 'SALARIO BASE',
        description: 'Base monthly salary before any additions or deductions',
        cantidadBase: 30,
        precio: 1250.00,
        devengos: 3750.00,
        deducciones: null
      },
      {
        code: '637',
        name: 'SEGURO ME',
        description: 'Medical insurance benefit paid by employer (in-kind benefit)',
        cantidadBase: 1,
        precio: 85.50,
        devengos: 85.50,
        deducciones: null
      },
      {
        code: '715',
        name: 'T.RESTAU',
        description: 'Restaurant vouchers/tickets (tax-exempt up to legal limit)',
        cantidadBase: 20,
        precio: 11.00,
        devengos: 220.00,
        deducciones: null
      }
    ],
    deductions: [
      {
        code: '1005',
        name: 'SEGURIDAD SOCIAL',
        description: 'Employee Social Security contribution (contingencias comunes)',
        cantidadBase: 3750.00,
        precio: 4.70,
        devengos: null,
        deducciones: 176.25
      },
      {
        code: '1008',
        name: 'DESEMPLEO',
        description: 'Unemployment insurance contribution',
        cantidadBase: 3750.00,
        precio: 1.55,
        devengos: null,
        deducciones: 58.13
      },
      {
        code: '1009',
        name: 'FORMACION PROFES',
        description: 'Professional training contribution',
        cantidadBase: 3750.00,
        precio: 0.10,
        devengos: null,
        deducciones: 3.75
      },
      {
        code: '1010',
        name: 'SEG.SOCIAL MEI',
        description: 'Intergenerational Equity Mechanism (MEI) for pension sustainability',
        cantidadBase: 3750.00,
        precio: 0.13,
        devengos: null,
        deducciones: 4.88
      },
      {
        code: '1051',
        name: 'IMP A CUENTA RENTA',
        description: 'Income tax withholding (IRPF)',
        cantidadBase: null,
        precio: null,
        devengos: null,
        deducciones: 780.25
      }
    ],
    totalEarnings: 4055.50,
    totalDeductions: 1023.26,
    netPay: 3032.24
  },
  {
    paymentDate: '31 DE MARZO DE 2024',
    sortableDate: '2024-03-31',
    earnings: [
      {
        code: '321',
        name: 'SALARIO BASE',
        description: 'Base monthly salary before any additions or deductions',
        cantidadBase: 30,
        precio: 1280.00,
        devengos: 3840.00,
        deducciones: null
      },
      {
        code: '438',
        name: 'BONUS',
        description: 'Variable bonus payment',
        cantidadBase: 1,
        precio: 800.00,
        devengos: 800.00,
        deducciones: null
      },
      {
        code: '637',
        name: 'SEGURO ME',
        description: 'Medical insurance benefit paid by employer (in-kind benefit)',
        cantidadBase: 1,
        precio: 85.50,
        devengos: 85.50,
        deducciones: null
      },
      {
        code: '715',
        name: 'T.RESTAU',
        description: 'Restaurant vouchers/tickets (tax-exempt up to legal limit)',
        cantidadBase: 21,
        precio: 11.00,
        devengos: 231.00,
        deducciones: null
      }
    ],
    deductions: [
      {
        code: '1005',
        name: 'SEGURIDAD SOCIAL',
        description: 'Employee Social Security contribution (contingencias comunes)',
        cantidadBase: 3840.00,
        precio: 4.70,
        devengos: null,
        deducciones: 180.48
      },
      {
        code: '1008',
        name: 'DESEMPLEO',
        description: 'Unemployment insurance contribution',
        cantidadBase: 3840.00,
        precio: 1.55,
        devengos: null,
        deducciones: 59.52
      },
      {
        code: '1009',
        name: 'FORMACION PROFES',
        description: 'Professional training contribution',
        cantidadBase: 3840.00,
        precio: 0.10,
        devengos: null,
        deducciones: 3.84
      },
      {
        code: '1010',
        name: 'SEG.SOCIAL MEI',
        description: 'Intergenerational Equity Mechanism (MEI) for pension sustainability',
        cantidadBase: 3840.00,
        precio: 0.13,
        devengos: null,
        deducciones: 4.99
      },
      {
        code: '1051',
        name: 'IMP A CUENTA RENTA',
        description: 'Income tax withholding (IRPF)',
        cantidadBase: null,
        precio: null,
        devengos: null,
        deducciones: 950.75
      },
      {
        code: '1085',
        name: 'IMP A CTA STOCK P.P',
        description: 'IRPF withholding on stock purchase plan benefit',
        cantidadBase: null,
        precio: null,
        devengos: null,
        deducciones: 45.20
      }
    ],
    totalEarnings: 4956.50,
    totalDeductions: 1244.78,
    netPay: 3711.72
  },
  {
    paymentDate: '30 DE ABRIL DE 2024',
    sortableDate: '2024-04-30',
    earnings: [
      {
        code: '321',
        name: 'SALARIO BASE',
        description: 'Base monthly salary before any additions or deductions',
        cantidadBase: 30,
        precio: 1280.00,
        devengos: 3840.00,
        deducciones: null
      },
      {
        code: '637',
        name: 'SEGURO ME',
        description: 'Medical insurance benefit paid by employer (in-kind benefit)',
        cantidadBase: 1,
        precio: 85.50,
        devengos: 85.50,
        deducciones: null
      },
      {
        code: '711',
        name: 'DENTAL IN',
        description: 'Dental insurance benefit paid by employer',
        cantidadBase: 1,
        precio: 25.00,
        devengos: 25.00,
        deducciones: null
      },
      {
        code: '715',
        name: 'T.RESTAU',
        description: 'Restaurant vouchers/tickets (tax-exempt up to legal limit)',
        cantidadBase: 22,
        precio: 11.00,
        devengos: 242.00,
        deducciones: null
      }
    ],
    deductions: [
      {
        code: '1005',
        name: 'SEGURIDAD SOCIAL',
        description: 'Employee Social Security contribution (contingencias comunes)',
        cantidadBase: 3840.00,
        precio: 4.70,
        devengos: null,
        deducciones: 180.48
      },
      {
        code: '1008',
        name: 'DESEMPLEO',
        description: 'Unemployment insurance contribution',
        cantidadBase: 3840.00,
        precio: 1.55,
        devengos: null,
        deducciones: 59.52
      },
      {
        code: '1009',
        name: 'FORMACION PROFES',
        description: 'Professional training contribution',
        cantidadBase: 3840.00,
        precio: 0.10,
        devengos: null,
        deducciones: 3.84
      },
      {
        code: '1010',
        name: 'SEG.SOCIAL MEI',
        description: 'Intergenerational Equity Mechanism (MEI) for pension sustainability',
        cantidadBase: 3840.00,
        precio: 0.13,
        devengos: null,
        deducciones: 4.99
      },
      {
        code: '1051',
        name: 'IMP A CUENTA RENTA',
        description: 'Income tax withholding (IRPF)',
        cantidadBase: null,
        precio: null,
        devengos: null,
        deducciones: 835.40
      },
      {
        code: '1075',
        name: 'IMP A CTA SEG.DENTAL',
        description: 'IRPF withholding on dental insurance benefit (in-kind taxation)',
        cantidadBase: null,
        precio: null,
        devengos: null,
        deducciones: 6.25
      }
    ],
    totalEarnings: 4192.50,
    totalDeductions: 1090.48,
    netPay: 3102.02
  }
]
