import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  subLabel?: ReactNode
  // - Red border + red icon when the value needs attention
  alert?: boolean
}

export function StatTile({ icon: Icon, label, value, subLabel, alert = false }: StatTileProps) {
  return (
    <Card className={cn('flex-row items-start gap-4 px-5 py-5', alert && 'border-red-400 ring-1 ring-red-100')}>
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-full',
          alert ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600',
        )}
      >
        <Icon className="size-6" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-3xl font-bold tracking-tight text-zinc-900">{value}</span>
        {subLabel && <span className="text-xs text-muted-foreground">{subLabel}</span>}
      </div>
    </Card>
  )
}
