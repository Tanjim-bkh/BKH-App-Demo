import { itpRecords } from '@/data/itps'
import { incidents as seedIncidents, safetyAlerts as seedAlerts } from '@/data/safety'
import { siteDiaryRegisters } from '@/data/siteDiary'
import { buildDayDetail, createNotifications, october2026 } from '@/data/mock'
import type {
  DayData,
  DayDetail,
  Incident,
  IncidentView,
  ItpRecord,
  Notification,
  SafetyAlert,
  SafetyAlertView,
  SiteDiaryRecords,
  SiteDiaryTab,
} from '@/types'

// - Mock resolvers that simulate a REST API with a 300ms delay
// - Swap these for real fetch calls once the backend is available

const DELAY_MS = 300

function resolveLater<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), DELAY_MS))
}

// - In-memory "server" state so mutations survive refetches
let notifications = createNotifications()
const incidents = seedIncidents
let safetyAlerts = seedAlerts


// - Each incident includes a summary of its linked safety alert, if one was issued
function withAlert(incident: Incident): IncidentView {
  const alert = safetyAlerts.find((a) => a.id === incident.safetyAlertId)
  return { ...incident, safetyAlert: alert && { id: alert.id, number: alert.number, title: alert.title, status: alert.status } }
}

function withIncident(alert: SafetyAlert): SafetyAlertView {
  const incident = incidents.find((i) => i.id === alert.incidentId)
  return { ...alert, incident: incident && { id: incident.id, number: incident.number, title: incident.title } }
}

function findOr404<T>(item: T | undefined, what: string): Promise<T> {
  return item ? resolveLater(item) : Promise.reject(new Error(`${what} not found`))
}

export const api = {
  // - month is "yyyy-MM"
  getMonthData(month: string): Promise<DayData[]> {
    return resolveLater(october2026.filter((d) => d.date.startsWith(month)))
  },

  getDayDetail(date: string): Promise<DayDetail> {
    return resolveLater(buildDayDetail(date))
  },

  getProjectItps(projectId: string): Promise<ItpRecord[]> {
    return resolveLater(itpRecords.filter((r) => r.projectId === projectId))
  },

  getSiteDiaryRecords<K extends SiteDiaryTab>(tab: K, projectId: string): Promise<SiteDiaryRecords[K][]> {
    return resolveLater(siteDiaryRegisters[projectId]?.[tab] ?? [])
  },

  getIncidents(projectId: string): Promise<IncidentView[]> {
    const rows = incidents
      .filter((i) => i.projectId === projectId)
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .map(withAlert)
    return resolveLater(rows)
  },

  getIncident(id: string): Promise<IncidentView> {
    const incident = incidents.find((i) => i.id === id)
    return findOr404(incident && withAlert(incident), 'Incident')
  },

  getSafetyAlerts(): Promise<SafetyAlertView[]> {
    return resolveLater([...safetyAlerts].sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime()).map(withIncident))
  },

  getSafetyAlert(id: string): Promise<SafetyAlertView> {
    const alert = safetyAlerts.find((a) => a.id === id)
    return findOr404(alert && withIncident(alert), 'Safety alert')
  },

  // - Toolbox talk done - marks the safety alert Signed
  signOffSafetyAlert(id: string, signedBy: string): Promise<void> {
    safetyAlerts = safetyAlerts.map((a) => (a.id === id ? { ...a, status: 'Signed', signedBy, signedAt: new Date() } : a))
    return resolveLater(undefined)
  },

  getNotifications(): Promise<Notification[]> {
    return resolveLater(notifications)
  },

  markNotificationRead(id: string): Promise<void> {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    return resolveLater(undefined)
  },

  markAllNotificationsRead(): Promise<void> {
    notifications = notifications.map((n) => ({ ...n, read: true }))
    return resolveLater(undefined)
  },
}
