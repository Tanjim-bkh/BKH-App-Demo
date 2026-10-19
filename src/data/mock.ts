import { subDays, subHours, subMinutes } from 'date-fns'
import type {
  CrewMember,
  ItpInspection,
  DayData,
  DayDetail,
  Module,
  NavItem,
  Notification,
  Project,
  User,
} from '@/types'

export const mockUser: User = {
  id: 'u-001',
  name: 'John Smith',
  firstName: 'John',
  initials: 'JS',
  role: 'PM',
  project: 'Project A',
  location: 'Parramatta, NSW',
}

export const projects: Project[] = [
  { id: 'p-a', name: 'Project A', code: 'FW-001', number: '771', location: 'Parramatta, NSW' },
  { id: 'p-b', name: 'Project B', code: 'FW-002', number: '772', location: 'Macquarie Park, NSW' },
  { id: 'p-c', name: 'Project C', code: 'SC-003', number: '773', location: 'Penrith, NSW' },
]

// - Role groups used by requiredRoles below
// - Site diaries and ITPs are site records: WHS staff don't see them
const siteRoles: User['role'][] = ['PM', 'Supervisor', 'Scaffolder']
const siteManagementRoles: User['role'][] = ['PM', 'Supervisor']
const internalRoles: User['role'][] = ['PM', 'Supervisor', 'WHS']

// - Sidebar navigation. Settings is rendered separately at the bottom.
export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'LayoutDashboard', href: '/', requiredRoles: ['PM', 'Supervisor', 'WHS'] },
  { id: 'calendar', label: 'Site Diaries', icon: 'CalendarDays', href: '/site-diaries', badge: { label: '3', tone: 'brand' }, requiredRoles: siteRoles },
  { id: 'itps', label: 'ITPs', icon: 'ClipboardCheck', href: '/itps', requiredRoles: siteManagementRoles },
  { id: 'employees', label: 'Site Crews', icon: 'Users', href: '/employees', requiredRoles: ['PM', 'Supervisor', 'WHS'] },
  { id: 'incidents', label: 'Incidents', icon: 'AlertTriangle', href: '/incidents', badge: { label: '1', tone: 'red' }, requiredRoles: ['PM', 'Supervisor', 'WHS'] },
  // - Safety alerts go to every crew, so no role restriction
  { id: 'safety-alerts', label: 'Safety Alerts', icon: 'ShieldAlert', href: '/safety-alerts', badge: { label: '2', tone: 'red' } },
  // - Company-wide notices, so visible to every role
  { id: 'bulletin', label: 'Bulletin', icon: 'Megaphone', href: '/bulletin' },
  { id: 'reports', label: 'Reports', icon: 'BarChart2', href: '/reports', requiredRoles: ['PM', 'Supervisor', 'WHS'] },
]

export const modules: Module[] = [
  { id: 'site-diary', name: 'Site Diary', description: 'Daily diaries, weather and crew on site', color: 'blue', icon: 'CalendarDays', href: '/site-diaries', badge: { label: '3 pending', variant: 'blue' }, requiredRoles: siteRoles },
  { id: 'itps', name: 'ITPs', description: 'Inspection and test plans', color: 'purple', icon: 'ClipboardCheck', href: '/itps', requiredRoles: siteManagementRoles },
  { id: 'employees', name: 'Site Crews', description: 'Roster, inductions and tickets', color: 'green', icon: 'Users', href: '/employees', badge: { label: '13 on-site', variant: 'green' }, requiredRoles: internalRoles },
  { id: 'incidents', name: 'Incidents & WHS', description: 'Report and close out safety events', color: 'red', icon: 'AlertTriangle', href: '/incidents', badge: { label: '1 open', variant: 'destructive' }, requiredRoles: internalRoles },
  { id: 'lost-hours', name: 'Lost Hours', description: 'Weather, delays and stand-downs', color: 'orange', icon: 'Clock', href: '/lost-hours', requiredRoles: internalRoles },
  { id: 'reports', name: 'Reports', description: 'Progress and productivity reports', color: 'amber', icon: 'BarChart2', href: '/reports', requiredRoles: internalRoles },
]

