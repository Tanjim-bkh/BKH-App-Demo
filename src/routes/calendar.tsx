import { createFileRoute } from '@tanstack/react-router'
import { startOfMonth } from 'date-fns'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { CalendarAgenda } from '@/components/calendar/CalendarAgenda'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { CalendarHeader, type CalendarViewMode } from '@/components/calendar/CalendarHeader'
import { ShadcnCalendarGrid } from '@/components/calendar/ShadcnCalendarGrid'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// - Temporary switch to compare the custom grid with the shadcn Calendar version
type GridLayout = 'custom' | 'shadcn'

export const Route = createFileRoute('/calendar')({
  staticData: { title: 'Calendar' },
  component: CalendarPage,
})

function CalendarPage() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const [range, setRange] = useState<DateRange | undefined>()
  const [layout, setLayout] = useState<GridLayout>('custom')
  const gridRange = viewMode === 'range' ? range : undefined

  const changeViewMode = (mode: CalendarViewMode) => {
    setViewMode(mode)
    if (mode === 'month') setRange(undefined)
  }

  return (
    <div className="flex flex-col gap-5">
      <CalendarHeader
        month={month}
        onMonthChange={setMonth}
        onToday={() => setMonth(startOfMonth(new Date()))}
        viewMode={viewMode}
        onViewModeChange={changeViewMode}
        range={range}
        onRangeChange={setRange}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Legend />
        {/* - Grid preview switch only applies from tablet width up */}
        <ToggleGroup className="hidden md:flex" type="single" variant="outline" size="sm" value={layout} onValueChange={(v) => v && setLayout(v as GridLayout)}>
          <ToggleGroupItem value="custom" className="px-3 text-xs">
            Custom grid
          </ToggleGroupItem>
          <ToggleGroupItem value="shadcn" className="px-3 text-xs">
            shadcn Calendar
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="md:hidden">
        <CalendarAgenda month={month} range={gridRange} />
      </div>
      <div className="hidden md:block">
        {layout === 'custom' ? (
          <CalendarGrid month={month} range={gridRange} />
        ) : (
          <ShadcnCalendarGrid month={month} range={gridRange} />
        )}
      </div>
    </div>
  )
}

const LEGEND = [
  { label: 'Site diary', className: 'bg-blue-500' },
  { label: 'ITPs', className: 'bg-violet-500' },
  { label: 'Lost hours', className: 'bg-orange-500' },
  { label: 'Incident', className: 'bg-red-600' },
  { label: 'Employees', className: 'bg-emerald-500' },
]

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {LEGEND.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${item.className}`} />
          {item.label}
        </span>
      ))}
      <span className="text-zinc-400">Click any badge for details</span>
    </div>
  )
}
