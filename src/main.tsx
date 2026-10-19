import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MockUserProvider } from '@/context/MockUserContext'
import { ProjectProvider } from '@/context/ProjectContext'
import { routeTree } from './routeTree.gen'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
})

const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  // - Each route sets staticData.title, which the Topbar displays
  interface StaticDataRouteOption {
    title?: string
    // - Route manages its own padding and scrolling (e.g. two-panel layouts)
    fullBleed?: boolean
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MockUserProvider>
        <ProjectProvider>
          <TooltipProvider delayDuration={200}>
            <RouterProvider router={router} />
          </TooltipProvider>
        </ProjectProvider>
      </MockUserProvider>
    </QueryClientProvider>
  </StrictMode>,
)
