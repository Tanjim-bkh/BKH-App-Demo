import { ModuleTile } from '@/components/home/ModuleTile'
import { useModules } from '@/hooks/useModules'
import type { Module } from '@/types'

export function TileGrid({ items }: { items: Module[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
      {items.map((m) => (
        <ModuleTile key={m.id} module={m} />
      ))}
    </div>
  )
}

export function ModuleGrid() {
  const modules = useModules()
  return <TileGrid items={modules} />
}
