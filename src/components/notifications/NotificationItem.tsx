import { AlertTriangle, FileWarning, Info, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatRelativeShort } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

const TYPE_STYLES: Record<Notification['type'], { icon: LucideIcon; className: string }> = {
  'whs-alert': { icon: AlertTriangle, className: 'bg-red-50 text-red-600' },
  'missing-diary': { icon: FileWarning, className: 'bg-amber-50 text-amber-600' },
  info: { icon: Info, className: 'bg-blue-50 text-blue-600' },
}

interface NotificationItemProps {
  notification: Notification
  onSelect: () => void
}

export function NotificationItem({ notification: n, onSelect }: NotificationItemProps) {
  const { icon: Icon, className } = TYPE_STYLES[n.type]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none',
        !n.read && 'bg-blue-50/40',
      )}
    >
      <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', className)}>
        <Icon className="size-4" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start gap-2">
          <p className={cn('flex-1 text-sm leading-snug', n.read ? 'font-medium text-zinc-700' : 'font-semibold')}>
            {n.title}
          </p>
          {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" aria-label="Unread" />}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{n.body}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {n.severity && n.type === 'whs-alert' && (
            <Badge
              className={cn(
                'uppercase',
                n.severity === 'high' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-700',
              )}
            >
              {n.severity}
            </Badge>
          )}
          <Badge variant="outline" className="font-mono">
            {n.project}
          </Badge>
          <span>{formatRelativeShort(n.createdAt)}</span>
        </div>
      </div>
    </button>
  )
}
