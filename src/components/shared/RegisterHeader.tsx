import { ProjectSwitcher } from '@/components/shared/ProjectSwitcher'
import { useProject } from '@/context/ProjectContext'

// - Page heading for project registers, with the project switcher on the right
export function RegisterHeader({ title, description }: { title: string; description: string }) {
  const { project } = useProject()
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {description} {project.name} - {project.code} · Project {project.number} · {project.location}
        </p>
      </div>
      <ProjectSwitcher />
    </div>
  )
}
