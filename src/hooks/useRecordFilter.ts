import { useMemo, useState } from 'react'
import type { FilterOption } from '@/components/shared/ListToolbar'

interface RecordFilterOptions<T> {
  searchText: (row: T) => string
  // - Omit for lists without a status filter
  getStatus?: (row: T) => string
  statuses?: string[]
}

// - Client-side search + status filtering for register lists
export function useRecordFilter<T>(rows: T[], { searchText, getStatus, statuses }: RecordFilterOptions<T>) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(
      (r) =>
        (filter === 'all' || getStatus?.(r) === filter) &&
        (!q || searchText(r).toLowerCase().includes(q)),
    )
  }, [rows, query, filter, searchText, getStatus])

  const filters: FilterOption[] | undefined =
    getStatus && statuses
      ? [
          { value: 'all', label: 'All', count: rows.length },
          ...statuses.map((s) => ({ value: s, label: s, count: rows.filter((r) => getStatus(r) === s).length })),
        ]
      : undefined

  const emptyMessage = query || filter !== 'all' ? 'No records match your filters.' : 'No records for this project yet.'

  return { query, setQuery, filter, setFilter, filters, filtered, emptyMessage }
}
