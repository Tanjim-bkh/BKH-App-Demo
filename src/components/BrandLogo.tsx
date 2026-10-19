import { cn } from '@/lib/utils'

// - Official BKH Group logo served from public/
export function BrandLogo({ className }: { className?: string }) {
  return <img src="/BKH_Group_Logo.svg" alt="BKH Group" className={cn('h-auto w-full select-none', className)} draggable={false} />
}
