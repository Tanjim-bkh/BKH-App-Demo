import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { mockUser } from '@/data/mock'
import type { Role, User } from '@/types'

// - Stand-in for the signed-in user until Microsoft Entra ID SSO is wired up
// - In production the role comes from the Entra ID token claims, not local state
interface MockUserContextValue {
  user: User
  // - Dev-only helper for previewing role-based filtering
  setRole: (role: Role) => void
}

const MockUserContext = createContext<MockUserContextValue | null>(null)

export function MockUserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(mockUser.role)
  const value = useMemo(() => ({ user: { ...mockUser, role }, setRole }), [role])
  return <MockUserContext.Provider value={value}>{children}</MockUserContext.Provider>
}

export function useMockUser() {
  const ctx = useContext(MockUserContext)
  if (!ctx) throw new Error('useMockUser must be used inside MockUserProvider')
  return ctx
}
