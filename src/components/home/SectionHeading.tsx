import type { ReactNode } from 'react'

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{children}</h3>
}
