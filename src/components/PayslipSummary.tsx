import type { Payslip } from '../types'
import SankeyChart from './SankeyChart'
import PayslipTable from './PayslipTable'

interface PayslipSummaryProps {
  payslip: Payslip
  onReset: () => void
  /** When true, hides the navbar and outer container (for embedding in multi-payslip view) */
  embedded?: boolean
}

export default function PayslipSummary({ payslip, onReset, embedded = false }: PayslipSummaryProps) {
  const content = (
    <>
      {/* Summary Stats */}
      <div className="stats shadow w-full mb-4">
        <div className="stat">
          <div className="stat-title">Payment Date</div>
          <div className="stat-value text-lg">{payslip.paymentDate}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Earnings</div>
          <div className="stat-value text-success">
            {payslip.totalEarnings.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Deductions</div>
          <div className="stat-value text-error">
            {payslip.totalDeductions.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Net Pay</div>
          <div className="stat-value text-primary">
            {payslip.netPay.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
        </div>
      </div>

      {/* Sankey Chart */}
      <div className="card bg-base-100 shadow mb-4">
        <div className="card-body">
          <h2 className="card-title">Money Flow</h2>
          <div className="h-96">
            <SankeyChart payslip={payslip} />
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Details</h2>
          <PayslipTable payslip={payslip} />
        </div>
      </div>
    </>
  )

  if (embedded) {
    return <div>{content}</div>
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="navbar bg-base-100 rounded-box mb-4">
        <div className="flex-1">
          <span className="text-xl font-bold px-4">Payslip Analyzer</span>
        </div>
        <div className="flex-none">
          <button className="btn btn-ghost" onClick={onReset}>
            Upload New
          </button>
        </div>
      </div>
      {content}
    </div>
  )
}
