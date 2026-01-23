import type { Payslip, PayslipLineItem } from '../types'

interface PayslipTableProps {
  payslip: Payslip
}

function formatCurrency(value: number | null): string {
  if (value === null) return '-'
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

function formatPercent(value: number | null): string {
  if (value === null) return '-'
  return `${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}%`
}

function formatNumber(value: number | null): string {
  if (value === null) return '-'
  return value.toLocaleString('es-ES', { minimumFractionDigits: 2 })
}

function EarningRow({ item }: { item: PayslipLineItem }) {
  const isBonus = item.code === '438'

  return (
    <tr className={isBonus ? 'rainbow-text' : ''}>
      <td>
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-base-content/60">{item.description}</div>
      </td>
      <td className="text-right">{formatNumber(item.cantidadBase)}</td>
      <td className="text-right">{formatCurrency(item.precio)}</td>
      <td className={`text-right font-medium ${isBonus ? '' : 'text-success'}`}>
        {formatCurrency(item.devengos)}
      </td>
    </tr>
  )
}

function DeductionRow({ item }: { item: PayslipLineItem }) {
  return (
    <tr>
      <td>
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-base-content/60">{item.description}</div>
      </td>
      <td className="text-right">{formatCurrency(item.cantidadBase)}</td>
      <td className="text-right">{formatPercent(item.precio)}</td>
      <td className="text-right font-medium text-error">{formatCurrency(item.deducciones)}</td>
    </tr>
  )
}

export default function PayslipTable({ payslip }: PayslipTableProps) {
  return (
    <div className="overflow-x-auto">
      {/* Earnings Table */}
      <h3 className="font-semibold text-lg mt-4 mb-2">Earnings (Devengos)</h3>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Concept</th>
            <th className="text-right">Quantity</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payslip.earnings.map(item => (
            <EarningRow key={item.code} item={item} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={3}>Total Earnings</th>
            <th className="text-right text-success">{formatCurrency(payslip.totalEarnings)}</th>
          </tr>
        </tfoot>
      </table>

      {/* Deductions Table */}
      <h3 className="font-semibold text-lg mt-6 mb-2">Deductions (Deducciones)</h3>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Concept</th>
            <th className="text-right">Base</th>
            <th className="text-right">Rate</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payslip.deductions.map(item => (
            <DeductionRow key={item.code} item={item} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={3}>Total Deductions</th>
            <th className="text-right text-error">{formatCurrency(payslip.totalDeductions)}</th>
          </tr>
        </tfoot>
      </table>

      {/* Net Pay */}
      <div className="divider"></div>
      <div className="flex justify-between items-center text-xl font-bold">
        <span>Net Pay (Líquido a Recibir)</span>
        <span className="text-primary">{formatCurrency(payslip.netPay)}</span>
      </div>
    </div>
  )
}
