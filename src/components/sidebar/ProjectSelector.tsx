import { Check, ChevronsUpDown, FolderKanban } from 'lucide-react'
import { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useProject } from '@/context/ProjectContext'
import { cn } from '@/lib/utils'

export function ProjectSelector() {
  const { project, projects, setProjectId } = useProject()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-md border border-sidebar-border bg-white px-2.5 py-2 text-left text-sm text-zinc-900 shadow-xs transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        >
          <FolderKanban className="size-4 shrink-0 text-brand" />
          <span className="flex-1 truncate">
            {project.name} - {project.code}
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" side="right" className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup heading="Projects">
              {projects.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.code} ${p.location}`}
                  onSelect={() => {
                    setProjectId(p.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">
                      {p.name} - {p.code}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.location}</span>
                  </div>
                  <Check className={cn('size-4', p.id === project.id ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
