import { format, parseISO } from 'date-fns'
import { enAU } from 'date-fns/locale'
import {
  DiarySection,
  EmployeesSection,
  IncidentSection,
  LostHoursSection,
} from '@/components/calendar/DayDetailSections'
import { ItpSection } from '@/components/calendar/ItpSection'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProject } from '@/context/ProjectContext'
import { useDayDetail } from '@/hooks/queries'
import { formatAuDate } from '@/lib/format'
import type { DayDetail, DayDetailKind } from '@/types'

const TITLES: Record<DayDetailKind, string> = {
  diary: 'Site diary',
  lost: 'Lost hours',
  incident: 'Incident report',
  employees: 'Employees on site',
  itp: 'ITP inspections',
}

interface DayDetailDialogProps {
  selection: { date: string; kind: DayDetailKind } | null
  onClose: () => void
}

export function DayDetailDialog({ selection, onClose }: DayDetailDialogProps) {
  const { project } = useProject()
  const { data, isLoading } = useDayDetail(selection?.date ?? null)

  return (
    <Dialog open={selection !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] w-[90vw] max-w-[90vw] overflow-y-auto sm:max-w-[90vw]">
        {selection && (
          <>
            <DialogHeader>
              <DialogTitle className="text-zinc-900">
                {TITLES[selection.kind]} - {format(parseISO(selection.date), 'EEEE', { locale: enAU })}{' '}
                {formatAuDate(selection.date)}
              </DialogTitle>
              <DialogDescription>
                {project.name} · {project.code} · {project.location}
              </DialogDescription>
            </DialogHeader>
            {isLoading || !data ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Loading details...</p>
            ) : (
              <DetailBody kind={selection.kind} detail={data} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DetailBody({ kind, detail }: { kind: DayDetailKind; detail: DayDetail }) {
  switch (kind) {
    case 'diary':
      return <DiarySection detail={detail} />
    case 'lost':
      return <LostHoursSection detail={detail} />
    case 'incident':
      return <IncidentSection detail={detail} />
    case 'employees':
      return <EmployeesSection detail={detail} />
    case 'itp':
      return <ItpSection detail={detail} />
  }
}
