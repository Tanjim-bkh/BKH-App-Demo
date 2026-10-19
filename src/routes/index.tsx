import { createFileRoute } from '@tanstack/react-router'
import { ExternalLinks } from '@/components/home/ExternalLinks'
import { HomeHero } from '@/components/home/HomeHero'
import { ModuleGrid } from '@/components/home/ModuleGrid'
import { SectionHeading } from '@/components/home/SectionHeading'
import { WhsAlert } from '@/components/home/WhsAlert'

export const Route = createFileRoute('/')({
  staticData: { title: 'Home' },
  component: HomePage,
})

function HomePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <HomeHero />
      <WhsAlert />
      <section className="flex flex-col gap-3">
        <SectionHeading>BKH Modules</SectionHeading>
        <ModuleGrid />
      </section>
      <section className="flex flex-col gap-3">
        <SectionHeading>Linked Systems</SectionHeading>
        <ExternalLinks />
      </section>
    </div>
  )
}
