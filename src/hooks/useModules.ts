import { useMemo } from 'react'
import { useMockUser } from '@/context/MockUserContext'
import { externalLinks, modules, navItems } from '@/data/mock'
import { reports } from '@/data/reports'
import type { Role } from '@/types'

/*
 * - Role-based access
 * - Items without requiredRoles are visible to every role
 *
 * - Scaffolder restrictions (driven by requiredRoles in data/mock.ts):
 *   - Sidebar nav: Site Diaries and Safety Alerts
 *   - Home modules: only the "Site Diary" tile visible
 *   - No access to Incidents, Reports, Site Crews or ITPs
 *
 * - WHS restrictions:
 *   - No Site Diaries (including the calendar) and no ITPs
 *   - Reports: only safety-related reports (data/reports.ts)
 *
 * - useRouteAccess also blocks these pages when opened by URL. API
 *   authorisation must enforce the same rules once Entra ID roles are available.
 */

export function canAccess(role: Role, requiredRoles?: Role[]) {
  return !requiredRoles || requiredRoles.includes(role)
}

function useRoleFiltered<T extends { requiredRoles?: Role[] }>(items: T[]) {
  const { user } = useMockUser()
  return useMemo(() => items.filter((item) => canAccess(user.role, item.requiredRoles)), [items, user.role])
}

export function useModules() {
  return useRoleFiltered(modules)
}

export function useExternalLinks() {
  return useRoleFiltered(externalLinks)
}

export function useNavItems() {
  return useRoleFiltered(navItems)
}

export function useReports() {
  return useRoleFiltered(reports)
}

// - True if the current user can open the given sidebar item, e.g. useCanAccessNav('calendar')
export function useCanAccessNav(navId: string) {
  const { user } = useMockUser()
  return canAccess(user.role, navItems.find((n) => n.id === navId)?.requiredRoles)
}

// - Pages that aren't in the sidebar but share a sidebar item's access rules
const ROUTE_ALIASES: Record<string, string> = { '/calendar': 'calendar' }

function rolesForPath(pathname: string): Role[] | undefined {
  const alias = Object.entries(ROUTE_ALIASES).find(([path]) => pathname === path || pathname.startsWith(`${path}/`))
  if (alias) return navItems.find((n) => n.id === alias[1])?.requiredRoles

  // - Home is always reachable; other pages match on their path prefix (covers detail pages)
  const match = [...navItems, ...modules].find(
    (item) => item.href !== '/' && (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  )
  return match?.requiredRoles
}

// - False when the current user isn't allowed on this page
export function useRouteAccess(pathname: string) {
  const { user } = useMockUser()
  return canAccess(user.role, rolesForPath(pathname))
}
