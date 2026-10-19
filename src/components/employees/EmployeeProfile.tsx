import { Calendar, CalendarCheck, Clock, IdCard } from 'lucide-react'
import type { Employee } from '@/data/employees'
import { cn } from '@/lib/utils'
import { AlertCard, type AlertSeverity } from './AlertCard'
import { CumulativeHoursChart } from './charts/CumulativeHoursChart'
import { HoursOvertimeChart } from './charts/HoursOvertimeChart'
import { PersonalLeaveChart } from './charts/PersonalLeaveChart'
import { SkillsRadarChart } from './charts/SkillsRadarChart'
import { TimeBreakdownChart } from './charts/TimeBreakdownChart'
import { WeekendWorkChart } from './charts/WeekendWorkChart'
import { LicencesCard } from './LicencesCard'
import { ReviewsCard } from './ReviewsCard'
import { StatTile } from './StatTile'

// - Overtime this far above the 13-week average flags the tile red
const OVERTIME_ALERT_PCT = 30
const LICENCE_URGENT_DAYS = 30

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

export function EmployeeProfile({ employee }: { employee: Employee }) {
  const { stats, alerts } = employee
  const overtimeAlert = stats.overtimeVsAvgPct > OVERTIME_ALERT_PCT
  const overtimeUp = stats.overtimeVsAvgPct >= 0
  const licence = alerts.licenceExpiry

  // - Zero-event flags fall back to a neutral card rather than shouting red/amber
  const highIf = (n: number): AlertSeverity => (n > 0 ? 'high' : 'none')
  const mediumIf = (n: number): AlertSeverity => (n > 0 ? 'medium' : 'none')
  const licenceSeverity: AlertSeverity = !licence ? 'none' : licence.daysLeft < LICENCE_URGENT_DAYS ? 'high' : 'medium'

  return (
    <div className="@container flex flex-col gap-5">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">{employee.name} — Employee Overview</h2>
        <p className="mt-1 text-muted-foreground">
          {employee.role} · {employee.project} · {employee.crew}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        <StatTile icon={Clock} label="Hours This Week" value={`${stats.hoursThisWeek} hrs`} />
        <StatTile
          icon={Clock}
          label="Overtime This Week"
          value={`${stats.overtimeThisWeek} hrs`}
          alert={overtimeAlert}
          subLabel={
            <>
              <span className={cn('font-semibold', overtimeAlert ? 'text-red-600' : 'text-zinc-700')}>
                {overtimeUp ? '▲' : '▼'} {Math.abs(stats.overtimeVsAvgPct)}%
              </span>{' '}
              {overtimeUp ? 'above' : 'below'} 13-week average
            </>
          }
        />
        <StatTile
          icon={Calendar}
          label="Personal Leave"
          value={plural(stats.personalLeaveDays, 'day')}
          subLabel="in last 90 days"
        />
        <StatTile icon={CalendarCheck} label="Saturdays Worked" value={`${stats.saturdaysWorked}`} subLabel="this quarter" />
      </section>

      <section className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        <AlertCard
          icon={Calendar}
          title="Uncertified Leave"
          value={plural(alerts.uncertifiedLeave.count, 'event')}
          subLabel={alerts.uncertifiedLeave.period}
          severity={highIf(alerts.uncertifiedLeave.count)}
        />
        <AlertCard
          icon={Calendar}
          title="Mon/Fri Leave"
          value={`${alerts.monFriLeave.taken} of ${plural(alerts.monFriLeave.total, 'event')}`}
          severity={highIf(alerts.monFriLeave.taken)}
        />
        <AlertCard
          icon={Calendar}
          title="Saturday After Short Week"
          value={`${alerts.satAfterShortWeek.taken} of ${plural(alerts.satAfterShortWeek.total, 'Saturday')}`}
          severity={mediumIf(alerts.satAfterShortWeek.taken)}
        />
        <AlertCard
          icon={IdCard}
          title={licence?.label ?? 'Licences'}
          value={
            !licence ? 'None expiring' : licence.daysLeft <= 0 ? 'Expired' : `Expires in ${plural(licence.daysLeft, 'day')}`
          }
          severity={licenceSeverity}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 @3xl:grid-cols-2 @6xl:grid-cols-3">
        <LicencesCard employee={employee} />
        <ReviewsCard employee={employee} />
        <HoursOvertimeChart data={employee.weeklyHours} />
        <PersonalLeaveChart data={employee.personalLeave} />
        <WeekendWorkChart data={employee.weekendWork} />
        <CumulativeHoursChart data={employee.cumulativeHours} />
        <TimeBreakdownChart data={employee.timeBreakdown} />
        <SkillsRadarChart data={employee.skills} />
      </section>
    </div>
  )
}
