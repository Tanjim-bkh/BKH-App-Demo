import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { Employee } from '@/data/employees'
import { ChartCard } from './ChartCard'

// - Keys match the category names so the legend and tooltip resolve labels via nameKey
const chartConfig = {
  hours: { label: 'Hours' },
  Ordinary: { label: 'Ordinary', color: 'var(--chart-1)' },
  Overtime: { label: 'Overtime', color: 'var(--chart-5)' },
  Saturday: { label: 'Saturday', color: 'var(--chart-2)' },
  Sunday: { label: 'Sunday', color: 'var(--chart-3)' },
  Leave: { label: 'Leave', color: 'var(--chart-4)' },
} satisfies ChartConfig

interface TimeBreakdownChartProps {
  data: Employee['timeBreakdown']
}

export function TimeBreakdownChart({ data }: TimeBreakdownChartProps) {
  const total = Math.round(data.reduce((acc, d) => acc + d.hours, 0))

  return (
    <ChartCard title="Hours Breakdown">
      <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="category" hideLabel />} />
          <Pie data={data} dataKey="hours" nameKey="category" innerRadius={52} outerRadius={78} strokeWidth={2}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) return null
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                      {total.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                      total hrs
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
          <ChartLegend itemSorter={null} content={<ChartLegendContent nameKey="category" className="flex-wrap gap-x-3 gap-y-1" />} />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  )
}
