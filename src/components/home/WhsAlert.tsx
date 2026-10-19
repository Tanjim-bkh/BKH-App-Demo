import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useNotifications } from '@/hooks/queries'
import { useNavItems } from '@/hooks/useModules'
import { formatRelativeShort } from '@/lib/format'

// - Shows the most recent high-severity WHS alert until dismissed
export function WhsAlert() {
  const { data = [] } = useNotifications()
  const [dismissedId, setDismissedId] = useState<string | null>(null)
  const canSignOff = useNavItems().some((item) => item.id === 'incidents')

  const alert = data.find((n) => n.type === 'whs-alert' && n.severity === 'high')
  if (!alert || alert.id === dismissedId) return null

  return (
    <Card role="alert" className="flex-row items-start gap-4 border-l-4 border-l-red-600 px-5 py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
        <AlertTriangle className="size-5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-red-700">{alert.title}</p>
          <span className="text-xs text-muted-foreground">{formatRelativeShort(alert.createdAt)}</span>
        </div>
        <p className="text-sm text-zinc-600">{alert.body}</p>
        {canSignOff && (
          <Button asChild variant="link" className="h-auto self-start p-0 text-red-700">
            <Link
              to={alert.incidentId ? '/incidents/$incidentId' : '/incidents'}
              params={alert.incidentId ? { incidentId: alert.incidentId } : undefined}
            >
              View &amp; Sign Off
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 text-muted-foreground"
        aria-label="Dismiss alert"
        onClick={() => setDismissedId(alert.id)}
      >
        <X />
      </Button>
    </Card>
  )
}
