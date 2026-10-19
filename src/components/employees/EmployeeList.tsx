import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Employee } from '@/data/employees'
import { EmployeeCard } from './EmployeeCard'

interface EmployeeListProps {
  employees: Employee[]
  selectedEmployeeId: string
  onSelect: (id: string) => void
}

export function EmployeeList({ employees, selectedEmployeeId, onSelect }: EmployeeListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return employees
    return employees.filter((e) => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
  }, [employees, query])

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r bg-white md:w-65">
      <div className="flex flex-col gap-3 border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-zinc-900">Site Crews</h2>
          <Badge variant="secondary" className="tabular-nums">
            {employees.length}
          </Badge>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or role"
            aria-label="Search employees"
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col py-1">
          {filtered.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              selected={employee.id === selectedEmployeeId}
              onSelect={onSelect}
            />
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No employees match "{query}"</p>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
