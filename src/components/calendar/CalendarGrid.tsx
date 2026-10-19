import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getISOWeek,
  isSameMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DayCell } from '@/components/calendar/DayCell'
import { DayDetailDialog } from '@/components/calendar/DayDetailDialog'
import { useMonthData } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import type { DayData, DayDetailKind } from '@/types'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const GRID_COLS = 'grid grid-cols-[40px_repeat(7,minmax(0,1fr))] gap-1.5'

interface CalendarGridProps {
  month: Date
  range?: DateRange
}

function buildWeeks(month: Date): Date[][] {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return weeks
}

export function CalendarGrid({ month, range }: CalendarGridProps) {
  const { data = [], isLoading } = useMonthData(format(month, 'yyyy-MM'))
  const [selected, setSelected] = useState<{ date: string; kind: DayDetailKind } | null>(null)

  const weeks = useMemo(() => buildWeeks(month), [month])
  const byDate = useMemo(() => new Map<string, DayData>(data.map((d) => [d.date, d])), [data])

  const isDimmed = (date: Date) =>
    range?.from !== undefined &&
    !isWithinInterval(startOfDay(date), { start: range.from, end: range.to ?? range.from })

  return (
    <div>
      <div className={`${GRID_COLS} border-b pb-2 text-xs text-muted-foreground`}>
        <div className="px-1">Wk</div>
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-1">
            {d}
          </div>
        ))}
      </div>

      <div className={cn('mt-1.5 flex flex-col gap-1.5', isLoading && 'animate-pulse')}>
        {weeks.map((week) => (
          <div key={week[0].toISOString()} className={GRID_COLS}>
            <div className="px-1 pt-2 text-xs text-muted-foreground">
              {getISOWeek(week[0])}
            </div>
            {week.map((date) => {
              const iso = format(date, 'yyyy-MM-dd')
              return (
                <DayCell
                  key={iso}
                  date={date}
                  inMonth={isSameMonth(date, month)}
                  dimmed={isDimmed(date)}
                  data={byDate.get(iso)}
                  onOpen={(kind) => setSelected({ date: iso, kind })}
                />
              )
            })}
          </div>
        ))}
      </div>

      <DayDetailDialog selection={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
