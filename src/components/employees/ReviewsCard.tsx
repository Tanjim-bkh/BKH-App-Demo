import { format, parseISO } from 'date-fns'
import { MessageSquareText, Star } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Employee, Review } from '@/data/employees'
import { cn } from '@/lib/utils'
import { ChartCard } from './charts/ChartCard'

// - Site supervisor reviews of the worker: average rating up top, newest review first
export function ReviewsCard({ employee }: { employee: Employee }) {
  const { reviews } = employee
  const [open, setOpen] = useState<Review | null>(null)
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <ChartCard title={`Reviews (${reviews.length})`}>
      {reviews.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <MessageSquareText className="size-8 text-zinc-300" />
          No reviews from site supervisors yet.
        </div>
      ) : (
        <div className="flex h-60 flex-col gap-2 px-2">
          <div className="flex items-center gap-2 border-b pb-2">
            <span className="text-2xl font-bold text-zinc-900">{average.toFixed(1)}</span>
            <Stars rating={Math.round(average)} />
            <span className="text-xs text-muted-foreground">average from site supervisors</span>
          </div>
          <ul className="flex min-h-0 flex-1 flex-col divide-y overflow-y-auto">
            {reviews.map((review) => (
              <li key={review.id}>
                <button
                  type="button"
                  onClick={() => setOpen(review)}
                  className="flex w-full flex-col gap-1 rounded-md py-2 text-left hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-900">{review.reviewer.name}</span>
                    <Stars rating={review.rating} small />
                  </span>
                  <span className="line-clamp-2 text-sm text-zinc-600">{review.comment}</span>
                  <span className="text-xs text-muted-foreground">{format(parseISO(review.date), 'dd/MM/yyyy')}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="w-[95vw] max-w-lg sm:max-w-lg">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>Review of {employee.name}</DialogTitle>
                <DialogDescription>
                  {open.reviewer.name} · {open.reviewer.role} · {format(parseISO(open.date), 'dd/MM/yyyy')}
                </DialogDescription>
              </DialogHeader>
              <Stars rating={open.rating} />
              <p className="text-sm leading-relaxed text-zinc-700">{open.comment}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ChartCard>
  )
}

function Stars({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <span className="flex shrink-0 gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(small ? 'size-3.5' : 'size-4', n <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-100 text-zinc-300')}
        />
      ))}
    </span>
  )
}
