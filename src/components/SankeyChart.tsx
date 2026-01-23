import { ResponsiveSankey } from '@nivo/sankey'
import type { Payslip } from '../types'

interface SankeyChartProps {
  payslip: Payslip
}

export default function SankeyChart({ payslip }: SankeyChartProps) {
  // Simplified flow: Base Salary → Deductions + Net Pay
  const baseSalary = payslip.earnings.find(e => e.code === '321')
  const salaryAmount = baseSalary?.devengos ?? payslip.totalEarnings

  const nodes: { id: string }[] = [{ id: 'Salary' }]
  const links: { source: string; target: string; value: number }[] = []

  // Add deduction nodes and links from Salary
  for (const deduction of payslip.deductions) {
    if (deduction.deducciones && deduction.deducciones > 0) {
      nodes.push({ id: deduction.name })
      links.push({
        source: 'Salary',
        target: deduction.name,
        value: deduction.deducciones,
      })
    }
  }

  // Add Net Pay node
  nodes.push({ id: 'Net Pay' })
  links.push({
    source: 'Salary',
    target: 'Net Pay',
    value: payslip.netPay,
  })

  const data = { nodes, links }

  return (
    <ResponsiveSankey
      data={data}
      margin={{ top: 20, right: 160, bottom: 20, left: 80 }}
      align="justify"
      sort="ascending"
      colors={{ scheme: 'category10' }}
      nodeOpacity={1}
      nodeHoverOthersOpacity={0.35}
      nodeThickness={18}
      nodeSpacing={24}
      nodeBorderWidth={0}
      nodeBorderRadius={3}
      linkOpacity={0.5}
      linkHoverOthersOpacity={0.1}
      linkContract={3}
      enableLinkGradient={true}
      labelPosition="outside"
      labelOrientation="horizontal"
      labelPadding={16}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
      valueFormat={value =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
        })
      }
    />
  )
}
