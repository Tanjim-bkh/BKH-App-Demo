import { addDays, format } from 'date-fns'

export type EmployeeStatus = 'active' | 'on-leave' | 'inactive'

export interface Employee {
  id: string
  name: string
  firstName: string
  initials: string
  role: string
  project: string
  crew: string
  status: EmployeeStatus
  avatarColor: string
  stats: {
    hoursThisWeek: number
    overtimeThisWeek: number
    overtimeVsAvgPct: number
    personalLeaveDays: number
    saturdaysWorked: number
  }
  alerts: {
    uncertifiedLeave: { count: number; period: string }
    monFriLeave: { taken: number; total: number }
    satAfterShortWeek: { taken: number; total: number }
    licenceExpiry: { label: string; daysLeft: number } | null
  }
  weeklyHours: { weekEnding: string; ordinary: number; overtime: number }[]
  personalLeave: { month: string; singleDay: number; multiDay: number }[]
  weekendWork: { period: string; saturdayHours: number; sundayHours: number }[]
  cumulativeHours: { week: string; hours: number }[]
  timeBreakdown: { category: string; hours: number; fill: string }[]
  licences: Licence[]
  skills: { subject: string; score: number }[]
  reviews: Review[]
}

// - Feedback left on a worker by site supervisors
export interface Review {
  id: string
  reviewer: { name: string; role: string }
  date: string // ISO date
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
}

// - Licences and tickets sighted at induction. photo is a file name inside public/licences/<employee id>/
export interface Licence {
  id: string
  name: string
  number: string
  expiresOn: string | null // ISO date, null for tickets that don't expire
  photo: string
}

// - Shared axes for all employees: 14 week-ending Fridays, 10 Jul - 9 Oct 2026
const WEEK_ENDINGS = [
  '10 Jul', '17 Jul', '24 Jul', '31 Jul', '7 Aug', '14 Aug', '21 Aug',
  '28 Aug', '4 Sep', '11 Sep', '18 Sep', '25 Sep', '2 Oct', '9 Oct',
]
const LEAVE_MONTHS = ['Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026']
const WEEKEND_PERIODS = [
  'Jul W1', 'Jul W2', 'Jul W3', 'Jul W4', 'Aug W1', 'Aug W2', 'Aug W3',
  'Aug W4', 'Sep W1', 'Sep W2', 'Sep W3', 'Sep W4', 'Oct W1', 'Oct W2',
]

// - YTD runs from the first Friday of 2026 (2 Jan) to 9 Oct = 41 weeks
const YTD_WEEKS = 41
const FIRST_WEEK_ENDING = new Date(2026, 0, 2)
const HOURS_PER_LEAVE_DAY = 7.6

type Pair = [number, number]

// - Deterministic PRNG so mock charts look the same on every reload
function seededRandom(seed: number) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const round1 = (n: number) => Math.round(n * 10) / 10

interface EmployeeSeed extends Omit<
  Employee,
  'weeklyHours' | 'personalLeave' | 'weekendWork' | 'cumulativeHours' | 'timeBreakdown' | 'licences' | 'skills' | 'reviews'
> {
  weekly: Pair[]
  leave: Pair[]
  weekend: Pair[]
  skillScores: number[]
  // - Typical ordinary hours per week before the charted window (for the YTD curve)
  earlierOrdinary: number
  seed: number
}

const SKILL_AXES = ['Safety', 'Equipment', 'Planning', 'Teamwork', 'Reporting']
const PRIMARY_SKILL: Record<string, string> = {
  Electrician: 'Wiring',
  'Formwork Carpenter': 'Formwork',
  'Site Supervisor': 'Leadership',
  Scaffolder: 'Scaffolding',
  Plumber: 'Pipework',
  Concreter: 'Finishing',
  'Crane Operator': 'Lifting',
  'Steel Fixer': 'Rebar',
}

const SARAH = { name: 'Sarah Lee', role: 'Site Supervisor' }
const LIAM = { name: 'Liam Nguyen', role: 'Site Supervisor' }

