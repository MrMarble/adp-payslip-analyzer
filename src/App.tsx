import { useState } from 'react'
import type { Payslip } from './types'
import { parsePayslip } from './payslip-parser'
import HeroUpload from './components/HeroUpload'
import PayslipSummary from './components/PayslipSummary'
import MultiPayslipView from './components/MultiPayslipView'

function App() {
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFilesUpload = async (files: File[]) => {
    setLoading(true)
    setError(null)

    try {
      const parsed: Payslip[] = []
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        const payslip = await parsePayslip(buffer)
        parsed.push(payslip)
      }
      setPayslips(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PDFs')
      setPayslips([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPayslips([])
    setError(null)
  }

  // No payslips: show upload screen
  if (payslips.length === 0) {
    return <HeroUpload onFilesUpload={handleFilesUpload} loading={loading} error={error} />
  }

  // Single payslip: show detailed view
  if (payslips.length === 1) {
    return <PayslipSummary payslip={payslips[0]} onReset={handleReset} />
  }

  // Multiple payslips: show overview with time series
  return <MultiPayslipView payslips={payslips} onReset={handleReset} />
}

export default App
