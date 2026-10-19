import type { ModuleColor, Role } from '@/types'

export interface ReportDefinition {
  id: string
  name: string
  description: string
  icon: 'Clock' | 'HeartPulse' | 'Timer' | 'NotebookPen' | 'GraduationCap' | 'ShieldCheck'
  color: ModuleColor
  sources: string[] // - modules the report draws its data from
  available: boolean // - false until the report has been built
  requiredRoles?: Role[] // - undefined = everyone who can open Reports
}

// - WHS staff only see safety reports
const siteManagementRoles: Role[] = ['PM', 'Supervisor']

// - Reports planned for the portal. Flip available to true as each one is built.
export const reports: ReportDefinition[] = [
  {
    id: 'lost-hours',
    name: 'Lost Hour Log Report',
    description: 'Hours lost per day with the reason - weather, delays and stand-downs - totalled by project and period.',
    icon: 'Clock',
    color: 'orange',
    sources: ['Site Diaries', 'Lost Hours'],
    available: false,
    requiredRoles: siteManagementRoles,
  },
  {
    id: 'injuries-incidents',
    name: 'Injuries & Incident Report',
    description: 'Every injury and incident with its severity, SafeWork notifications and any safety alert raised.',
    icon: 'HeartPulse',
    color: 'red',
    sources: ['Incidents', 'Safety Alerts'],
    available: false,
  },
  {
    id: 'tms',
    name: 'TMS Report',
    description: 'TMS records for a project over a chosen date range.',
    icon: 'Timer',
    color: 'blue',
    sources: ['TMS'],
    available: false,
    requiredRoles: siteManagementRoles,
  },
  {
    id: 'site-diary-events',
    name: 'Site Diary Event Report',
    description: 'Events recorded in site diaries - handovers, inspections, day labour dockets and notes - by date.',
    icon: 'NotebookPen',
    color: 'purple',
    sources: ['Site Diaries'],
    available: false,
    requiredRoles: siteManagementRoles,
  },
  {
    id: 'qualifications',
    name: 'Qualification/Skill Report',
    description: 'Licences and tickets held across site crews, highlighting anything expired or expiring soon.',
    icon: 'GraduationCap',
    color: 'green',
    sources: ['Site Crews'],
    available: false,
    requiredRoles: siteManagementRoles,
  },
  {
    id: 'safety',
    name: 'Safety Report',
    description: 'Safety alerts issued, toolbox sign-off status and incident trends across projects.',
    icon: 'ShieldCheck',
    color: 'amber',
    sources: ['Safety Alerts', 'Incidents'],
    available: false,
  },
]
