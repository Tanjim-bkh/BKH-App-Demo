import { format, parseISO } from 'date-fns'
import { enAU } from 'date-fns/locale'
import type { Column } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { SiteDiaryRecords, SiteDiaryTab } from '@/types'

export interface TabConfig<T> {
  label: string
  placeholder: string
  columns: Column<T>[]
  searchText: (row: T) => string
  getStatus?: (row: T) => string
  statuses?: string[]
}

type TabConfigs = { [K in SiteDiaryTab]: TabConfig<SiteDiaryRecords[K]> }

const numberCell = 'font-mono text-xs font-medium text-brand-700'

export const TAB_ORDER: SiteDiaryTab[] = ['diaries', 'handovers', 'inspections', 'swms', 'dockets']

// - Column definitions for each Site Diary subtab
export const TAB_CONFIGS: TabConfigs = {
  diaries: {
    label: 'Site Diaries',
    placeholder: 'Search dates or notes',
    columns: [
      // - e.g. "Sat 17/01/2026"
      { header: 'Date', width: 'w-40', className: 'font-medium', cell: (r) => format(parseISO(r.date), 'EEE dd/MM/yyyy', { locale: enAU }) },
      {
        header: 'Shift',
        width: 'w-32',
        cell: (r) => (
          <Badge variant="outline" className={cn('rounded-full', r.shift === 'Morning' ? 'text-amber-700' : 'text-indigo-700')}>
            {r.shift}
          </Badge>
        ),
      },
      { header: 'Notes', className: 'text-muted-foreground', cell: (r) => r.notes },
    ],
    searchText: (r) => `${format(parseISO(r.date), 'EEE dd/MM/yyyy')} ${r.notes}`,
    getStatus: (r) => r.shift,
    statuses: ['Morning', 'Afternoon'],
  },
  handovers: {
    label: 'Handovers',
    placeholder: 'Search number or description',
    columns: [
      { header: 'Number', width: 'w-40', className: numberCell, cell: (r) => r.number },
      { header: 'Work Type', width: 'w-32', cell: (r) => r.workType },
      { header: 'Status', width: 'w-28', cell: (r) => <StatusBadge status={r.status} /> },
      { header: 'Description', className: 'text-muted-foreground', cell: (r) => r.description },
    ],
    searchText: (r) => `${r.number} ${r.workType} ${r.description}`,
    getStatus: (r) => r.status,
    statuses: ['Active', 'Signed'],
  },
  inspections: {
    label: 'Inspections',
    placeholder: 'Search number or description',
    columns: [
      { header: 'Number', width: 'w-40', className: numberCell, cell: (r) => r.number },
      { header: 'Status', width: 'w-28', cell: (r) => <StatusBadge status={r.status} /> },
      { header: 'Description', className: 'text-muted-foreground', cell: (r) => r.description },
    ],
    searchText: (r) => `${r.number} ${r.description}`,
    getStatus: (r) => r.status,
    statuses: ['Active', 'Signed'],
  },
  swms: {
    label: 'SWMS',
    placeholder: 'Search number or title',
    columns: [
      { header: 'Number', width: 'w-40', className: numberCell, cell: (r) => r.number },
      { header: 'Title', className: 'font-medium text-zinc-900', cell: (r) => r.title },
      { header: 'Status', width: 'w-28', cell: (r) => <StatusBadge status={r.status} /> },
      { header: 'Rev', width: 'w-20', className: 'tabular-nums', cell: (r) => `Rev ${r.revision}` },
    ],
    searchText: (r) => `${r.number} ${r.title}`,
    getStatus: (r) => r.status,
    statuses: ['Active', 'Signed'],
  },
  dockets: {
    label: 'Day Labour Dockets',
    placeholder: 'Search number or notes',
    columns: [
      { header: 'Number', width: 'w-40', className: numberCell, cell: (r) => r.number },
      { header: 'Status', width: 'w-28', cell: (r) => <StatusBadge status={r.status} /> },
      { header: 'Notes', className: 'text-muted-foreground', cell: (r) => r.notes },
    ],
    searchText: (r) => `${r.number} ${r.notes}`,
    getStatus: (r) => r.status,
    statuses: ['Approved', 'Signed'],
  },
}
