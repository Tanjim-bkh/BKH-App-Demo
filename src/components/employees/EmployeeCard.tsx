import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Employee, EmployeeStatus } from '@/data/employees'
import { cn } from '@/lib/utils'

// - Static class strings so Tailwind can detect them
const STATUS_STYLES: Record<EmployeeStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  'on-leave': { label: 'On Leave', className: 'bg-amber-100 text-amber-700' },
  inactive: { label: 'Inactive', className: 'bg-zinc-100 text-zinc-600' },
}

interface EmployeeCardProps {
  employee: Employee
  selected: boolean
  onSelect: (id: string) => void
}

export function EmployeeCard({ employee, selected, onSelect }: EmployeeCardProps) {
  const status = STATUS_STYLES[employee.status]

  return (
    <button
      type="button"
      onClick={() => onSelect(employee.id)}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-3 border-l-4 px-3 py-2.5 text-left transition-colors focus-visible:bg-zinc-50 focus-visible:outline-none',
        selected ? 'border-l-blue-600 bg-blue-50' : 'border-l-transparent hover:bg-zinc-50',
      )}
    >
      <Avatar size="lg">
        <AvatarFallback className={cn('text-sm font-medium text-white', employee.avatarColor)}>
          {employee.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold text-zinc-900">{employee.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{employee.stats.hoursThisWeek}h</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">{employee.role}</span>
          <Badge className={cn('px-1.5 py-0 text-[10px]', status.className)}>{status.label}</Badge>
        </div>
      </div>
    </button>
  )
}
