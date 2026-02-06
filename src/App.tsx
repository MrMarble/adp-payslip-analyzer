import { useState, useEffect } from 'react'
import type { Payslip } from './types'
import { parsePayslip, detectUnknownConcepts } from './payslip-parser'
import HeroUpload from './components/HeroUpload'
import PayslipSummary from './components/PayslipSummary'
import MultiPayslipView from './components/MultiPayslipView'

function App() {
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Demo mode: load mock data on mount
  // This block is removed by tree-shaking in production builds
  // since import.meta.env.VITE_DEMO becomes false
  useEffect(() => {
    if (import.meta.env.VITE_DEMO) {
      import('./demo/mockData').then(({ demoPayslips }) => {
        setPayslips(demoPayslips)
      })
    }
  }, [])

  const handleFilesUpload = async (files: File[]) => {
    setLoading(true)
    setError(null)

    try {
      const parsed: Payslip[] = []
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        const payslip = await parsePayslip(buffer)
        parsed.push(payslip)

        // Detect unknown concepts and warn user
        const detectBuffer = await file.arrayBuffer()
        const unknown = await detectUnknownConcepts(detectBuffer)
        if (unknown.length > 0) {
          console.warn(
            '%cUnknown concepts found!%c\n\n' +
              'The following payslip concepts are not yet supported:\n\n' +
              unknown.map(c => `  ${c.code}: ${c.name}`).join('\n') +
              '\n\nPlease open an issue:\nhttps://github.com/mrmarble/adp-payslip-analyzer/issues/new',
            'background: #f59e0b; color: black; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
            ''
          )
        }
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
