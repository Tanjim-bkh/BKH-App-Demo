import { BadgeCheck, CircleCheck, CircleDot, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type Status = 'Signed' | 'Active' | 'Approved'

const STYLES: Record<Status, { icon: LucideIcon; className: string }> = {
  Signed: { icon: CircleCheck, className: 'bg-emerald-100 text-emerald-700' },
  Active: { icon: CircleDot, className: 'bg-blue-100 text-blue-700' },
  Approved: { icon: BadgeCheck, className: 'bg-brand-100 text-brand-700' },
}

export function StatusBadge({ status }: { status: Status }) {
  const { icon: Icon, className } = STYLES[status]
  return (
    <Badge className={cn('rounded-full', className)}>
      <Icon />
      {status}
    </Badge>
  )
}