// - Supervisor reviews per employee, newest first. Workers without an entry have no reviews yet.
const REVIEWS: Record<string, Omit<Review, 'id'>[]> = {
  'emp-001': [
    { reviewer: SARAH, date: '2026-10-09', rating: 4, comment: 'Reliable on the Level 4 electrical rough-in and keeps his area tidy. Has been doing a lot of overtime lately - worth keeping an eye on fatigue.' },
    { reviewer: LIAM, date: '2026-08-21', rating: 3, comment: 'Good quality work, but missed two Monday starts without notice. Discussed with him after the toolbox talk.' },
  ],
  'emp-002': [
    { reviewer: SARAH, date: '2026-10-02', rating: 5, comment: 'Excellent setter-out on the Level 3 deck. Mentors the apprentices and is always first at pre-start.' },
  ],
  'emp-004': [
    { reviewer: LIAM, date: '2026-09-30', rating: 4, comment: 'Safe and efficient on the perimeter scaffold. Scaffolding licence renewal is due soon - reminded him to book it.' },
  ],
  'emp-006': [
    { reviewer: SARAH, date: '2026-09-18', rating: 4, comment: 'Strong finisher on the Level 3 slab pour. Needs to wear eye protection consistently when grinding.' },
    { reviewer: LIAM, date: '2026-07-30', rating: 3, comment: 'Solid work but left tools on the deck edge twice in one week. Spoken to about housekeeping.' },
  ],
  'emp-007': [
    { reviewer: SARAH, date: '2026-10-14', rating: 5, comment: 'Calm and precise on the crane. Communicates clearly with the dogmen and stops lifts early when wind picks up.' },
  ],
  'emp-008': [
    { reviewer: LIAM, date: '2026-08-12', rating: 2, comment: 'White Card had expired - stood down until it was renewed. Quality of work itself was fine.' },
  ],
}

// - Licence expiries are counted from this date, matching the licence alert tiles
export const LICENCES_AS_AT = new Date(2026, 9, 19)

// - Everyone holds these; trade tickets are added per role
const BASE_LICENCES = ['Driver Licence (C)', 'White Card']
const ROLE_LICENCES: Record<string, string[]> = {
  Electrician: ['Electrical Licence', 'EWP Licence (WP)'],
  'Formwork Carpenter': ['Working at Heights', 'Forklift Licence (LF)'],
  'Site Supervisor': ['First Aid Certificate', 'Forklift Licence (LF)'],
  Scaffolder: ['Scaffolding Licence', 'HRWL - Dogging (DG)'],
  Plumber: ['Plumbing Licence'],
  Concreter: ['EWP Licence (WP)'],
  'Crane Operator': ['High Risk Work Licence', 'HRWL - Dogging (DG)'],
  'Steel Fixer': ['Forklift Licence (LF)'],
}

// - White Cards don't expire; other licences renew on a multi-year cycle
const NO_EXPIRY = new Set(['White Card'])

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function buildLicences(role: string, expiring: Employee['alerts']['licenceExpiry'], rand: () => number): Licence[] {
  const names = [...BASE_LICENCES, ...(ROLE_LICENCES[role] ?? [])]
  // - Make sure the licence named in the expiry alert is in the list
  if (expiring && !names.includes(expiring.label)) names.push(expiring.label)

  return names.map((name) => {
    const daysLeft = expiring?.label === name ? expiring.daysLeft : 200 + Math.floor(rand() * 1200)
    return {
      id: slug(name),
      name,
      number: String(Math.floor(10_000_000 + rand() * 89_999_999)),
      expiresOn: NO_EXPIRY.has(name) && expiring?.label !== name ? null : format(addDays(LICENCES_AS_AT, daysLeft), 'yyyy-MM-dd'),
      photo: `${slug(name)}.jpg`,
    }
  })
}

