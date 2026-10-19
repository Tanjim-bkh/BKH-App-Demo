import { Link, useRouterState } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useNavItems } from '@/hooks/useModules'
import { getIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

const buttonClasses =
  'h-9 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-brand-700 data-[active=true]:[&>svg]:text-brand'

const badgeTone: Record<NonNullable<NavItem['badge']>['tone'], string> = {
  brand: 'bg-brand text-white peer-hover/menu-button:text-white peer-data-[active=true]/menu-button:text-white',
  red: 'bg-red-500 text-white peer-hover/menu-button:text-white peer-data-[active=true]/menu-button:text-white',
}

function useIsActive(href: string) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

// - Closes the mobile drawer after navigating
function useCloseOnNavigate() {
  const { isMobile, setOpenMobile } = useSidebar()
  return () => isMobile && setOpenMobile(false)
}

function NavMenuItem({ item }: { item: NavItem }) {
  const Icon = getIcon(item.icon)
  const isActive = useIsActive(item.href)
  const close = useCloseOnNavigate()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className={buttonClasses}>
        <Link to={item.href} onClick={close}>
          <Icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge && (
        <SidebarMenuBadge className={cn('top-2! rounded-full', badgeTone[item.badge.tone])}>
          {item.badge.label}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  )
}

export function NavMenu() {
  const items = useNavItems()
  return (
    <SidebarMenu>
      {items.map((item) => (
        <NavMenuItem key={item.id} item={item} />
      ))}
    </SidebarMenu>
  )
}

export function SettingsNav() {
  const isActive = useIsActive('/settings')
  const close = useCloseOnNavigate()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} className={buttonClasses}>
          <Link to="/settings" onClick={close}>
            <Settings />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
