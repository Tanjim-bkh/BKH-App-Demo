import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { IdCard } from 'lucide-react'
import { useState } from 'react'
import { Photo } from '@/components/shared/Photo'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LICENCES_AS_AT, type Employee, type Licence } from '@/data/employees'
import { cn } from '@/lib/utils'
import { ChartCard } from './charts/ChartCard'

// - Photos taken at induction live in public/licences/<employee id>/<photo>
const photoUrl = (employeeId: string, licence: Licence) => `/licences/${employeeId}/${licence.photo}`

const EXPIRING_SOON_DAYS = 90

function expiryStatus(expiresOn: string | null) {
  if (!expiresOn) return { label: 'No expiry', className: 'bg-zinc-100 text-zinc-600' }
  const days = differenceInCalendarDays(parseISO(expiresOn), LICENCES_AS_AT)
  if (days <= 0) return { label: 'Expired', className: 'bg-red-600 text-white' }
  if (days <= EXPIRING_SOON_DAYS) return { label: `Expires in ${days} days`, className: 'bg-amber-100 text-amber-800' }
  return { label: 'Valid', className: 'bg-emerald-100 text-emerald-700' }
}

export function LicencesCard({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState<Licence | null>(null)

  return (
    <ChartCard title={`Licences (${employee.licences.length})`}>
      <ul className="flex max-h-60 flex-col divide-y overflow-y-auto px-2">
        {employee.licences.map((licence) => {
          const status = expiryStatus(licence.expiresOn)
          return (
            <li key={licence.id}>
              <button
                type="button"
                onClick={() => setOpen(licence)}
                className="flex w-full items-center gap-3 rounded-md py-2 text-left hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <LicencePhoto employeeId={employee.id} licence={licence} className="h-10 w-16 shrink-0 rounded-md border" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-900">{licence.name}</span>
                  <span className="block font-mono text-xs text-muted-foreground">No. {licence.number}</span>
                </span>
                <Badge className={cn('shrink-0 rounded-full', status.className)}>{status.label}</Badge>
              </button>
            </li>
          )
        })}
      </ul>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="w-[95vw] max-w-lg sm:max-w-lg">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.name}</DialogTitle>
                <DialogDescription>
                  {employee.name} · No. {open.number} ·{' '}
                  {open.expiresOn ? `Expires ${format(parseISO(open.expiresOn), 'dd/MM/yyyy')}` : 'No expiry'}
                </DialogDescription>
              </DialogHeader>
              <LicencePhoto key={open.id} employeeId={employee.id} licence={open} large className="aspect-[1.586] rounded-lg border object-contain" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </ChartCard>
  )
}

interface LicencePhotoProps {
  employeeId: string
  licence: Licence
  large?: boolean
  className?: string
}

// - Until the induction photo is uploaded, show an ID-card shaped placeholder
function LicencePhoto({ employeeId, licence, large, className }: LicencePhotoProps) {
  return (
    <Photo
      src={photoUrl(employeeId, licence)}
      alt={`${licence.name} photo`}
      className={className}
      fallback={
        <span className={cn('flex flex-col items-center justify-center gap-1 bg-linear-to-br from-zinc-100 to-zinc-200 text-zinc-400', className)}>
          <IdCard className={large ? 'size-10' : 'size-5'} />
          {large && <span className="text-xs">Photo not uploaded yet</span>}
        </span>
      }
    />
  )
}
