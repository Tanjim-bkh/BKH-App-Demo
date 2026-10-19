import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { Employee } from '@/data/employees'
import { ChartCard } from './ChartCard'

const ANNUAL_TARGET_HOURS = 1600

const chartConfig = {
  hours: { label: 'Cumulative Hours', color: 'var(--chart-1)' },
} satisfies ChartConfig

interface CumulativeHoursChartProps {
  data: Employee['cumulativeHours']
}

export function CumulativeHoursChart({ data }: CumulativeHoursChartProps) {
  return (
    <ChartCard title="Cumulative Hours YTD">
      <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
        <AreaChart data={data} margin={{ top: 16, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="fillCumulativeHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-hours)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-hours)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="week" interval={7} tickLine={false} axisLine={false} tickMargin={6} />
          <YAxis
            domain={[0, 1800]}
            ticks={[0, 400, 800, 1200, 1600]}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <ReferenceLine
            y={ANNUAL_TARGET_HOURS}
            stroke="var(--chart-5)"
            strokeDasharray="4 4"
            label={{
              value: `Annual target ${ANNUAL_TARGET_HOURS.toLocaleString()} hrs`,
              position: 'insideTopLeft',
              className: 'fill-chart-5 text-[11px] font-medium',
            }}
          />
          <Area
            dataKey="hours"
            type="monotone"
            fill="url(#fillCumulativeHours)"
            stroke="var(--color-hours)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}
