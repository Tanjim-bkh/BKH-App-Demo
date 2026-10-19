import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
import { Chart1Dot, Chart5Dot } from './legend-icons'

const chartConfig = {
  ordinary: { label: 'Ordinary Hours', color: 'var(--chart-1)', icon: Chart1Dot },
  overtime: { label: 'Overtime Hours', color: 'var(--chart-5)', icon: Chart5Dot },
} satisfies ChartConfig

interface HoursOvertimeChartProps {
  data: Employee['weeklyHours']
}

export function HoursOvertimeChart({ data }: HoursOvertimeChartProps) {
  // - Label every second week, like the reference layout
  const ticks = data.filter((_, i) => i % 2 === 0).map((d) => d.weekEnding)

  return (
    <ChartCard title="Hours & Overtime">
      <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
        <BarChart data={data} margin={{ top: 0, right: 4, bottom: 12, left: -8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="weekEnding"
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            label={{ value: 'Week Ending', position: 'insideBottom', offset: -10, className: 'fill-muted-foreground' }}
          />
          <YAxis
            domain={[0, 60]}
            ticks={[0, 20, 40, 60]}
            tickLine={false}
            axisLine={false}
            width={44}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: 14, className: 'fill-muted-foreground' }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend verticalAlign="top" align="left" itemSorter={null} content={<ChartLegendContent className="justify-start" />} />
          <Bar dataKey="ordinary" stackId="hours" fill="var(--color-ordinary)" radius={[0, 0, 2, 2]} />
          <Bar dataKey="overtime" stackId="hours" fill="var(--color-overtime)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
