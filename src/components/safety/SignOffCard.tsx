import { format } from 'date-fns'
import { CircleCheck, ClipboardSignature } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { SafetyAlert } from '@/types'

interface SignOffCardProps {
  alert: SafetyAlert
  onSignOff: () => void
  pending: boolean
}

// - Active alerts need a toolbox talk; signing off moves them to Signed
export function SignOffCard({ alert, onSignOff, pending }: SignOffCardProps) {
  if (alert.status === 'Signed') {
    return (
      <Card className="gap-1.5 border-emerald-200 bg-emerald-50 p-4">
        <p className="flex items-center gap-2 font-semibold text-emerald-800">
          <CircleCheck className="size-5" />
          Toolbox completed
        </p>
        <p className="text-sm text-emerald-900">
          Signed off by {alert.signedBy}
          {alert.signedAt && <> on {format(alert.signedAt, 'dd/MM/yyyy h:mm a')}</>}
        </p>
      </Card>
    )
  }

  return (
    <Card className="gap-3 border-brand-100 bg-brand-50 p-4">
      <p className="flex items-center gap-2 font-semibold text-zinc-900">
        <ClipboardSignature className="size-5 text-brand" />
        Toolbox talk required
      </p>
      <p className="text-sm text-zinc-700">Run a toolbox talk on this alert with your site team, then sign off to confirm it has been covered.</p>
      <Button onClick={onSignOff} disabled={pending}>
        {pending ? 'Signing off...' : 'Toolbox done - sign off'}
      </Button>
    </Card>
  )
}
