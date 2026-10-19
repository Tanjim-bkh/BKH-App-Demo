import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { FileText } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { ListToolbar } from '@/components/shared/ListToolbar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useSafetyAlerts } from '@/hooks/queries'
import { useRecordFilter } from '@/hooks/useRecordFilter'
import type { SafetyAlertView } from '@/types'

export const Route = createFileRoute('/safety-alerts/')({
  staticData: { title: 'Safety Alerts' },
  component: SafetyAlertsPage,
})

const COLUMNS: Column<SafetyAlertView>[] = [
  { header: 'Alert', width: 'w-20', className: 'font-mono text-xs font-medium text-brand-700', cell: (r) => `#${r.number}` },
  {
    header: 'Title',
    className: 'font-medium text-zinc-900',
    cell: (r) => (
      <span className="flex items-start gap-1.5">
        {r.title}
        {r.pdf && <FileText className="mt-0.5 size-3.5 shrink-0 text-red-600" aria-label="Has PDF" />}
      </span>
    ),
  },
  { header: 'Issued', width: 'w-28', cell: (r) => format(r.issuedAt, 'dd/MM/yyyy') },
  { header: 'Incident', width: 'w-32', className: 'font-mono text-xs text-muted-foreground', cell: (r) => r.incident?.number ?? '-' },
  { header: 'Status', width: 'w-28', cell: (r) => <StatusBadge status={r.status} /> },
]

const FILTER_CONFIG = {
  searchText: (r: SafetyAlertView) => `#${r.number} ${r.title} ${r.incident?.number ?? ''}`,
  getStatus: (r: SafetyAlertView) => r.status,
  statuses: ['Active', 'Signed'],
}

// - Safety alerts come from the Safety department and apply across projects, so there's no project switcher
function SafetyAlertsPage() {
  const navigate = useNavigate()
  const { data = [], isLoading, isFetching } = useSafetyAlerts()
  const { query, setQuery, filter, setFilter, filters, filtered, emptyMessage } = useRecordFilter(data, FILTER_CONFIG)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">Safety Alerts</h2>
        <p className="text-sm text-muted-foreground">Issued by the BKH Safety department. Toolbox each Active alert with your site team, then sign off.</p>
      </div>
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search alert #, title or incident"
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
        onRowClick={(r) => navigate({ to: '/safety-alerts/$alertId', params: { alertId: r.id } })}
      />
    </div>
  )
}
