import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { BrandLogo } from '@/components/BrandLogo'
import { MiniCalendar } from '@/components/MiniCalendar'
import { NavMenu, SettingsNav } from '@/components/sidebar/NavMenu'
import { ProjectSelector } from '@/components/sidebar/ProjectSelector'
import { UserMenu } from '@/components/sidebar/UserMenu'
import { useCanAccessNav } from '@/hooks/useModules'

export function Sidebar() {
  // - The mini calendar shows site diary data
  const canSeeCalendar = useCanAccessNav('calendar')

  return (
    <SidebarRoot collapsible="offcanvas">
      <SidebarHeader className="px-4 py-4">
        <BrandMark />
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <NavMenu />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400">Active project</SidebarGroupLabel>
          <ProjectSelector />
        </SidebarGroup>
        {canSeeCalendar && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-zinc-400">Calendar</SidebarGroupLabel>
            <MiniCalendar />
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-sidebar-border">
        <SettingsNav />
        <UserMenu />
      </SidebarFooter>
    </SidebarRoot>
  )
}

function BrandMark() {
  return (
    <div className="flex flex-col items-center">
      <BrandLogo className="h-14 w-auto" />
      <span className="text-[11px] tracking-wide text-muted-foreground">Enterprise Portal</span>
    </div>
  )
}
