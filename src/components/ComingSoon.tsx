import { Construction } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ComingSoonProps {
  title: string
  message?: string
}

export function ComingSoon({ title, message = 'This module is being built and will be available soon.' }: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">{title}</h1>
      <Card>
        <CardHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <Construction className="size-6" />
          </div>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  )
}
