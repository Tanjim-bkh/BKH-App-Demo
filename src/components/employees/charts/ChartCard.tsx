import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  children: ReactNode
}

// - Shared frame for every employee chart: title + chevron, then the chart body
export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="flex items-center justify-between px-5">
        <CardTitle className="text-base font-semibold text-zinc-900">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          aria-label={`Open ${title}`}
          onClick={() => toast.info(`${title}`, { description: 'Details coming soon' })}
        >
          <ChevronRight />
        </Button>
      </CardHeader>
      <CardContent className="px-3">{children}</CardContent>
    </Card>
  )
}
