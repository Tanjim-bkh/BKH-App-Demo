import { cva, type VariantProps } from 'class-variance-authority'
import { AlertTriangle, ClipboardCheck, Clock, FileText, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const diaryBadgeVariants = cva(
  'flex w-fit max-w-full items-center gap-1 truncate rounded-full px-2 py-0.5 text-left text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&>svg]:size-3 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        diary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        lost: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
        'incident-medium': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        'incident-high': 'bg-red-600 font-semibold text-white hover:bg-red-700',
        employees: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
        itp: 'bg-violet-100 text-violet-700 hover:bg-violet-200',
      },
    },
  },
)

export type DiaryBadgeVariant = NonNullable<VariantProps<typeof diaryBadgeVariants>['variant']>

const ICONS: Record<DiaryBadgeVariant, LucideIcon> = {
  diary: FileText,
  lost: Clock,
  'incident-medium': AlertTriangle,
  'incident-high': AlertTriangle,
  employees: Users,
  itp: ClipboardCheck,
}

interface DiaryBadgeProps {
  variant: DiaryBadgeVariant
  label: string
  // - Shown instead of label below xl, where grid cells are narrow
  shortLabel?: string
  onClick?: () => void
  className?: string
}

export function DiaryBadge({ variant, label, shortLabel, onClick, className }: DiaryBadgeProps) {
  const Icon = ICONS[variant]
  return (
    <button type="button" onClick={onClick} title={label} className={cn(diaryBadgeVariants({ variant }), className)}>
      <Icon />
      {shortLabel ? (
        <>
          <span className="truncate xl:hidden">{shortLabel}</span>
          <span className="hidden truncate xl:inline">{label}</span>
        </>
      ) : (
        <span className="truncate">{label}</span>
      )}
    </button>
  )
}
