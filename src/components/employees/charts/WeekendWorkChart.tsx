import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
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
import { Chart1Dot, DashedLineIcon } from './legend-icons'

const chartConfig = {
  saturdayHours: { label: 'Saturday Hours', color: 'var(--chart-1)', icon: Chart1Dot },
  sundayHours: { label: 'Sunday Hours', color: 'var(--chart-2)', icon: DashedLineIcon },
} satisfies ChartConfig

interface WeekendWorkChartProps {
  data: Employee['weekendWork']
}

// - Periods are weekly ("Jul W1"), so only the first week of each month gets a month label
const monthTick = (period: string) => (period.endsWith('W1') ? period.split(' ')[0] : '')

export function WeekendWorkChart({ data }: WeekendWorkChartProps) {
  return (
    <ChartCard title="Weekend Work">
      <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
        <ComposedChart data={data} margin={{ top: 0, right: 4, bottom: 12, left: -8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            interval={0}
            tickFormatter={monthTick}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            label={{ value: 'Weekly', position: 'insideBottom', offset: -10, className: 'fill-muted-foreground' }}
          />
          <YAxis
            domain={[0, 15]}
            ticks={[0, 5, 10, 15]}
            tickLine={false}
            axisLine={false}
            width={44}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: 14, className: 'fill-muted-foreground' }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend verticalAlign="top" align="left" itemSorter={null} content={<ChartLegendContent className="justify-start" />} />
          <Bar dataKey="saturdayHours" fill="var(--color-saturdayHours)" barSize={12} radius={[2, 2, 0, 0]} />
          <Line
            dataKey="sundayHours"
            type="monotone"
            stroke="var(--color-sundayHours)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 3, fill: 'var(--color-sundayHours)', strokeWidth: 0 }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ChartContainer>
    </ChartCard>
  )
}
