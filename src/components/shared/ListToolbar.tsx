import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export interface FilterOption {
  value: string
  label: string
  count: number
}

interface ListToolbarProps {
  query: string
  onQueryChange: (query: string) => void
  placeholder: string
  filters?: FilterOption[]
  filter?: string
  onFilterChange?: (value: string) => void
}

// - Search box plus an optional single-select filter with counts
export function ListToolbar({ query, onQueryChange, placeholder, filters, filter, onFilterChange }: ListToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="bg-white pl-8"
        />
      </div>
      {filters && (
        <ToggleGroup type="single" variant="outline" size="sm" value={filter} onValueChange={(v) => v && onFilterChange?.(v)}>
          {filters.map((f) => (
            <ToggleGroupItem key={f.value} value={f.value} className="px-3">
              {f.label} ({f.count})
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    </div>
  )
}
