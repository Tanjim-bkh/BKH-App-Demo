import type { ReactNode } from 'react'

// - Small building blocks shared by the day detail sections

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border bg-zinc-50 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <h4 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{children}</h4>
}
