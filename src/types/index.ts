export type Role = 'PM' | 'Supervisor' | 'Scaffolder' | 'WHS'

export interface User {
  id: string
  name: string
  firstName: string
  initials: string
  role: Role
  project: string
  location: string
}

export interface Project {
  id: string
  name: string // e.g. "Project A"
  code: string // e.g. "FW-001"
  number: string // project number used in record numbers, e.g. "771" in "HO-771-0071"
  location: string
}

export type IncidentSeverity = 'low' | 'medium' | 'high'

export interface DayData {
  date: string // ISO date YYYY-MM-DD
  hasDiary: boolean
  employeeCount?: number
  lostHours?: number
  incident?: {
    severity: IncidentSeverity
    description: string
  }
  itpCount?: number
}

export interface Notification {
  id: string
  type: 'whs-alert' | 'missing-diary' | 'info'
  severity?: 'high' | 'medium' | 'low'
  title: string
  body: string
  project: string
  createdAt: Date
  read: boolean
  incidentId?: string // - WHS alerts link to the incident detail page
}

export type ModuleColor = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'amber'

export interface Module {
  id: string
  name: string
  description: string
  color: ModuleColor
  icon: string // lucide icon name - must be registered in lib/icons.ts
  href: string
  external?: boolean
  badge?: { label: string; variant: 'default' | 'destructive' | 'green' | 'blue' }
  requiredRoles?: User['role'][] // undefined = all roles
}

export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: { label: string; tone: 'brand' | 'red' }
  requiredRoles?: User['role'][]
}

export interface ItpRecord {
  id: string
  projectId: string
  recordNumber: string // e.g. "BKH-1148"
  recordName: string
  itpType: string // e.g. "IC-005 Formwork Pre-Pour Inspection Test Plan"
  status: 'Signed' | 'Active'
}

// - Site Diary register records

export type RecordStatus = 'Signed' | 'Active'

export interface SiteDiaryEntry {
  id: string
  projectId: string
  date: string // ISO date YYYY-MM-DD
  shift: 'Morning' | 'Afternoon'
  notes: string
}

export interface Handover {
  id: string
  projectId: string
  number: string // e.g. "HO-771-0071"
  workType: 'Erect' | 'Dismantle'
  status: RecordStatus
  description: string
}

export interface SiteInspection {
  id: string
  projectId: string
  number: string // e.g. "SI-771-0007"
  status: RecordStatus
  description: string
}

export interface Swms {
  id: string
  projectId: string
  number: string // e.g. "SWMS-771-0012"
  title: string
  status: RecordStatus
  revision: number
}

export interface DayLabourDocket {
  id: string
  projectId: string
  number: string // e.g. "DLD-771-0001"
  status: 'Approved' | 'Signed'
  notes: string
}

export interface SiteDiaryRecords {
  diaries: SiteDiaryEntry
  handovers: Handover
  inspections: SiteInspection
  swms: Swms
  dockets: DayLabourDocket
}

export type SiteDiaryTab = keyof SiteDiaryRecords

// - Safety: incidents (per project) and safety alerts (company-wide, raised by the Safety department)
// - An incident may lead to a safety alert. Only safety alerts are signed off.

export interface Attachment {
  name: string
  size: string // e.g. "1 MB"
}

export interface Person {
  name: string
  role: string
}

export interface Incident {
  id: string
  projectId: string
  number: string // e.g. "INC-771-0012"
  title: string
  occurredAt: Date
  severity: IncidentSeverity
  location: string
  reportedBy: Person
  notifiedSafeWork: boolean
  summary: string[] // - what happened, one paragraph per entry
  actionsTaken: string[]
  photos: string[] // - file names inside public/incidents/
  attachments: Attachment[]
  safetyAlertId?: string
}

export interface SafetyAlert {
  id: string
  number: number // e.g. 129, shown as "WHS Alert #129"
  title: string
  issuedAt: Date
  issuedBy: Person
  appliesTo: string // e.g. "All NSW projects"
  status: RecordStatus
  signedBy?: string
  signedAt?: Date
  incidentId?: string
  pdf?: string // - path inside public/, e.g. "Safety Alert.pdf"
  whatHappened: string[]
  keyLearnings: string[]
  actions: string[] // - "What we need to do"
}

// - Alerts as returned by the API, with a short summary of the incident they came from
export interface SafetyAlertView extends SafetyAlert {
  incident?: Pick<Incident, 'id' | 'number' | 'title'>
}

// - Incidents as returned by the API, with a short summary of their linked alert
export interface IncidentView extends Incident {
  safetyAlert?: Pick<SafetyAlert, 'id' | 'number' | 'title' | 'status'>
}

// - Detail payloads shown in the calendar day dialog

export type DayDetailKind = 'diary' | 'lost' | 'incident' | 'employees' | 'itp'

export interface ItpInspection {
  id: string
  title: string
  inspector: string
  status: 'Passed' | 'Hold point' | 'Open'
}

export interface CrewMember {
  id: string
  name: string
  trade: string
  hours: number
}

export interface DayDetail {
  date: string
  diary?: {
    author: string
    submittedAt: Date
    weather: string
    activities: string[]
    notes: string
  }
  lostHours?: {
    total: number
    entries: { reason: string; hours: number; crew: number }[]
  }
  incident?: {
    severity: IncidentSeverity
    description: string
    reportedBy: string
    location: string
    actions: string[]
  }
  crew: CrewMember[]
  itps: ItpInspection[]
}
