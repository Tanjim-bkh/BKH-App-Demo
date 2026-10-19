import { ChevronRight, CircleAlert, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export type AlertSeverity = 'high' | 'medium' | 'none'

interface AlertCardProps {
  icon: LucideIcon
  title: string
  value: string
  subLabel?: string
  severity: AlertSeverity
}

// - Static class strings so Tailwind can detect them
const SEVERITY_STYLES: Record<AlertSeverity, { card: string; icon: string; badge: string }> = {
  high: { card: 'border-red-400 bg-white hover:bg-red-50/50', icon: 'text-red-600', badge: 'bg-red-600' },
  medium: { card: 'border-amber-400 bg-amber-50/60 hover:bg-amber-50', icon: 'text-orange-500', badge: 'bg-orange-500' },
  none: { card: 'border-border bg-white hover:bg-zinc-50', icon: 'text-zinc-400', badge: 'hidden' },
}

export function AlertCard({ icon: Icon, title, value, subLabel, severity }: AlertCardProps) {
  const styles = SEVERITY_STYLES[severity]

  return (
    <button
      type="button"
      onClick={() => toast.info(title, { description: 'Details coming soon' })}
      className={cn(
        'flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        styles.card,
      )}
    >
      <div className={cn('relative shrink-0', styles.icon)}>
        <Icon className="size-9" strokeWidth={1.75} />
        <span
          className={cn(
            'absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center rounded-full text-white ring-2 ring-white',
            styles.badge,
          )}
        >
          <CircleAlert className="size-3.5" />
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm leading-tight text-muted-foreground">{title}</span>
        <span className="text-lg leading-snug font-bold tracking-tight text-zinc-900">{value}</span>
        {subLabel && <span className="text-xs text-muted-foreground">{subLabel}</span>}
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </button>
  )
}
