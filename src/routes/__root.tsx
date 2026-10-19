import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { AppShell } from '@/components/AppShell'
import { ComingSoon } from '@/components/ComingSoon'
import { NoAccess } from '@/components/NoAccess'
import { Toaster } from '@/components/ui/sonner'
import { useRouteAccess } from '@/hooks/useModules'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <ComingSoon title="Page not found" message="This page does not exist yet." />,
})

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const allowed = useRouteAccess(pathname)

  return (
    <AppShell>
      {allowed ? <Outlet /> : <NoAccess />}
      <Toaster theme="light" position="bottom-right" />
    </AppShell>
  )
}
