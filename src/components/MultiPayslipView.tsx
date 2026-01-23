import { useState, useMemo } from 'react'
import type { Payslip } from '../types'
import { isBonusConcept } from '../concepts'
import TimeSeriesChart from './TimeSeriesChart'
import PayslipSummary from './PayslipSummary'

interface MultiPayslipViewProps {
  payslips: Payslip[]
  onReset: () => void
}

function formatCurrency(value: number): string {
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export default function MultiPayslipView({ payslips, onReset }: MultiPayslipViewProps) {
  // Sort payslips by date
  const sortedPayslips = useMemo(
    () => [...payslips].sort((a, b) => a.sortableDate.localeCompare(b.sortableDate)),
    [payslips]
  )

  const [selectedIndex, setSelectedIndex] = useState<number>(sortedPayslips.length - 1)
  const selectedPayslip = sortedPayslips[selectedIndex]

  // Get all unique concept codes for toggles
  const allConcepts = useMemo(() => {
    const earnings = new Map<string, string>()
    const deductions = new Map<string, string>()

    for (const payslip of sortedPayslips) {
      for (const e of payslip.earnings) {
        earnings.set(e.code, e.name)
      }
      for (const d of payslip.deductions) {
        deductions.set(d.code, d.name)
      }
    }

    return { earnings, deductions }
  }, [sortedPayslips])

  // Track which series are visible (net pay always shown)
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(new Set(['netPay']))

  const toggleSeries = (code: string) => {
    setVisibleSeries(prev => {
      const next = new Set(prev)
      if (next.has(code)) {
        // Don't allow hiding net pay
        if (code !== 'netPay') {
          next.delete(code)
        }
      } else {
        next.add(code)
      }
      return next
    })
  }

  // Check if any payslip has a bonus
  const hasBonus = sortedPayslips.some(p => p.earnings.some(e => isBonusConcept(e.code)))

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="navbar bg-base-100 rounded-box mb-4">
        <div className="flex-1">
          <span className="text-xl font-bold px-4">Payslip Analyzer</span>
          <span className="badge badge-primary">{sortedPayslips.length} payslips</span>
        </div>
        <div className="flex-none">
          <button className="btn btn-ghost" onClick={onReset}>
            Upload New
          </button>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="card bg-base-100 shadow mb-4">
        <div className="card-body">
          <h2 className="card-title">Payslip History</h2>

          {/* Series toggles */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium self-center mr-2">Show:</span>

            {/* Always visible: Net Pay */}
            <div className="badge badge-success">Net Pay</div>

            {/* Bonus indicator */}
            {hasBonus && (
              <div className="badge badge-warning gap-1">
                <span className="rainbow-text">Bonus</span> months highlighted
              </div>
            )}

            <div className="divider divider-horizontal mx-1"></div>

            {/* Combined Bonus toggle */}
            {hasBonus && (
              <button
                className={`badge badge-outline cursor-pointer rainbow-text ${visibleSeries.has('bonus') ? 'badge-warning' : 'opacity-50'}`}
                onClick={() => toggleSeries('bonus')}
              >
                Bonus
              </button>
            )}

            {/* Toggleable earnings (excluding bonus codes) */}
            {Array.from(allConcepts.earnings.entries())
              .filter(([code]) => !isBonusConcept(code))
              .map(([code, name]) => (
                <button
                  key={code}
                  className={`badge badge-outline cursor-pointer ${visibleSeries.has(code) ? 'badge-info' : 'opacity-50'}`}
                  onClick={() => toggleSeries(code)}
                >
                  {name}
                </button>
              ))}

            {/* Toggleable deductions */}
            {Array.from(allConcepts.deductions.entries()).map(([code, name]) => (
              <button
                key={code}
                className={`badge badge-outline cursor-pointer ${visibleSeries.has(code) ? 'badge-error' : 'opacity-50'}`}
                onClick={() => toggleSeries(code)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="h-80">
            <TimeSeriesChart
              payslips={sortedPayslips}
              visibleSeries={visibleSeries}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
            />
          </div>
        </div>
      </div>

      {/* Payslip Selector */}
      <div className="card bg-base-100 shadow mb-4">
        <div className="card-body py-3">
          <div className="flex items-center gap-4">
            <label className="font-medium">Select Payslip:</label>
            <select
              className="select select-bordered flex-1 max-w-md"
              value={selectedIndex}
              onChange={e => setSelectedIndex(Number(e.target.value))}
            >
              {sortedPayslips.map((payslip, index) => {
                const hasBonus = payslip.earnings.some(e => isBonusConcept(e.code))
                return (
                  <option key={payslip.sortableDate} value={index}>
                    {payslip.paymentDate} — {formatCurrency(payslip.netPay)}
                    {hasBonus ? ' 🌈 BONUS' : ''}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Payslip Detail */}
      {selectedPayslip && (
        <PayslipSummary payslip={selectedPayslip} onReset={onReset} embedded />
      )}
    </div>
  )
}