// - Placeholder hrefs until the real tenant URLs are confirmed
export const externalLinks: Module[] = [
  { id: 'sp-a', name: 'SharePoint - Project A', description: 'Drawings, RFIs and project documents', color: 'blue', icon: 'Share2', href: '#', external: true },
  { id: 'sp-b', name: 'SharePoint - Project B', description: 'Drawings, RFIs and project documents', color: 'blue', icon: 'Share2', href: '#', external: true },
  { id: 'aconex', name: 'Aconex', description: 'Document control and correspondence', color: 'purple', icon: 'Layers', href: '#', external: true },
  { id: 'jobpac', name: 'Jobpac', description: 'Job costing, payroll and timesheets', color: 'green', icon: 'Briefcase', href: '#', external: true },
]

export function createNotifications(now = new Date()): Notification[] {
  return [
    {
      id: 'n-1',
      type: 'whs-alert',
      severity: 'high',
      title: 'Incident - FW-001 Site',
      incidentId: 'p-a-2026-10-15',
      body: 'Unsecured formwork panel fell from Level 3 deck during strip-out. No injuries. A toolbox talk on exclusion zones is required before work resumes on Level 3.',
      project: 'FW-001',
      createdAt: subHours(now, 2),
      read: false,
    },
    {
      id: 'n-2',
      type: 'missing-diary',
      title: 'Missing site diary',
      body: 'Site diary not submitted for FW-002 - Oct 16',
      project: 'FW-002',
      createdAt: subHours(now, 5),
      read: false,
    },
    {
      id: 'n-3',
      type: 'whs-alert',
      severity: 'medium',
      title: 'Medium Incident - FW-001 Site',
      body: 'Minor laceration to hand while handling reo bar. First aid applied on site. Supervisor to review glove requirements.',
      project: 'FW-001',
      createdAt: subDays(now, 1),
      read: false,
    },
    {
      id: 'n-4',
      type: 'info',
      title: 'Concrete pour confirmed',
      body: 'Level 4 slab pour booked for Thursday 6:00am. Pump and 42m3 confirmed with supplier.',
      project: 'FW-001',
      createdAt: subMinutes(now, 40),
      read: true,
    },
  ]
}

// - October 2026 site diary data for Project A (FW-001)
// - Diaries run Mon-Fri. Saturday work only on Oct 3 and Oct 17. No Sunday work.
const DIARY_DAYS = [1, 2, 3, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30]

const EMPLOYEE_COUNTS: Record<number, number> = {
  1: 12, 2: 11, 3: 10, 5: 12, 6: 13, 7: 12, 8: 12, 9: 11, 12: 13, 13: 12, 14: 13, 15: 14,
  16: 12, 17: 10, 19: 13, 20: 12, 21: 13, 22: 12, 23: 13, 26: 12, 27: 13, 28: 12, 29: 11, 30: 12,
}

const LOST_HOURS: Record<number, number> = { 3: 4.5, 8: 2, 15: 6, 17: 3, 23: 1.5 }

const INCIDENTS: Record<number, NonNullable<DayData['incident']>> = {
  6: { severity: 'medium', description: 'Minor laceration to hand while handling reo bar. First aid applied.' },
  15: { severity: 'high', description: 'Unsecured formwork panel fell from Level 3 deck during strip-out. Area isolated, no injuries.' },
}

// - Inspection and test plan sign-offs, mostly around slab pours
const ITP_COUNTS: Record<number, number> = { 2: 1, 7: 2, 9: 1, 14: 3, 16: 1, 21: 2, 28: 3, 30: 1 }

const iso = (day: number) => `2026-10-${String(day).padStart(2, '0')}`

export const october2026: DayData[] = DIARY_DAYS.map((day) => ({
  date: iso(day),
  hasDiary: true,
  employeeCount: EMPLOYEE_COUNTS[day],
  lostHours: LOST_HOURS[day],
  incident: INCIDENTS[day],
  itpCount: ITP_COUNTS[day],
}))

