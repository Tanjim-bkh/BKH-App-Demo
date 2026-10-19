import { useMatches, useNavigate, useRouterState } from '@tanstack/react-router'
import { MapPin, Search, Settings, type LucideIcon } from 'lucide-react'
import { NotificationPanel } from '@/components/NotificationPanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useProject } from '@/context/ProjectContext'
import { useCanAccessNav } from '@/hooks/useModules'

function usePageTitle() {
  return useMatches({
    select: (matches) => [...matches].reverse().find((m) => m.staticData.title)?.staticData.title ?? 'BKH Portal',
  })
}

export function Topbar() {
  const title = usePageTitle()
  const { project } = useProject()

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b bg-white px-3 md:gap-4 md:px-7">
      <SidebarTrigger className="-ml-1 shrink-0" aria-label="Toggle navigation" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <h1 className="truncate text-base font-semibold text-zinc-900">{title}</h1>
        <Separator orientation="vertical" className="hidden h-5! md:block" />
        <div className="hidden min-w-0 items-center gap-1.5 overflow-hidden md:flex">
          <Badge variant="secondary">{project.name}</Badge>
          <Badge variant="outline" className="font-mono">
            {project.code}
          </Badge>
          <Badge variant="outline" className="hidden text-muted-foreground xl:inline-flex">
            <MapPin />
            {project.location}
          </Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 md:gap-1.5">
        <ViewSwitcher />
        <Separator orientation="vertical" className="mx-1 hidden h-5! sm:block" />
        <NotificationPanel />
        <div className="hidden items-center gap-1.5 sm:flex">
          <StubIconButton icon={Search} label="Search" />
          <StubIconButton icon={Settings} label="Settings" />
        </div>
      </div>
    </header>
  )
}

function ViewSwitcher() {
  const navigate = useNavigate()
  // - The calendar is site diary data, so it follows Site Diaries access
  const canSeeCalendar = useCanAccessNav('calendar')
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const value = pathname === '/' ? 'home' : pathname.startsWith('/calendar') ? 'calendar' : ''
  if (!canSeeCalendar) return null

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value}
      onValueChange={(v) => {
        if (v === 'home') navigate({ to: '/' })
        if (v === 'calendar') navigate({ to: '/calendar' })
      }}
    >
      <ToggleGroupItem value="home" className="px-2.5 sm:px-3 data-[state=on]:bg-brand data-[state=on]:text-white">
        Home
      </ToggleGroupItem>
      <ToggleGroupItem value="calendar" className="px-2.5 sm:px-3 data-[state=on]:bg-brand data-[state=on]:text-white">
        Calendar
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function StubIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label}>
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label} - coming soon</TooltipContent>
    </Tooltip>
  )
}
