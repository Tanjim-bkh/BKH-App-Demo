import { format } from 'date-fns'
import { enAU } from 'date-fns/locale'
import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'
import { useMockUser } from '@/context/MockUserContext'
import { useProject } from '@/context/ProjectContext'
import { greetingFor } from '@/lib/format'

export function HomeHero() {
  const { user } = useMockUser()
  const { project } = useProject()
  const [now] = useState(() => new Date())

  return (
    <div className="flex flex-col items-center gap-3 pt-4 text-center">
      <BrandLogo className="w-44 md:w-56" />
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
        {greetingFor(now)}, {user.firstName}
      </h2>
      <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <span>{format(now, 'EEEE, d MMMM yyyy', { locale: enAU })}</span>
        <span aria-hidden>·</span>
        <MapPin className="size-3.5" />
        <span>{project.location}</span>
      </p>
    </div>
  )
}
