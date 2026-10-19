import { format } from 'date-fns'
import { CalendarRange, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useProject } from '@/context/ProjectContext'
import { formatAuDate } from '@/lib/format'

export type CalendarViewMode = 'month' | 'range'

interface CalendarHeaderProps {
  month: Date
  onMonthChange: (month: Date) => void
  onToday: () => void
  viewMode: CalendarViewMode
  onViewModeChange: (mode: CalendarViewMode) => void
  range?: DateRange
  onRangeChange: (range: DateRange | undefined) => void
}

export function CalendarHeader(props: CalendarHeaderProps) {
  const { month, onMonthChange, onToday, viewMode, onViewModeChange } = props
  const { project } = useProject()
  const shift = (delta: number) => onMonthChange(new Date(month.getFullYear(), month.getMonth() + delta, 1))

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">Site Diary Calendar</h2>
        <p className="text-sm text-muted-foreground">
          {project.name} - {project.code} · {project.location}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="size-8" aria-label="Previous month" onClick={() => shift(-1)}>
            <ChevronLeft />
          </Button>
          <span className="w-32 text-center text-sm font-semibold text-zinc-900">{format(month, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Next month" onClick={() => shift(1)}>
            <ChevronRight />
          </Button>
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={viewMode}
          onValueChange={(v) => v && onViewModeChange(v as CalendarViewMode)}
        >
          <ToggleGroupItem value="month" className="px-3">
            Month
          </ToggleGroupItem>
          <ToggleGroupItem value="range" className="px-3">
            Date range
          </ToggleGroupItem>
        </ToggleGroup>
        {viewMode === 'range' && <RangePicker {...props} />}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm">
              <Plus />
              New diary
            </Button>
          </TooltipTrigger>
          <TooltipContent>Diary entry form - coming soon</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

function RangePicker({ month, range, onRangeChange }: CalendarHeaderProps) {
  const label = range?.from
    ? `${formatAuDate(range.from)} - ${range.to ? formatAuDate(range.to) : '...'}`
    : 'Pick dates'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarRange />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar mode="range" defaultMonth={month} selected={range} onSelect={onRangeChange} weekStartsOn={1} />
      </PopoverContent>
    </Popover>
  )
}
