import { DataTable } from '@/components/shared/DataTable'
import { ListToolbar } from '@/components/shared/ListToolbar'
import { TAB_CONFIGS, type TabConfig } from '@/components/site-diary/tabConfigs'
import { useProject } from '@/context/ProjectContext'
import { useSiteDiaryRecords } from '@/hooks/queries'
import { useRecordFilter } from '@/hooks/useRecordFilter'
import type { SiteDiaryRecords, SiteDiaryTab } from '@/types'

// - One register list. Each tab mounts its own panel, so queries and filters stay per tab.
export function SiteDiaryTabPanel<K extends SiteDiaryTab>({ tab }: { tab: K }) {
  const { project } = useProject()
  const { data = [], isLoading, isFetching } = useSiteDiaryRecords(tab, project.id)
  const config = TAB_CONFIGS[tab] as TabConfig<SiteDiaryRecords[K]>
  const { query, setQuery, filter, setFilter, filters, filtered, emptyMessage } = useRecordFilter(data, config)

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder={config.placeholder}
        filters={filters}
        filter={filter}
        onFilterChange={setFilter}
      />
      <DataTable
        columns={config.columns}
        rows={filtered}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
