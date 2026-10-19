import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { SafetyAlertLink } from '@/components/safety/SafetyAlertLink'
import { SeverityBadge } from '@/components/safety/SeverityBadge'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ListToolbar } from '@/components/shared/ListToolbar'
import { RegisterHeader } from '@/components/shared/RegisterHeader'
import { useProject } from '@/context/ProjectContext'
import { useIncidents } from '@/hooks/queries'
import { useRecordFilter } from '@/hooks/useRecordFilter'
import type { IncidentView } from '@/types'

export const Route = createFileRoute('/incidents/')({
  staticData: { title: 'Incidents' },
  component: IncidentsPage,
})

const COLUMNS: Column<IncidentView>[] = [
  { header: 'Number', width: 'w-36', className: 'font-mono text-xs font-medium text-brand-700', cell: (r) => r.number },
  { header: 'Title', className: 'font-medium text-zinc-900', cell: (r) => r.title },
  { header: 'Date', width: 'w-28', cell: (r) => format(r.occurredAt, 'dd/MM/yyyy') },
  { header: 'Severity', width: 'w-24', cell: (r) => <SeverityBadge severity={r.severity} /> },
  { header: 'Safety Alert', width: 'w-32', cell: (r) => <SafetyAlertLink alert={r.safetyAlert} /> },
]

const FILTER_CONFIG = {
  searchText: (r: IncidentView) => `${r.number} ${r.title} ${r.location} ${r.safetyAlert ? `#${r.safetyAlert.number}` : ''}`,
  // - Filter chips show severity, capitalised to read as labels
  getStatus: (r: IncidentView) => r.severity.charAt(0).toUpperCase() + r.severity.slice(1),
  statuses: ['High', 'Medium', 'Low'],
}

function IncidentsPage() {
  const { project } = useProject()
  const navigate = useNavigate()
  const { data = [], isLoading, isFetching } = useIncidents(project.id)
  const { query, setQuery, filter, setFilter, filters, filtered, emptyMessage } = useRecordFilter(data, FILTER_CONFIG)

  return (
    <div className="flex flex-col gap-5">
      <RegisterHeader title="Incidents" description="Incidents reported on" />
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search number, title, location or alert #"
        filters={filters}
        filter={filter}
        onFilterChange={setFilter}
      />
      <DataTable
        columns={COLUMNS}
        rows={filtered}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={emptyMessage}
        onRowClick={(r) => navigate({ to: '/incidents/$incidentId', params: { incidentId: r.id } })}
      />
    </div>
  )
}