const CREW: Omit<CrewMember, 'hours'>[] = [
  { id: 'c-01', name: 'Liam Nguyen', trade: 'Leading Hand' },
  { id: 'c-02', name: 'Olivia Brown', trade: 'Formworker' },
  { id: 'c-03', name: 'Noah Wilson', trade: 'Formworker' },
  { id: 'c-04', name: 'Ava Taylor', trade: 'Steel Fixer' },
  { id: 'c-05', name: 'Jack Thompson', trade: 'Formworker' },
  { id: 'c-06', name: 'Mia Martin', trade: 'Labourer' },
  { id: 'c-07', name: 'William White', trade: 'Crane Operator' },
  { id: 'c-08', name: 'Chloe Harris', trade: 'Dogman' },
  { id: 'c-09', name: 'Ethan Clarke', trade: 'Scaffolder' },
  { id: 'c-10', name: 'Grace Walker', trade: 'Formworker' },
  { id: 'c-11', name: 'Lucas Hall', trade: 'Carpenter' },
  { id: 'c-12', name: 'Zoe Young', trade: 'Labourer' },
  { id: 'c-13', name: 'Henry King', trade: 'Steel Fixer' },
  { id: 'c-14', name: 'Isla Wright', trade: 'Formworker' },
]

const WEATHER = ['Fine, 22°C', 'Partly cloudy, 19°C', 'Overcast, light showers PM', 'Fine and windy, 24°C', 'Heavy rain AM, clearing']

const ACTIVITIES = [
  'Level 3 deck formwork strip-out - grid lines C to F',
  'Level 4 column forms erected and plumbed',
  'Reo delivery received and craned to Level 4',
  'Edge protection inspected and tagged',
  'Pre-pour inspection with engineer - Level 4 slab',
]

const ITP_TEMPLATES: Omit<ItpInspection, 'id'>[] = [
  { title: 'Formwork - pre-pour inspection', inspector: 'Liam Nguyen', status: 'Passed' },
  { title: 'Reinforcement - cover and lap check', inspector: 'Engineer - R. Patel', status: 'Hold point' },
  { title: 'Edge protection - installation', inspector: 'Liam Nguyen', status: 'Passed' },
  { title: 'Post-pour - stripping approval', inspector: 'Engineer - R. Patel', status: 'Open' },
]

const LOST_REASONS = ['Wet weather stand-down', 'Crane breakdown', 'Incident investigation', 'Late concrete delivery']

export function buildDayDetail(date: string): DayDetail {
  const day = october2026.find((d) => d.date === date)
  const dayNum = Number(date.slice(-2))
  const crewCount = day?.employeeCount ?? 0
  const crew = CREW.slice(0, crewCount).map((c, i) => ({ ...c, hours: i % 5 === 4 ? 7.5 : 9.5 }))

  return {
    date,
    crew,
    itps: ITP_TEMPLATES.slice(0, day?.itpCount ?? 0).map((t, i) => ({ ...t, id: `${date}-itp-${i}` })),
    diary: day?.hasDiary
      ? {
          author: 'Liam Nguyen',
          submittedAt: new Date(`${date}T16:${String(10 + (dayNum % 40)).padStart(2, '0')}:00`),
          weather: WEATHER[dayNum % WEATHER.length],
          activities: ACTIVITIES.slice(dayNum % 2, 3 + (dayNum % 3)),
          notes: 'All plant pre-start checks completed. Site access via Gate 2 only.',
        }
      : undefined,
    lostHours: day?.lostHours
      ? {
          total: day.lostHours,
          entries: [{ reason: LOST_REASONS[dayNum % LOST_REASONS.length], hours: day.lostHours, crew: crewCount }],
        }
      : undefined,
    incident: day?.incident
      ? {
          ...day.incident,
          reportedBy: 'Liam Nguyen',
          location: 'Level 3 deck, grid D4',
          actions:
            day.incident.severity === 'high'
              ? ['Area isolated and exclusion zone set', 'SafeWork NSW notified', 'Toolbox talk required before restart']
              : ['First aid administered', 'Glove requirements reviewed with crew'],
        }
      : undefined,
  }
}
