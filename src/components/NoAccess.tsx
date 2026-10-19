import { Link } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// - Shown in place of a page the current role isn't allowed to open
export function NoAccess() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
            <Lock className="size-6" />
          </div>
          <CardTitle>You don't have access to this page</CardTitle>
          <CardDescription>Your role doesn't include this area of the portal. Contact your administrator if you need access.</CardDescription>
          <Button asChild variant="outline" className="mx-auto mt-3">
            <Link to="/">Back to Home</Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
