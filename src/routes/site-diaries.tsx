import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { RegisterHeader } from '@/components/shared/RegisterHeader'
import { SiteDiaryTabPanel } from '@/components/site-diary/SiteDiaryTabPanel'
import { TAB_CONFIGS, TAB_ORDER } from '@/components/site-diary/tabConfigs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SiteDiaryTab } from '@/types'

// - The active subtab lives in the URL (?tab=handovers) so it survives refresh and can be linked to
export const Route = createFileRoute('/site-diaries')({
  staticData: { title: 'Site Diaries' },
  validateSearch: (search: Record<string, unknown>): { tab?: SiteDiaryTab } =>
    TAB_ORDER.includes(search.tab as SiteDiaryTab) ? { tab: search.tab as SiteDiaryTab } : {},
  component: SiteDiariesPage,
})

function SiteDiariesPage() {
  const { tab = 'diaries' } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <div className="flex flex-col gap-5">
      <RegisterHeader title="Site Diary" description="Diaries, handovers, inspections, SWMS and dockets for" />

      <Tabs value={tab} onValueChange={(v) => navigate({ search: v === 'diaries' ? {} : { tab: v as SiteDiaryTab } })}>
        {/* - Five tabs don't fit on a phone, so the strip scrolls sideways */}
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <TabsList className="w-max">
            {TAB_ORDER.map((t) => (
              <TabsTrigger key={t} value={t} className="px-3 md:px-4">
                {TAB_CONFIGS[t].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {TAB_ORDER.map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            <SiteDiaryTabPanel tab={t} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
