import { format, parseISO } from 'date-fns'
import { useMemo, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { useMonthData } from '@/hooks/queries'

const dot =
  'after:absolute after:bottom-0.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full'

// - Compact month view. Blue dot = diary, red dot = incident, brand purple = today.
export function MiniCalendar() {
  const [month, setMonth] = useState(() => new Date())
  const { data = [] } = useMonthData(format(month, 'yyyy-MM'))

  const modifiers = useMemo(
    () => ({
      diary: data.filter((d) => d.hasDiary && !d.incident).map((d) => parseISO(d.date)),
      incident: data.filter((d) => d.incident).map((d) => parseISO(d.date)),
    }),
    [data],
  )

  return (
    <Calendar
      month={month}
      onMonthChange={setMonth}
      weekStartsOn={1}
      showOutsideDays={false}
      modifiers={modifiers}
      modifiersClassNames={{
        diary: `${dot} after:bg-sky-400`,
        incident: `${dot} after:bg-red-500`,
      }}
      className="w-full bg-transparent p-0 text-xs text-sidebar-foreground [--cell-size:--spacing(6.5)] [&_button:hover]:bg-sidebar-accent [&_button:hover]:text-sidebar-accent-foreground"
      classNames={{
        root: 'w-full',
        caption_label: 'text-xs font-medium text-zinc-900 select-none',
        weekday: 'flex-1 text-[10px] font-normal text-zinc-400 select-none',
        week: 'mt-1 flex w-full',
        today: 'rounded-md bg-brand font-semibold text-white [&_button:hover]:bg-brand-600! [&_button:hover]:text-white!',
      }}
    />
  )
}
