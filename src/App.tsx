import { useState } from 'react'
import type { Payslip } from './types'
import { parsePayslip } from './payslip-parser'
import HeroUpload from './components/HeroUpload'
import PayslipSummary from './components/PayslipSummary'

function App() {
  const [payslip, setPayslip] = useState<Payslip | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      const buffer = await file.arrayBuffer()
      const parsed = await parsePayslip(buffer)
      setPayslip(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PDF')
      setPayslip(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPayslip(null)
    setError(null)
  }

  if (payslip) {
    return <PayslipSummary payslip={payslip} onReset={handleReset} />
  }

  return <HeroUpload onFileUpload={handleFileUpload} loading={loading} error={error} />
}

export default App
