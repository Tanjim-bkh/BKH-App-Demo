import { format, isToday, isWeekend, isWithinInterval, parseISO, startOfDay } from 'date-fns'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DayBadges } from '@/components/calendar/DayCell'
import { DayDetailDialog } from '@/components/calendar/DayDetailDialog'
import { useMonthData } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import type { DayDetailKind } from '@/types'

interface CalendarAgendaProps {
  month: Date
  range?: DateRange
}

// - Phone view of the month: one row per day that has records, instead of a 7-column grid
export function CalendarAgenda({ month, range }: CalendarAgendaProps) {
  const { data = [], isLoading } = useMonthData(format(month, 'yyyy-MM'))
  const [selected, setSelected] = useState<{ date: string; kind: DayDetailKind } | null>(null)

  const days = data.filter(
    (d) => !range?.from || isWithinInterval(startOfDay(parseISO(d.date)), { start: range.from, end: range.to ?? range.from }),
  )

  if (isLoading) return <p className="py-10 text-center text-sm text-muted-foreground">Loading diary entries...</p>
  if (days.length === 0) return <p className="py-10 text-center text-sm text-muted-foreground">No diary entries for this period.</p>

  return (
    <>
      <ul className="flex flex-col gap-2">
        {days.map((day) => {
          const date = parseISO(day.date)
          const today = isToday(date)
          return (
            <li
              key={day.date}
              className={cn(
                'flex gap-3 rounded-xl border p-3',
                isWeekend(date) ? 'bg-zinc-50' : 'bg-white',
                today && 'border-2 border-brand',
              )}
            >
              <div className="flex w-11 shrink-0 flex-col items-center">
                <span className="text-[11px] font-medium text-muted-foreground uppercase">{format(date, 'EEE')}</span>
                <span
                  className={cn(
                    'mt-0.5 flex size-8 items-center justify-center rounded-full border text-sm font-semibold',
                    today ? 'border-brand bg-brand text-white' : 'bg-white text-zinc-800',
                  )}
                >
                  {format(date, 'd')}
                </span>
              </div>
              <DayBadges data={day} onOpen={(kind) => setSelected({ date: day.date, kind })} className="flex-row flex-wrap" />
            </li>
          )
        })}
      </ul>
      <DayDetailDialog selection={selected} onClose={() => setSelected(null)} />
    </>
  )
}
