import { Badge } from '@/components/ui/badge'
import { Empty, Stat } from '@/components/calendar/DetailParts'
import { cn } from '@/lib/utils'
import type { DayDetail, ItpInspection } from '@/types'

const STATUS_STYLES: Record<ItpInspection['status'], string> = {
  Passed: 'bg-emerald-100 text-emerald-700',
  'Hold point': 'bg-amber-100 text-amber-800',
  Open: 'bg-zinc-100 text-zinc-700',
}

export function ItpSection({ detail }: { detail: DayDetail }) {
  if (detail.itps.length === 0) return <Empty>No ITP inspections recorded for this day.</Empty>
  const passed = detail.itps.filter((i) => i.status === 'Passed').length
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="Inspections" value={detail.itps.length} />
        <Stat label="Passed" value={passed} />
        <Stat label="Outstanding" value={detail.itps.length - passed} />
      </div>
      <table className="w-full text-sm">
        <thead className="border-b text-left text-xs text-muted-foreground">
          <tr>
            <th className="py-2 font-medium">Inspection</th>
            <th className="py-2 font-medium">Inspector</th>
            <th className="py-2 text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {detail.itps.map((itp) => (
            <tr key={itp.id} className="border-b last:border-0">
              <td className="py-2 font-medium">{itp.title}</td>
              <td className="py-2 text-muted-foreground">{itp.inspector}</td>
              <td className="py-2 text-right">
                <Badge className={cn(STATUS_STYLES[itp.status])}>{itp.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
