import { Link } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SafetyAlert } from '@/types'

export const alertLabel = (number: number) => `WHS Alert #${number}`

// - Pill link to a safety alert. Stops the click reaching the surrounding clickable row.
export function SafetyAlertLink({ alert }: { alert?: Pick<SafetyAlert, 'id' | 'number' | 'title' | 'status'> }) {
  if (!alert) return <span className="text-xs text-muted-foreground">Not issued</span>

  const active = alert.status === 'Active'
  return (
    <Link
      to="/safety-alerts/$alertId"
      params={{ alertId: alert.id }}
      title={`${alertLabel(alert.number)} - ${alert.title} (${alert.status})`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active ? 'bg-red-50 text-red-700' : 'bg-zinc-100 text-zinc-700',
      )}
    >
      <ShieldAlert className="size-3.5" />#{alert.number}
      <span className={cn('size-1.5 rounded-full', active ? 'bg-red-500' : 'bg-emerald-500')} aria-label={alert.status} />
    </Link>
  )
}
