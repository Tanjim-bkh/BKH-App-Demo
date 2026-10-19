import { format, isWithinInterval, startOfDay } from 'date-fns'
import { createContext, useContext, useMemo, useState, type ThHTMLAttributes } from 'react'
import type { DateRange, DayProps, WeekNumberProps } from 'react-day-picker'
import { DayCell } from '@/components/calendar/DayCell'
import { DayDetailDialog } from '@/components/calendar/DayDetailDialog'
import { Calendar } from '@/components/ui/calendar'
import { useMonthData } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import type { DayData, DayDetailKind } from '@/types'

// - Month grid built on the shadcn Calendar (react-day-picker)
// - The Day and WeekNumber slots are replaced so each cell can hold badges

interface GridContextValue {
  byDate: Map<string, DayData>
  range?: DateRange
  onOpen: (date: string, kind: DayDetailKind) => void
}

const GridContext = createContext<GridContextValue | null>(null)

function useGrid() {
  const ctx = useContext(GridContext)
  if (!ctx) throw new Error('useGrid must be used inside ShadcnCalendarGrid')
  return ctx
}

function GridDay({ day, modifiers, className, children: _button, ...tdProps }: DayProps) {
  const { byDate, range, onOpen } = useGrid()
  const iso = format(day.date, 'yyyy-MM-dd')
  const dimmed =
    range?.from !== undefined &&
    !isWithinInterval(startOfDay(day.date), { start: range.from, end: range.to ?? range.from })

  return (
    // - h-px on the td lets the h-full cell stretch to the tallest cell in the row
    <td {...tdProps} className={cn(className, 'h-px p-0 align-top')}>
      <DayCell
        className="h-full"
        date={day.date}
        inMonth={!modifiers.outside}
        dimmed={dimmed}
        data={byDate.get(iso)}
        onOpen={(kind) => onOpen(iso, kind)}
      />
    </td>
  )
}

function GridWeekNumber({ week, className, ...thProps }: WeekNumberProps) {
  return (
    <th {...thProps} className={cn(className, 'px-1 pt-2 text-left align-top text-xs font-normal text-muted-foreground')}>
      {week.weekNumber}
    </th>
  )
}

function GridWeekNumberHeader({ className, ...thProps }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th {...thProps} className={className}>
      Wk
    </th>
  )
}

const headerCell = 'border-b px-1 pb-2 text-left text-xs font-normal text-muted-foreground'

interface ShadcnCalendarGridProps {
  month: Date
  range?: DateRange
}

export function ShadcnCalendarGrid({ month, range }: ShadcnCalendarGridProps) {
  const { data = [], isLoading } = useMonthData(format(month, 'yyyy-MM'))
  const [selected, setSelected] = useState<{ date: string; kind: DayDetailKind } | null>(null)

  const value = useMemo<GridContextValue>(
    () => ({
      byDate: new Map(data.map((d) => [d.date, d])),
      range,
      onOpen: (date, kind) => setSelected({ date, kind }),
    }),
    [data, range],
  )

  return (
    <GridContext.Provider value={value}>
      <div className={cn(isLoading && 'animate-pulse')}>
        <Calendar
          month={month}
          weekStartsOn={1}
          showWeekNumber
          showOutsideDays
          hideNavigation
          className="w-full bg-transparent p-0"
          classNames={{
            root: 'w-full',
            months: 'w-full',
            month: 'w-full',
            month_caption: 'hidden',
            month_grid: 'w-full table-fixed border-separate border-spacing-1.5',
            weekdays: '',
            weekday: headerCell,
            week_number_header: cn(headerCell, 'w-10'),
            week: '',
            day: '',
            // - Clear shadcn's picker styling for today / outside days - DayCell handles these
            today: '',
            outside: '',
          }}
          formatters={{ formatWeekdayName: (date) => format(date, 'EEE') }}
          components={{ Day: GridDay, WeekNumber: GridWeekNumber, WeekNumberHeader: GridWeekNumberHeader }}
        />
      </div>
      <DayDetailDialog selection={selected} onClose={() => setSelected(null)} />
    </GridContext.Provider>
  )
}
