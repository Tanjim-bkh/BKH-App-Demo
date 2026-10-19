import { Link, createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft, ArrowRight, Camera, ClipboardList, FileText, ShieldAlert, TriangleAlert } from 'lucide-react'
import { ComingSoon } from '@/components/ComingSoon'
import { PhotoGallery } from '@/components/safety/PhotoGallery'
import { alertLabel } from '@/components/safety/SafetyAlertLink'
import { BulletList, Fact, Section } from '@/components/safety/Section'
import { SeverityBadge } from '@/components/safety/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { projects } from '@/data/mock'
import { useIncident } from '@/hooks/queries'
import type { IncidentView } from '@/types'

export const Route = createFileRoute('/incidents/$incidentId')({
  staticData: { title: 'Incident' },
  component: IncidentPage,
})

function IncidentPage() {
  const { incidentId } = Route.useParams()
  const { data: incident, isLoading, isError } = useIncident(incidentId)

  if (isLoading) return <p className="py-16 text-center text-sm text-muted-foreground">Loading incident...</p>
  if (isError || !incident) return <ComingSoon title="Incident not found" message="This incident may have been removed or the link is wrong." />

  const project = projects.find((p) => p.id === incident.projectId)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <Link to="/incidents" className="flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-zinc-900">
        <ArrowLeft className="size-4" />
        All incidents
      </Link>

      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-medium text-brand-700">{incident.number}</span>
          <SeverityBadge severity={incident.severity} />
          {incident.notifiedSafeWork && (
            <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
              <TriangleAlert className="size-3" />
              Reported to SafeWork NSW
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">{incident.title}</h2>
      </header>

      <Section title="Details">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Fact label="Date & time">{format(incident.occurredAt, 'EEE dd/MM/yyyy h:mm a')}</Fact>
          <Fact label="Location">{incident.location}</Fact>
          <Fact label="Project">{project ? `${project.name} - ${project.code}` : '-'}</Fact>
          <Fact label="Reported by">
            {incident.reportedBy.name}
            <span className="block text-xs font-normal text-muted-foreground">{incident.reportedBy.role}</span>
          </Fact>
        </dl>
      </Section>

      <LinkedAlert incident={incident} />

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="What happened" icon={FileText}>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-zinc-700">
            {incident.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>
        <Section title="Actions taken" icon={ClipboardList}>
          <BulletList items={incident.actionsTaken} />
        </Section>
      </div>

      {incident.photos.length > 0 && (
        <Section title={`Photos (${incident.photos.length})`} icon={Camera}>
          <PhotoGallery photos={incident.photos} title={incident.title} />
        </Section>
      )}

      {incident.attachments.length > 0 && (
        <Section title="Attachments" icon={FileText}>
          <ul className="flex flex-wrap gap-2">
            {incident.attachments.map((a) => (
              <li key={a.name} className="flex items-center gap-2 rounded-lg border bg-zinc-50 px-3 py-2 text-sm">
                <FileText className="size-4 shrink-0 text-red-600" />
                <span className="font-medium">{a.name}</span>
                <span className="text-xs text-muted-foreground">{a.size}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

// - The safety alert raised off the back of this incident, if any
function LinkedAlert({ incident }: { incident: IncidentView }) {
  const alert = incident.safetyAlert
  if (!alert) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed bg-white p-4 text-sm text-muted-foreground">
        <ShieldAlert className="size-5 shrink-0" />
        No safety alert has been issued for this incident.
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4 sm:flex-row sm:items-center">
      <ShieldAlert className="size-6 shrink-0 text-red-600" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900">
          {alertLabel(alert.number)}
          <StatusBadge status={alert.status} />
        </p>
        <p className="text-sm text-zinc-700">{alert.title}</p>
      </div>
      <Button asChild variant="outline" className="bg-white">
        <Link to="/safety-alerts/$alertId" params={{ alertId: alert.id }}>
          View safety alert
          <ArrowRight />
        </Link>
      </Button>
    </div>
  )
}
