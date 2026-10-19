import { useMatches } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { cn } from '@/lib/utils'

// - Fixed full-height layout: 220px light sidebar + topbar + scrolling content
export function AppShell({ children }: { children: ReactNode }) {
  const fullBleed = useMatches({ select: (matches) => matches.some((m) => m.staticData.fullBleed) })

  return (
    <SidebarProvider className="h-svh min-h-0 overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className={cn('flex-1', fullBleed ? 'min-h-0 overflow-hidden' : 'overflow-y-auto p-4 md:p-7')}>{children}</main>
      </div>
    </SidebarProvider>
  )
}
