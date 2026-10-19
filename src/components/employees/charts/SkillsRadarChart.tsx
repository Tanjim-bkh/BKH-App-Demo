import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { Employee } from '@/data/employees'
import { ChartCard } from './ChartCard'

const chartConfig = {
  score: { label: 'Score', color: 'var(--chart-1)' },
} satisfies ChartConfig

interface SkillsRadarChartProps {
  data: Employee['skills']
}

export function SkillsRadarChart({ data }: SkillsRadarChartProps) {
  return (
    <ChartCard title="Competency Profile">
      <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
        <RadarChart data={data} outerRadius="72%">
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ className: 'fill-muted-foreground text-[11px]' }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="score"
            fill="var(--color-score)"
            fillOpacity={0.3}
            stroke="var(--color-score)"
            strokeWidth={2}
            dot={{ r: 3, fillOpacity: 1 }}
          />
        </RadarChart>
      </ChartContainer>
    </ChartCard>
  )
}
