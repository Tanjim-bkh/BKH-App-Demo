import { ChevronsUpDown, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProject } from '@/context/ProjectContext'

// - Changes the app-wide active project, so the sidebar selector stays in sync
export function ProjectSwitcher() {
  const { project, projects, setProjectId } = useProject()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between sm:w-auto sm:min-w-56">
          <span className="flex items-center gap-2">
            <FolderKanban className="text-brand" />
            {project.name} - {project.code}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch project</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={project.id} onValueChange={setProjectId}>
          {projects.map((p) => (
            <DropdownMenuRadioItem key={p.id} value={p.id} className="flex-col items-start gap-0">
              <span className="font-medium">
                {p.name} - {p.code}
              </span>
              <span className="text-xs text-muted-foreground">{p.location}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
