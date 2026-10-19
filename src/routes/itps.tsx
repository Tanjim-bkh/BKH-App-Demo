import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ListToolbar } from '@/components/shared/ListToolbar'
import { RegisterHeader } from '@/components/shared/RegisterHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useProject } from '@/context/ProjectContext'
import { useProjectItps } from '@/hooks/queries'
import { useRecordFilter } from '@/hooks/useRecordFilter'
import type { ItpRecord } from '@/types'

export const Route = createFileRoute('/itps')({
  staticData: { title: 'ITPs' },
  component: ItpsPage,
})

const COLUMNS: Column<ItpRecord>[] = [
  { header: 'Record Number', width: 'w-36', className: 'font-mono text-xs font-medium text-brand-700', cell: (r) => r.recordNumber },
  { header: 'Record Name', className: 'font-medium text-zinc-900', cell: (r) => r.recordName },
  { header: 'ITP Type', className: 'text-muted-foreground', cell: (r) => r.itpType },
  { header: 'Status', width: 'w-28', cell: (r) => <StatusBadge status={r.status} /> },
]

const FILTER_CONFIG = {
  searchText: (r: ItpRecord) => `${r.recordNumber} ${r.recordName} ${r.itpType}`,
  getStatus: (r: ItpRecord) => r.status,
  statuses: ['Active', 'Signed'],
}

function ItpsPage() {
  const { project } = useProject()
  const { data = [], isLoading, isFetching } = useProjectItps(project.id)
  const { query, setQuery, filter, setFilter, filters, filtered, emptyMessage } = useRecordFilter(data, FILTER_CONFIG)

  return (
    <div className="flex flex-col gap-5">
      <RegisterHeader title="Inspection & Test Plans" description="All ITPs recorded for" />
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search record number, name or ITP type"
        filters={filters}
        filter={filter}
        onFilterChange={setFilter}
      />
      <DataTable columns={COLUMNS} rows={filtered} isLoading={isLoading} isFetching={isFetching} emptyMessage={emptyMessage} />
    </div>
  )
}
