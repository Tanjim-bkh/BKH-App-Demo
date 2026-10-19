import { format, isToday, isWeekend } from 'date-fns'
import { DiaryBadge } from '@/components/calendar/DiaryBadge'
import { cn } from '@/lib/utils'
import type { DayData, DayDetailKind } from '@/types'

interface DayCellProps {
  date: Date
  inMonth: boolean
  dimmed?: boolean
  data?: DayData
  onOpen: (kind: DayDetailKind) => void
  className?: string
}

const cardBase = 'min-h-36 rounded-xl transition-opacity'

export function DayCell({ date, inMonth, dimmed, data, onOpen, className }: DayCellProps) {
  // - Days outside the month are blank placeholders with no number
  if (!inMonth) return <div className={cn(cardBase, 'bg-zinc-100/70', dimmed && 'opacity-40', className)} />

  const today = isToday(date)

  return (
    <div
      className={cn(
        cardBase,
        'flex flex-col gap-1.5 border p-2',
        isWeekend(date) ? 'bg-zinc-50' : 'bg-white',
        today && 'border-2 border-brand',
        dimmed && 'opacity-40',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-6 min-w-6 items-center justify-center self-start rounded-full border px-1.5 text-xs font-medium',
          today ? 'border-brand bg-brand text-white' : 'bg-white text-zinc-800',
        )}
      >
        {format(date, 'd')}
      </span>

      {data && <DayBadges data={data} onOpen={onOpen} compact />}
    </div>
  )
}

interface DayBadgesProps {
  data: DayData
  onOpen: (kind: DayDetailKind) => void
  // - Use short labels on narrower screens (grid cells only)
  compact?: boolean
  className?: string
}

export function DayBadges({ data, onOpen, compact, className }: DayBadgesProps) {
  const short = (s: string) => (compact ? s : undefined)
  const severity = data.incident?.severity ?? ''
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {data.hasDiary && <DiaryBadge variant="diary" label="Site diary" shortLabel={short('Diary')} onClick={() => onOpen('diary')} />}
      {data.lostHours !== undefined && (
        <DiaryBadge variant="lost" label={`${data.lostHours} hrs lost`} shortLabel={short(`${data.lostHours}h`)} onClick={() => onOpen('lost')} />
      )}
      {data.incident && (
        <DiaryBadge
          variant={data.incident.severity === 'high' ? 'incident-high' : 'incident-medium'}
          label={severity === 'high' ? 'Incident' : `${severity} incident`}
          shortLabel={short(severity === 'high' ? 'Incident' : severity === 'medium' ? 'Med' : 'Low')}
          // - In narrow grid cells the icon is dropped so "Incident" fits; the solid red badge still stands out
          className={compact && severity === 'high' ? '[&>svg]:hidden xl:[&>svg]:block' : undefined}
          onClick={() => onOpen('incident')}
        />
      )}
      {data.itpCount !== undefined && (
        <DiaryBadge variant="itp" label={`${data.itpCount} ITP${data.itpCount === 1 ? '' : 's'}`} shortLabel={short(`${data.itpCount} ITP`)} onClick={() => onOpen('itp')} />
      )}
      {data.employeeCount !== undefined && (
        <DiaryBadge variant="employees" label={`${data.employeeCount} employees`} shortLabel={short(String(data.employeeCount))} onClick={() => onOpen('employees')} />
      )}
    </div>
  )
}
