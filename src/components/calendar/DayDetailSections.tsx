import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowRight } from 'lucide-react'
import { Empty, Stat, SubHeading } from '@/components/calendar/DetailParts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DayDetail } from '@/types'

export function DiarySection({ detail }: { detail: DayDetail }) {
  const { diary } = detail
  if (!diary) return <Empty>No site diary submitted for this day.</Empty>
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Submitted by" value={diary.author} />
        <Stat label="Submitted at" value={format(diary.submittedAt, 'h:mm a')} />
        <Stat label="Weather" value={diary.weather} />
        <Stat label="Crew on site" value={detail.crew.length} />
      </div>
      <div>
        <SubHeading>Work performed</SubHeading>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {diary.activities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <div>
        <SubHeading>Notes</SubHeading>
        <p className="text-sm text-zinc-700">{diary.notes}</p>
      </div>
    </div>
  )
}

export function LostHoursSection({ detail }: { detail: DayDetail }) {
  const { lostHours } = detail
  if (!lostHours) return <Empty>No lost hours recorded for this day.</Empty>
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="Total hours lost" value={`${lostHours.total} hrs`} />
        <Stat label="Crew affected" value={lostHours.entries[0]?.crew ?? 0} />
        <Stat label="Labour hours impact" value={`${lostHours.entries.reduce((s, e) => s + e.hours * e.crew, 0)} hrs`} />
      </div>
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs text-muted-foreground">
          <tr>
            <th className="py-2 font-medium">Reason</th>
            <th className="py-2 font-medium">Hours</th>
            <th className="py-2 font-medium">Crew</th>
          </tr>
        </thead>
        <tbody>
          {lostHours.entries.map((e) => (
            <tr key={e.reason} className="border-b last:border-0">
              <td className="py-2">{e.reason}</td>
              <td className="py-2">{e.hours}</td>
              <td className="py-2">{e.crew}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function IncidentSection({ detail }: { detail: DayDetail }) {
  const { incident } = detail
  if (!incident) return <Empty>No incidents reported for this day.</Empty>
  const high = incident.severity === 'high'
  return (
    <div className="flex flex-col gap-5">
      <div className={cn('rounded-lg border-l-4 px-4 py-3', high ? 'border-l-red-600 bg-red-50' : 'border-l-orange-400 bg-orange-50')}>
        <Badge className={cn('mb-2 uppercase', high ? 'bg-red-600 text-white' : 'bg-orange-200 text-orange-800')}>
          {incident.severity} severity
        </Badge>
        <p className="text-sm text-zinc-800">{incident.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Reported by" value={incident.reportedBy} />
        <Stat label="Location" value={incident.location} />
      </div>
      <div>
        <SubHeading>Actions</SubHeading>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {incident.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <Button asChild className="self-start">
        <Link to="/incidents/$incidentId" params={{ incidentId: `p-a-${detail.date}` }}>
          View &amp; Sign Off
          <ArrowRight />
        </Link>
      </Button>
    </div>
  )
}

export function EmployeesSection({ detail }: { detail: DayDetail }) {
  if (detail.crew.length === 0) return <Empty>No employees recorded for this day.</Empty>
  const totalHours = detail.crew.reduce((s, c) => s + c.hours, 0)
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Employees on site" value={detail.crew.length} />
        <Stat label="Total hours" value={`${totalHours} hrs`} />
      </div>
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs text-muted-foreground">
          <tr>
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Trade</th>
            <th className="py-2 text-right font-medium">Hours</th>
          </tr>
        </thead>
        <tbody>
          {detail.crew.map((c) => (
            <tr key={c.id} className="border-b last:border-0">
              <td className="py-2 font-medium">{c.name}</td>
              <td className="py-2 text-muted-foreground">{c.trade}</td>
              <td className="py-2 text-right tabular-nums">{c.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
