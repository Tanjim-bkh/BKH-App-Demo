import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { IncidentSeverity } from '@/types'

const STYLES: Record<IncidentSeverity, string> = {
  high: 'bg-red-600 text-white',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-zinc-100 text-zinc-700',
}

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  return <Badge className={cn('rounded-full capitalize', STYLES[severity])}>{severity}</Badge>
}
