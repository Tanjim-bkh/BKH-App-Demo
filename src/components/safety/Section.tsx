import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SectionProps {
  title: string
  icon?: LucideIcon
  action?: ReactNode // - e.g. a button on the right of the heading
  className?: string
  children: ReactNode
}

// - Titled card used to group content on the incident and safety alert pages
export function Section({ title, icon: Icon, action, className, children }: SectionProps) {
  return (
    <Card className={cn('gap-3 p-4 md:p-5', className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          {Icon && <Icon className="size-4 text-brand" />}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </Card>
  )
}

// - Simple bulleted list with comfortable spacing
export function BulletList({ items, marker = 'disc' }: { items: string[]; marker?: 'disc' | 'decimal' }) {
  return (
    <ul className={cn('flex flex-col gap-1.5 pl-5 text-sm leading-relaxed text-zinc-700', marker === 'disc' ? 'list-disc' : 'list-decimal')}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

// - Label / value pair used in fact grids
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-zinc-900">{children}</dd>
    </div>
  )
}
