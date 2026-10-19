import { cn } from '@/lib/utils'

// - ChartConfig icons take no props, so each colour gets its own component
function LegendDot({ className }: { className: string }) {
  return <span className={cn('size-2.5 shrink-0 rounded-full', className)} />
}

export function Chart1Dot() {
  return <LegendDot className="bg-chart-1" />
}

export function Chart5Dot() {
  return <LegendDot className="bg-chart-5" />
}

export function HollowChart1Dot() {
  return <LegendDot className="border-2 border-chart-1 bg-chart-2/30" />
}

export function DashedLineIcon() {
  return (
    <span className="relative flex w-5 shrink-0 items-center">
      <span className="w-full border-t-2 border-dashed border-chart-2" />
      <span className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-chart-2" />
    </span>
  )
}
