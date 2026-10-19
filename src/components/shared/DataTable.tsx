import type { KeyboardEvent, ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  width?: string // - applied to header and body cells, e.g. "w-40"
  className?: string // - body cells only
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  rows: T[]
  isLoading: boolean
  isFetching?: boolean
  emptyMessage: string
  // - Makes rows clickable (and keyboard-activatable with Enter)
  onRowClick?: (row: T) => void
}

// - Props that make a row behave like a link when onRowClick is set
function rowActions<T>(row: T, onRowClick?: (row: T) => void) {
  if (!onRowClick) return {}
  return {
    role: 'link',
    tabIndex: 0,
    onClick: () => onRowClick(row),
    onKeyDown: (e: KeyboardEvent) => e.key === 'Enter' && onRowClick(row),
    className: 'cursor-pointer focus-visible:bg-zinc-50 focus-visible:outline-none',
  }
}

// - Register-style table used by ITPs and the Site Diary tabs
// - Below md, rows render as stacked cards instead of a squeezed table
export function DataTable<T extends { id: string }>({ columns, rows, isLoading, isFetching, emptyMessage, onRowClick }: DataTableProps<T>) {
  const edge = (i: number) => cn(i === 0 && 'pl-5', i === columns.length - 1 && 'pr-5')
  const hasRows = !isLoading && rows.length > 0

  return (
    <Card className={cn('gap-0 overflow-hidden py-0 transition-opacity', isFetching && !isLoading && 'opacity-60')}>
      {hasRows && <RowCards columns={columns} rows={rows} onRowClick={onRowClick} />}
      <Table className={cn(hasRows && 'hidden md:table')}>
        <TableHeader>
          <TableRow className="bg-zinc-50 hover:bg-zinc-50">
            {columns.map((c, i) => (
              <TableHead key={c.header} className={cn(c.width, edge(i))}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }, (_, r) => (
              <TableRow key={r}>
                {columns.map((c, i) => (
                  <TableCell key={c.header} className={edge(i)}>
                    <Skeleton className={cn('h-4', i === 0 ? 'w-24' : 'w-3/4')} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} {...rowActions(row, onRowClick)}>
                {columns.map((c, i) => (
                  <TableCell key={c.header} className={cn('whitespace-normal', c.width, c.className, edge(i))}>
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

// - First column is the card heading; the rest are label / value pairs
interface RowCardsProps<T> {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
}

function RowCards<T extends { id: string }>({ columns, rows, onRowClick }: RowCardsProps<T>) {
  const [first, ...rest] = columns
  return (
    <ul className="divide-y md:hidden">
      {rows.map((row) => (
        <li key={row.id} {...rowActions(row, onRowClick)} className={cn('flex flex-col gap-2 px-4 py-3', onRowClick && 'cursor-pointer active:bg-zinc-50')}>
          <div className={cn('text-sm', first.className)}>{first.cell(row)}</div>
          <dl className="flex flex-col gap-1.5">
            {rest.map((c) => (
              <div key={c.header} className="flex items-start gap-3 text-sm">
                <dt className="w-20 shrink-0 pt-0.5 text-xs text-muted-foreground">{c.header}</dt>
                <dd className={cn('min-w-0', c.className)}>{c.cell(row)}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  )
}
