import { ResponsiveLine } from '@nivo/line'
import { useMemo } from 'react'
import type { Payslip } from '../types'
import { isBonusConcept } from '../concepts'

interface TimeSeriesChartProps {
  payslips: Payslip[]
  visibleSeries: Set<string>
  selectedIndex: number
  onSelectIndex: (index: number) => void
}

export default function TimeSeriesChart({
  payslips,
  visibleSeries,
  selectedIndex,
  onSelectIndex,
}: TimeSeriesChartProps) {
  // Build series data - recalculate when payslips or visibleSeries change
  const series = useMemo(() => {
    const result: { id: string; color: string; data: { x: string; y: number }[] }[] = []

    // Base Salary (always shown)
    if (visibleSeries.has('321')) {
      result.push({
        id: 'Base Salary',
        color: 'hsl(210, 70%, 50%)',
        data: payslips.map(p => ({
          x: p.sortableDate,
          y: p.earnings.find(e => e.code === '321')?.devengos ?? 0,
        })),
      })
    }

    // Net Pay (always shown)
    if (visibleSeries.has('netPay')) {
      result.push({
        id: 'Net Pay',
        color: 'hsl(140, 70%, 40%)',
        data: payslips.map(p => ({
          x: p.sortableDate,
          y: p.netPay,
        })),
      })
    }

    // Bonus (combined 413 + 438)
    if (visibleSeries.has('bonus')) {
      result.push({
        id: 'Bonus',
        color: '#fbbf24',
        data: payslips.map(p => {
          const bonusTotal = p.earnings
            .filter(e => isBonusConcept(e.code))
            .reduce((sum, e) => sum + (e.devengos ?? 0), 0)
          return { x: p.sortableDate, y: bonusTotal }
        }),
      })
    }

    // Other earnings
    const earningCodes = ['637', '638', '702', '711', '715', '716']
    const earningColors = ['#17becf', '#bcbd22', '#7f7f7f', '#e377c2', '#8c564b', '#9467bd']
    earningCodes.forEach((code, i) => {
      if (visibleSeries.has(code)) {
        const firstPayslip = payslips.find(p => p.earnings.some(e => e.code === code))
        const name = firstPayslip?.earnings.find(e => e.code === code)?.name ?? code
        result.push({
          id: name,
          color: earningColors[i],
          data: payslips.map(p => ({
            x: p.sortableDate,
            y: p.earnings.find(e => e.code === code)?.devengos ?? 0,
          })),
        })
      }
    })

    // Deductions
    const deductionCodes = ['1005', '1008', '1009', '1010', '1012', '1051', '1057', '1075', '1085', '1122', '1542', '1550']
    const deductionColors = ['#d62728', '#ff7f0e', '#2ca02c', '#1f77b4', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#aec7e8', '#ffbb78']
    deductionCodes.forEach((code, i) => {
      if (visibleSeries.has(code)) {
        const firstPayslip = payslips.find(p => p.deductions.some(d => d.code === code))
        const name = firstPayslip?.deductions.find(d => d.code === code)?.name ?? code
        result.push({
          id: name,
          color: deductionColors[i % deductionColors.length],
          data: payslips.map(p => ({
            x: p.sortableDate,
            y: p.deductions.find(d => d.code === code)?.deducciones ?? 0,
          })),
        })
      }
    })

    return result
  }, [payslips, visibleSeries])

  // Find bonus months for markers
  const bonusPoints = useMemo(() => {
    return payslips
      .map((p, i) => ({ payslip: p, index: i }))
      .filter(({ payslip }) => payslip.earnings.some(e => isBonusConcept(e.code)))
      .map(({ payslip }) => ({
        axis: 'x' as const,
        value: payslip.sortableDate,
        lineStyle: { stroke: '#fbbf24', strokeWidth: 2, strokeDasharray: '4 4' },
        legend: '🌈 Bonus',
        legendPosition: 'top' as const,
      }))
  }, [payslips])

  return (
    <div className="time-series-chart h-full w-full">
      <ResponsiveLine
        data={series}
        margin={{ top: 30, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          format: (value: string) => {
            const date = new Date(value)
            return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          format: (value: number) => `${(value / 1000).toFixed(1)}k`,
        }}
        colors={{ datum: 'color' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        enableSlices="x"
        markers={bonusPoints}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
        onClick={(point) => {
          // Type guard for Point (has data.x)
          if ('data' in point && 'x' in point.data) {
            const index = payslips.findIndex(p => p.sortableDate === point.data.x)
            if (index !== -1) {
              onSelectIndex(index)
            }
          }
        }}
        tooltip={({ point }) => (
          <div className="bg-base-100 p-2 rounded shadow border">
            <strong>{point.seriesId}</strong>
            <br />
            {point.data.yFormatted}€
          </div>
        )}
      />
    </div>
  )
}
