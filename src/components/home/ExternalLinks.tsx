import { TileGrid } from '@/components/home/ModuleGrid'
import { useExternalLinks } from '@/hooks/useModules'

export function ExternalLinks() {
  const links = useExternalLinks()
  return <TileGrid items={links} />
}
