import { ChevronsUpDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMockUser } from '@/context/MockUserContext'
import type { Role } from '@/types'

const ROLES: Role[] = ['PM', 'Supervisor', 'Scaffolder', 'WHS']

const ROLE_LABELS: Record<Role, string> = {
  PM: 'Project Manager',
  Supervisor: 'Site Supervisor',
  Scaffolder: 'Scaffolder',
  WHS: 'WHS Officer',
}

export function UserMenu() {
  const { user, setRole } = useMockUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand text-xs font-semibold text-white">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-zinc-900">{user.name}</span>
            <span className="truncate text-[11px] text-muted-foreground">{ROLE_LABELS[user.role]}</span>
          </div>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">{user.role}</span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Preview as role (dev only)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={user.role} onValueChange={(v) => setRole(v as Role)}>
          {ROLES.map((role) => (
            <DropdownMenuRadioItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