function buildEmployee(s: EmployeeSeed): Employee {
  const { weekly, leave, weekend, skillScores, earlierOrdinary, seed, ...base } = s
  const rand = seededRandom(seed)

  const weeklyHours = weekly.map(([ordinary, overtime], i) => ({ weekEnding: WEEK_ENDINGS[i], ordinary, overtime }))
  const personalLeave = leave.map(([singleDay, multiDay], i) => ({ month: LEAVE_MONTHS[i], singleDay, multiDay }))
  const weekendWork = weekend.map(([saturdayHours, sundayHours], i) => ({
    period: WEEKEND_PERIODS[i],
    saturdayHours,
    sundayHours,
  }))

  // - Earlier weeks are synthesised around earlierOrdinary, the charted window uses real weekly data
  const earlierWeeks = YTD_WEEKS - weekly.length
  let running = 0
  const cumulativeHours = Array.from({ length: YTD_WEEKS }, (_, i) => {
    const hours = i < earlierWeeks ? earlierOrdinary + (rand() - 0.5) * 6 : weekly[i - earlierWeeks][0]
    running += hours
    return { week: format(addDays(FIRST_WEEK_ENDING, i * 7), 'd MMM'), hours: Math.round(running) }
  })

  const sum = (rows: Pair[], idx: 0 | 1) => round1(rows.reduce((acc, row) => acc + row[idx], 0))
  const leaveDays = leave.reduce((acc, [single, multi]) => acc + single + multi, 0)
  const timeBreakdown = [
    { category: 'Ordinary', hours: sum(weekly, 0), fill: 'var(--chart-1)' },
    { category: 'Overtime', hours: sum(weekly, 1), fill: 'var(--chart-5)' },
    { category: 'Saturday', hours: sum(weekend, 0), fill: 'var(--chart-2)' },
    { category: 'Sunday', hours: sum(weekend, 1), fill: 'var(--chart-3)' },
    { category: 'Leave', hours: round1(leaveDays * HOURS_PER_LEAVE_DAY), fill: 'var(--chart-4)' },
  ]

  const licences = buildLicences(base.role, base.alerts.licenceExpiry, rand)

  const skills = [PRIMARY_SKILL[base.role] ?? 'Trade Skill', ...SKILL_AXES].map((subject, i) => ({
    subject,
    score: skillScores[i],
  }))

  const reviews = (REVIEWS[base.id] ?? []).map((r, i) => ({ ...r, id: `${base.id}-review-${i}` }))

  return { ...base, weeklyHours, personalLeave, weekendWork, cumulativeHours, timeBreakdown, licences, skills, reviews }
}

