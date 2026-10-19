import { eachDayOfInterval, format, isWeekend } from 'date-fns'
import { october2026, projects } from '@/data/mock'
import type {
  DayData,
  DayLabourDocket,
  Handover,
  SiteDiaryEntry,
  SiteDiaryRecords,
  SiteInspection,
  Swms,
} from '@/types'

// - Mock Site Diary registers per project. Numbers follow PREFIX-<project number>-<4 digit seq>.

const seq = (prefix: string, projectNumber: string, n: number) => `${prefix}-${projectNumber}-${String(n).padStart(4, '0')}`

// - Project A diaries mirror the calendar data. Project B is missing Oct 16 (see notifications).
const DIARY_DAYS: Record<string, DayData[]> = {
  'p-a': october2026,
  'p-b': weekdayDiaries('2026-10-01', '2026-10-19', ['2026-10-16']),
  'p-c': weekdayDiaries('2026-10-05', '2026-10-19', []),
}

function weekdayDiaries(start: string, end: string, missing: string[]): DayData[] {
  return eachDayOfInterval({ start: new Date(start), end: new Date(end) })
    .filter((d) => !isWeekend(d))
    .map((d) => format(d, 'yyyy-MM-dd'))
    .filter((date) => !missing.includes(date))
    .map((date) => ({ date, hasDiary: true }))
}

const MORNING_NOTES = [
  'Pre-start held at 6:30am. Formwork crew on Level 3 deck strip-out, grid C to F.',
  'Column forms erected and plumbed on Level 4. Crane booked 7am to 11am.',
  'Reo delivery received and craned to Level 4. Edge protection inspected and tagged.',
  'Pre-pour inspection with engineer. Minor rectification to bottom bar chairs.',
  'Wet start - crew on covered works only until 9am. Housekeeping on L02.',
]

const AFTERNOON_NOTES = [
  'Concrete pour complete 2:15pm. Curing compound applied, area barricaded.',
  'Strip-out continued on L03. Materials loaded out via hoist.',
  'Afternoon crew installed perimeter screens on L04 north face.',
]

function buildDiaries(projectId: string): SiteDiaryEntry[] {
  return DIARY_DAYS[projectId].flatMap((day, i) => {
    const extras = [
      day.lostHours ? `${day.lostHours} hrs lost.` : '',
      day.incident ? `${day.incident.severity === 'high' ? 'Incident' : 'Medium incident'} reported - see Incidents.` : '',
    ]
    const morning: SiteDiaryEntry = {
      id: `${projectId}-diary-${day.date}-am`,
      projectId,
      date: day.date,
      shift: 'Morning',
      notes: [MORNING_NOTES[i % MORNING_NOTES.length], ...extras].filter(Boolean).join(' '),
    }
    // - Pour days run an afternoon shift as well. List is reversed below so newest comes first.
    if (!day.itpCount) return [morning]
    const afternoon: SiteDiaryEntry = {
      id: `${projectId}-diary-${day.date}-pm`,
      projectId,
      date: day.date,
      shift: 'Afternoon',
      notes: AFTERNOON_NOTES[i % AFTERNOON_NOTES.length],
    }
    return [morning, afternoon]
  }).reverse()
}

const AREAS = ['L01 slab Zone A', 'L02 core walls', 'L03 deck grid C to F', 'L03 shear walls 10 & 11', 'L04 columns C1 to C8', 'Stair 3', 'Ramp R1', 'L04 perimeter']

const HANDOVER_TEXT = {
  Erect: (area: string) => `Formwork erected and handed over to concretor - ${area}`,
  Dismantle: (area: string) => `Formwork dismantled, area cleaned and handed back - ${area}`,
}

const INSPECTION_TEXT = [
  'Pre-pour inspection',
  'Edge protection inspection',
  'Formwork deck load inspection',
  'Back-propping inspection',
  'Scaffold tag inspection',
]

const SWMS_TITLES = [
  'Working at heights - formwork deck',
  'Formwork erection and stripping',
  'Crane lifting and dogging operations',
  'Scaffold erection and dismantle',
  'Concrete pumping and placement',
  'Mobile plant - EWP operation',
  'Manual handling of formwork panels',
  'Hot works - cutting and grinding',
  'Back-propping installation and removal',
  'Working near live edges and penetrations',
]

const DOCKET_NOTES = [
  '2 x labourers - clean up L02 after pour (6 hrs each)',
  '1 x carpenter - repair damaged deck panels L03 (4 hrs)',
  '3 x labourers - unload and stack formwork delivery (3 hrs each)',
  '1 x leading hand - variation works, extra penetrations L04 (5 hrs)',
  '2 x formworkers - rework edge forms after survey (4 hrs each)',
]

// - Counts per project: [handovers, inspections, swms, dockets]
const COUNTS: Record<string, [number, number, number, number]> = {
  'p-a': [14, 7, 10, 9],
  'p-b': [9, 5, 8, 6],
  'p-c': [5, 3, 6, 3],
}

function buildRegisters(projectId: string, projectNumber: string) {
  const [ho, si, sw, dld] = COUNTS[projectId]
  // - Higher numbers first; the newest one or two records are still open
  const desc = (count: number) => Array.from({ length: count }, (_, i) => count - i)

  const handovers: Handover[] = desc(ho).map((n, i) => {
    const workType = n % 3 === 0 ? 'Dismantle' : 'Erect'
    return {
      id: `${projectId}-ho-${n}`,
      projectId,
      number: seq('HO', projectNumber, n + 57),
      workType,
      status: i < 2 ? 'Active' : 'Signed',
      description: HANDOVER_TEXT[workType](AREAS[n % AREAS.length]),
    }
  })

  const inspections: SiteInspection[] = desc(si).map((n, i) => ({
    id: `${projectId}-si-${n}`,
    projectId,
    number: seq('SI', projectNumber, n),
    status: i < 1 ? 'Active' : 'Signed',
    description: `${INSPECTION_TEXT[n % INSPECTION_TEXT.length]} - ${AREAS[(n + 2) % AREAS.length]}`,
  }))

  const swms: Swms[] = desc(sw).map((n, i) => ({
    id: `${projectId}-swms-${n}`,
    projectId,
    number: seq('SWMS', projectNumber, n),
    title: SWMS_TITLES[(n - 1) % SWMS_TITLES.length],
    status: i < 1 ? 'Active' : 'Signed',
    revision: 1 + (n % 4),
  }))

  const dockets: DayLabourDocket[] = desc(dld).map((n, i) => ({
    id: `${projectId}-dld-${n}`,
    projectId,
    number: seq('DLD', projectNumber, n),
    status: i < 2 ? 'Approved' : 'Signed',
    notes: DOCKET_NOTES[n % DOCKET_NOTES.length],
  }))

  return { handovers, inspections, swms, dockets }
}

type Registers = { [K in keyof SiteDiaryRecords]: SiteDiaryRecords[K][] }

export const siteDiaryRegisters: Record<string, Registers> = Object.fromEntries(
  projects.map((p) => [p.id, { diaries: buildDiaries(p.id), ...buildRegisters(p.id, p.number) }]),
)
