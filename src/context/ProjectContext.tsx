import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { projects } from '@/data/mock'
import type { Project } from '@/types'

interface ProjectContextValue {
  project: Project
  projects: Project[]
  setProjectId: (id: string) => void
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projectId, setProjectId] = useState(projects[0].id)
  const value = useMemo(
    () => ({
      project: projects.find((p) => p.id === projectId) ?? projects[0],
      projects,
      setProjectId,
    }),
    [projectId],
  )
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used inside ProjectProvider')
  return ctx
}