const seeds: EmployeeSeed[] = [
  // - Matches the "Employee Profile" reference PDF
  {
    id: 'emp-001',
    name: 'Dave Smith',
    firstName: 'Dave',
    initials: 'DS',
    role: 'Electrician',
    project: 'Project Alpha',
    crew: 'Crew A',
    status: 'active',
    avatarColor: 'bg-blue-600',
    stats: { hoursThisWeek: 46.5, overtimeThisWeek: 12.5, overtimeVsAvgPct: 74, personalLeaveDays: 4, saturdaysWorked: 5 },
    alerts: {
      uncertifiedLeave: { count: 3, period: 'in last 60 days' },
      monFriLeave: { taken: 4, total: 6 },
      satAfterShortWeek: { taken: 2, total: 5 },
      licenceExpiry: { label: 'Electrical Licence', daysLeft: 43 },
    },
    weekly: [
      [30, 3.5], [32, 3], [36, 2.5], [35, 3], [31, 3.5], [34, 6], [38, 5.5],
      [32, 5], [33, 4], [38, 5], [35, 5.5], [37, 6.5], [39, 7], [34, 12.5],
    ],
    leave: [[2, 0], [0, 2], [1, 0], [1, 0]],
    weekend: [
      [11.5, 0], [1, 1.2], [0, 0], [0, 0], [4.5, 2], [1.5, 0], [0, 2.8],
      [1, 0.8], [0, 0], [0, 0], [6.5, 1.8], [0, 0], [2, 0.5], [0, 0],
    ],
    skillScores: [88, 72, 80, 64, 76, 52],
    earlierOrdinary: 36,
    seed: 1,
  },
  {
    id: 'emp-002',
    name: 'Mark Johnson',
    firstName: 'Mark',
    initials: 'MJ',
    role: 'Formwork Carpenter',
    project: 'Project Alpha',
    crew: 'Crew B',
    status: 'active',
    avatarColor: 'bg-emerald-600',
    stats: { hoursThisWeek: 42, overtimeThisWeek: 4, overtimeVsAvgPct: 12, personalLeaveDays: 1, saturdaysWorked: 3 },
    alerts: {
      uncertifiedLeave: { count: 0, period: 'in last 60 days' },
      monFriLeave: { taken: 1, total: 1 },
      satAfterShortWeek: { taken: 0, total: 3 },
      licenceExpiry: { label: 'Working at Heights', daysLeft: 120 },
    },
    weekly: [
      [38, 3], [38, 4], [37, 2], [38, 3.5], [38, 4], [36, 3], [38, 2.5],
      [38, 5], [37, 4], [38, 3], [38, 4.5], [38, 3], [36, 3.5], [38, 4],
    ],
    leave: [[0, 0], [1, 0], [0, 0], [0, 0]],
    weekend: [
      [0, 0], [5, 0], [0, 0], [6, 0], [0, 0], [0, 0], [4.5, 0],
      [0, 0], [0, 0], [5, 0], [0, 0], [0, 0], [6, 0], [0, 0],
    ],
    skillScores: [92, 85, 78, 70, 88, 60],
    earlierOrdinary: 37.5,
    seed: 2,
  },
  {
    id: 'emp-003',
    name: 'Sarah Lee',
    firstName: 'Sarah',
    initials: 'SL',
    role: 'Site Supervisor',
    project: 'Project Alpha',
    crew: 'Crew A',
    status: 'active',
    avatarColor: 'bg-violet-600',
    stats: { hoursThisWeek: 50, overtimeThisWeek: 10, overtimeVsAvgPct: 18, personalLeaveDays: 0, saturdaysWorked: 7 },
    alerts: {
      uncertifiedLeave: { count: 0, period: 'in last 60 days' },
      monFriLeave: { taken: 0, total: 0 },
      satAfterShortWeek: { taken: 0, total: 7 },
      licenceExpiry: { label: 'First Aid Certificate', daysLeft: 21 },
    },
    weekly: [
      [40, 8], [40, 9], [40, 7.5], [40, 8], [40, 10], [40, 9], [40, 8.5],
      [40, 8], [40, 9.5], [40, 8], [40, 7], [40, 9], [40, 8.5], [40, 10],
    ],
    leave: [[0, 0], [0, 0], [0, 0], [0, 0]],
    weekend: [
      [4, 0], [4, 2], [0, 0], [5, 0], [4, 0], [0, 0], [4, 3],
      [0, 0], [5, 0], [0, 0], [4, 0], [0, 0], [4, 2], [0, 0],
    ],
    skillScores: [94, 96, 74, 90, 86, 92],
    earlierOrdinary: 40,
    seed: 3,
  },
  {
    id: 'emp-004',
    name: 'Tom Walker',
    firstName: 'Tom',
    initials: 'TW',
    role: 'Scaffolder',
    project: 'Project Beta',
    crew: 'Crew C',
    status: 'active',
    avatarColor: 'bg-amber-600',
    stats: { hoursThisWeek: 44, overtimeThisWeek: 8, overtimeVsAvgPct: 41, personalLeaveDays: 3, saturdaysWorked: 4 },
    alerts: {
      uncertifiedLeave: { count: 2, period: 'in last 60 days' },
      monFriLeave: { taken: 2, total: 3 },
      satAfterShortWeek: { taken: 1, total: 4 },
      licenceExpiry: { label: 'Scaffolding Licence', daysLeft: 12 },
    },
    weekly: [
      [36, 4], [34, 6], [38, 5], [30, 3], [36, 5], [38, 7], [35, 6],
      [33, 4], [37, 6], [38, 5], [30, 4], [36, 6], [38, 7.5], [36, 8],
    ],
    leave: [[1, 0], [0, 0], [2, 0], [0, 0]],
    weekend: [
      [7, 0], [0, 0], [8, 0], [0, 0], [0, 0], [6, 0], [0, 0],
      [0, 0], [9, 3], [0, 0], [0, 0], [7.5, 0], [0, 0], [8, 0],
    ],
    skillScores: [90, 70, 84, 58, 80, 45],
    earlierOrdinary: 35,
    seed: 4,
  },
  {
    id: 'emp-005',
    name: 'Priya Patel',
    firstName: 'Priya',
    initials: 'PP',
    role: 'Plumber',
    project: 'Project Beta',
    crew: 'Crew B',
    status: 'on-leave',
    avatarColor: 'bg-rose-600',
    stats: { hoursThisWeek: 0, overtimeThisWeek: 0, overtimeVsAvgPct: -100, personalLeaveDays: 9, saturdaysWorked: 1 },
    alerts: {
      uncertifiedLeave: { count: 1, period: 'in last 60 days' },
      monFriLeave: { taken: 1, total: 3 },
      satAfterShortWeek: { taken: 0, total: 1 },
      licenceExpiry: { label: 'Plumbing Licence', daysLeft: 210 },
    },
    weekly: [
      [38, 2], [38, 1.5], [37, 2], [38, 3], [30, 0], [38, 2], [38, 2.5],
      [36, 1], [38, 2], [38, 1.5], [22, 0], [0, 0], [0, 0], [0, 0],
    ],
    leave: [[0, 0], [1, 0], [1, 3], [0, 3]],
    weekend: [
      [0, 0], [0, 0], [4, 0], [0, 0], [0, 0], [0, 0], [0, 0],
      [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
    ],
    skillScores: [86, 82, 76, 72, 84, 70],
    earlierOrdinary: 37,
    seed: 5,
  },
  {
    id: 'emp-006',
    name: "Liam O'Connor",
    firstName: 'Liam',
    initials: 'LO',
    role: 'Concreter',
    project: 'Project Alpha',
    crew: 'Crew C',
    status: 'active',
    avatarColor: 'bg-cyan-600',
    stats: { hoursThisWeek: 48, overtimeThisWeek: 10, overtimeVsAvgPct: 33, personalLeaveDays: 2, saturdaysWorked: 6 },
    alerts: {
      uncertifiedLeave: { count: 1, period: 'in last 60 days' },
      monFriLeave: { taken: 2, total: 2 },
      satAfterShortWeek: { taken: 2, total: 6 },
      licenceExpiry: null,
    },
    weekly: [
      [38, 6], [38, 8], [36, 7], [38, 9], [38, 6.5], [32, 5], [38, 8],
      [38, 7.5], [38, 9], [36, 6], [38, 8], [38, 9.5], [38, 7], [38, 10],
    ],
    leave: [[0, 0], [1, 0], [0, 0], [1, 0]],
    weekend: [
      [6, 0], [0, 0], [7, 0], [6, 0], [0, 0], [8, 2], [0, 0],
      [0, 0], [7, 0], [0, 0], [6.5, 0], [0, 0], [7, 1.5], [0, 0],
    ],
    skillScores: [89, 74, 81, 63, 82, 55],
    earlierOrdinary: 37.5,
    seed: 6,
  },
  {
    id: 'emp-007',
    name: 'Jack Nguyen',
    firstName: 'Jack',
    initials: 'JN',
    role: 'Crane Operator',
    project: 'Project Beta',
    crew: 'Crew A',
    status: 'active',
    avatarColor: 'bg-orange-600',
    stats: { hoursThisWeek: 40, overtimeThisWeek: 2, overtimeVsAvgPct: -20, personalLeaveDays: 1, saturdaysWorked: 2 },
    alerts: {
      uncertifiedLeave: { count: 0, period: 'in last 60 days' },
      monFriLeave: { taken: 0, total: 1 },
      satAfterShortWeek: { taken: 0, total: 2 },
      licenceExpiry: { label: 'High Risk Work Licence', daysLeft: 64 },
    },
    weekly: [
      [38, 2], [38, 3], [38, 2], [38, 2.5], [38, 3], [38, 2], [30, 1],
      [38, 2.5], [38, 3], [38, 2], [38, 2.5], [38, 3], [38, 2], [38, 2],
    ],
    leave: [[0, 0], [1, 0], [0, 0], [0, 0]],
    weekend: [
      [0, 0], [0, 0], [0, 0], [5, 0], [0, 0], [0, 0], [0, 0],
      [0, 0], [0, 0], [0, 0], [6, 0], [0, 0], [0, 0], [0, 0],
    ],
    skillScores: [95, 93, 90, 68, 74, 66],
    earlierOrdinary: 38,
    seed: 7,
  },
  {
    id: 'emp-008',
    name: 'Emily Brown',
    firstName: 'Emily',
    initials: 'EB',
    role: 'Steel Fixer',
    project: 'Project Gamma',
    crew: 'Crew D',
    status: 'inactive',
    avatarColor: 'bg-zinc-500',
    stats: { hoursThisWeek: 0, overtimeThisWeek: 0, overtimeVsAvgPct: 0, personalLeaveDays: 2, saturdaysWorked: 0 },
    alerts: {
      uncertifiedLeave: { count: 2, period: 'in last 60 days' },
      monFriLeave: { taken: 2, total: 2 },
      satAfterShortWeek: { taken: 0, total: 0 },
      licenceExpiry: { label: 'White Card', daysLeft: 0 },
    },
    weekly: [
      [36, 3], [38, 4], [35, 2], [38, 3], [30, 2], [38, 3.5], [37, 3],
      [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
    ],
    leave: [[1, 0], [1, 0], [0, 0], [0, 0]],
    weekend: [
      [5, 0], [0, 0], [0, 0], [6, 0], [0, 0], [0, 0], [0, 0],
      [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
    ],
    skillScores: [78, 64, 70, 60, 72, 50],
    earlierOrdinary: 36,
    seed: 8,
  },
]

export const employees: Employee[] = seeds.map(buildEmployee)

export const getEmployeeById = (id: string): Employee | undefined => employees.find((e) => e.id === id)
