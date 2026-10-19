import { Link, createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft, FileText, Lightbulb, ListChecks } from 'lucide-react'
import { ComingSoon } from '@/components/ComingSoon'
import { PdfViewer } from '@/components/safety/PdfViewer'
import { alertLabel } from '@/components/safety/SafetyAlertLink'
import { BulletList, Fact, Section } from '@/components/safety/Section'
import { SignOffCard } from '@/components/safety/SignOffCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useMockUser } from '@/context/MockUserContext'
import { useSafetyAlert, useSignOffSafetyAlert } from '@/hooks/queries'

export const Route = createFileRoute('/safety-alerts/$alertId')({
  staticData: { title: 'Safety Alert' },
  component: SafetyAlertPage,
})

// - Key points first so crews can read the alert on a phone, the official PDF below for the full detail
function SafetyAlertPage() {
  const { alertId } = Route.useParams()
  const { user } = useMockUser()
  const { data: alert, isLoading, isError } = useSafetyAlert(alertId)
  const signOff = useSignOffSafetyAlert(alertId)

  if (isLoading) return <p className="py-16 text-center text-sm text-muted-foreground">Loading safety alert...</p>
  if (isError || !alert) return <ComingSoon title="Safety alert not found" message="This alert may have been withdrawn or the link is wrong." />

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <Link to="/safety-alerts" className="flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-zinc-900">
        <ArrowLeft className="size-4" />
        All safety alerts
      </Link>

      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold tracking-wide text-red-700 uppercase">{alertLabel(alert.number)}</span>
          <StatusBadge status={alert.status} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">{alert.title}</h2>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex flex-col gap-4">
          <Section title="What we need to do" icon={ListChecks} className="border-brand-100">
            <BulletList items={alert.actions} marker="decimal" />
          </Section>
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="What happened" icon={FileText}>
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-zinc-700">
                {alert.whatHappened.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Section>
            <Section title="Key learnings" icon={Lightbulb}>
              <BulletList items={alert.keyLearnings} />
            </Section>
          </div>
          {alert.pdf && <PdfViewer path={alert.pdf} title={`${alertLabel(alert.number)} - ${alert.title}`} />}
        </div>

        {/* - Side panel sits first on phones so the sign-off is easy to find */}
        <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-0 lg:order-none">
          <SignOffCard alert={alert} onSignOff={() => signOff.mutate(user.name)} pending={signOff.isPending} />
          <Section title="Details">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <Fact label="Issued">{format(alert.issuedAt, 'EEE dd/MM/yyyy')}</Fact>
              <Fact label="Issued by">
                {alert.issuedBy.name}
                <span className="block text-xs font-normal text-muted-foreground">{alert.issuedBy.role}</span>
              </Fact>
              <Fact label="Applies to">{alert.appliesTo}</Fact>
              <Fact label="Related incident">
                {alert.incident ? (
                  <Link to="/incidents/$incidentId" params={{ incidentId: alert.incident.id }} className="text-brand-700 hover:underline">
                    {alert.incident.number}
                    <span className="block text-xs font-normal text-muted-foreground">{alert.incident.title}</span>
                  </Link>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </Fact>
            </dl>
          </Section>
        </aside>
      </div>
    </div>
  )
}
