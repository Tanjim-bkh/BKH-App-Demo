import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Clock, GraduationCap, HeartPulse, NotebookPen, ShieldCheck, Timer, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ReportDefinition } from '@/data/reports'
import { useReports } from '@/hooks/useModules'
import { cn } from '@/lib/utils'
import type { ModuleColor } from '@/types'

export const Route = createFileRoute('/reports')({
  staticData: { title: 'Reports' },
  component: ReportsPage,
})

const ICONS: Record<ReportDefinition['icon'], LucideIcon> = { Clock, HeartPulse, Timer, NotebookPen, GraduationCap, ShieldCheck }

// - Static class strings so Tailwind can detect them
const ICON_STYLES: Record<ModuleColor, string> = {
  blue: 'bg-blue-50 text-blue-600',
  red: 'bg-red-50 text-red-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-600',
  amber: 'bg-amber-50 text-amber-600',
}

function ReportsPage() {
  const reports = useReports()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">Reports</h2>
        <p className="text-sm text-muted-foreground">Reports built from data across the portal. Each one will run for a chosen project and date range.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  )
}

function ReportCard({ report }: { report: ReportDefinition }) {
  const Icon = ICONS[report.icon]
  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', ICON_STYLES[report.color])}>
          <Icon className="size-5" />
        </div>
        {!report.available && (
          <Badge variant="outline" className="rounded-full text-muted-foreground">
            Coming soon
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="font-semibold text-zinc-900">{report.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{report.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>Data from</span>
        {report.sources.map((s) => (
          <Badge key={s} variant="secondary" className="rounded-full font-normal">
            {s}
          </Badge>
        ))}
      </div>
      <Button variant={report.available ? 'default' : 'outline'} disabled={!report.available} className="self-start">
        Run report
        <ArrowRight />
      </Button>
    </Card>
  )
}
