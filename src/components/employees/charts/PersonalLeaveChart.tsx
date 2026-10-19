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
import { Chart1Dot, HollowChart1Dot } from './legend-icons'

const chartConfig = {
  singleDay: { label: 'Personal Leave (1 day)', color: 'var(--chart-1)', icon: Chart1Dot },
  multiDay: { label: 'Personal Leave (multiple days)', color: 'var(--chart-2)', icon: HollowChart1Dot },
} satisfies ChartConfig

interface PersonalLeaveChartProps {
  data: Employee['personalLeave']
}

export function PersonalLeaveChart({ data }: PersonalLeaveChartProps) {
  return (
    <ChartCard title="Personal Leave">
      <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
        <BarChart data={data} barGap={4} margin={{ top: 0, right: 4, bottom: 12, left: -8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={6} />
          <YAxis
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={44}
            label={{ value: 'Days', angle: -90, position: 'insideLeft', offset: 14, className: 'fill-muted-foreground' }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend verticalAlign="top" align="left" itemSorter={null} content={<ChartLegendContent className="justify-start" />} />
          <Bar dataKey="singleDay" fill="var(--color-singleDay)" barSize={14} radius={2} />
          {/* - Multi-day leave uses a pale fill with a solid outline, as in the reference */}
          <Bar
            dataKey="multiDay"
            fill="var(--color-multiDay)"
            fillOpacity={0.3}
            stroke="var(--chart-1)"
            strokeWidth={1.5}
            barSize={14}
            radius={2}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
