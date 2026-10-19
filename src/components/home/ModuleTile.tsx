import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { Module, ModuleColor } from '@/types'

// - Static class strings so Tailwind can detect them
const COLOR_STYLES: Record<ModuleColor, { border: string; icon: string }> = {
  blue: { border: 'border-t-blue-500', icon: 'bg-blue-50 text-blue-600' },
  red: { border: 'border-t-red-500', icon: 'bg-red-50 text-red-600' },
  green: { border: 'border-t-emerald-500', icon: 'bg-emerald-50 text-emerald-600' },
  purple: { border: 'border-t-violet-500', icon: 'bg-violet-50 text-violet-600' },
  orange: { border: 'border-t-orange-500', icon: 'bg-orange-50 text-orange-600' },
  amber: { border: 'border-t-amber-500', icon: 'bg-amber-50 text-amber-600' },
}

const BADGE_STYLES: Record<NonNullable<Module['badge']>['variant'], string> = {
  default: 'bg-zinc-100 text-zinc-700',
  destructive: 'bg-red-100 text-red-700',
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
}

const linkClasses = 'group rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'

export function ModuleTile({ module }: { module: Module }) {
  const content = <TileCard module={module} />

  if (module.external) {
    return (
      <a href={module.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
        {content}
      </a>
    )
  }
  return (
    <Link to={module.href} className={linkClasses}>
      {content}
    </Link>
  )
}

function TileCard({ module }: { module: Module }): ReactNode {
  const Icon = getIcon(module.icon)
  const colors = COLOR_STYLES[module.color]

  return (
    <Card
      className={cn(
        'relative h-full gap-3 border-t-3 px-4 py-4 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md',
        colors.border,
      )}
    >
      {module.external && (
        <span className="absolute top-3 right-3 flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground">
          External
          <ArrowUpRight className="size-3" />
        </span>
      )}
      <div className={cn('flex size-10 items-center justify-center rounded-lg', colors.icon)}>
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-zinc-900">{module.name}</p>
        <p className="text-xs leading-snug text-muted-foreground">{module.description}</p>
      </div>
      {module.badge && (
        <Badge className={cn('mt-auto self-start', BADGE_STYLES[module.badge.variant])}>{module.badge.label}</Badge>
      )}
    </Card>
  )
}
