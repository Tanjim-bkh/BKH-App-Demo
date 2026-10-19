import type { ItpRecord } from '@/types'

// - Mock ITP register per project. Record numbers are unique across projects.

const ITP_TYPES = [
  'IC-005 Formwork Pre-Pour Inspection Test Plan',
  'IC-002 Reinforcement Inspection Test Plan',
  'IC-001 Formwork Erection Inspection Test Plan',
  'IC-007 Concrete Pour Inspection Test Plan',
  'IC-009 Formwork Stripping Inspection Test Plan',
  'IC-012 Post-Tensioning Inspection Test Plan',
]

const ELEMENTS = [
  'Shear walls 10 & 11 L01 to L02',
  'Columns C1 to C8 L02',
  'Slab Zone A L03',
  'Core walls Lift 2 L02 to L03',
  'Transfer beam TB-04 L01',
  'Stair 3 flights L01 to L03',
  'Slab Zone B L03',
  'Columns C9 to C16 L03',
  'Shear walls 12 & 13 L02 to L03',
  'Ramp R1 GF to L01',
  'Slab Zone C L04',
  'Blade walls BW-1 to BW-4 L03',
]

interface ProjectSeed {
  projectId: string
  site: string
  buildings: string[]
  count: number
  firstRecord: number
  activeCount: number // - most recent records are still open
}

const SEEDS: ProjectSeed[] = [
  { projectId: 'p-a', site: 'NEXT DC S4', buildings: ['BUILDING D', 'BUILDING E'], count: 18, firstRecord: 1148, activeCount: 4 },
  { projectId: 'p-b', site: 'MACQUARIE PARK T2', buildings: ['TOWER 1', 'PODIUM'], count: 12, firstRecord: 1102, activeCount: 3 },
  { projectId: 'p-c', site: 'PENRITH HEALTH HUB', buildings: ['BLOCK A'], count: 8, firstRecord: 1071, activeCount: 2 },
]

export const itpRecords: ItpRecord[] = SEEDS.flatMap((seed) =>
  Array.from({ length: seed.count }, (_, i) => ({
    id: `${seed.projectId}-itp-${i}`,
    projectId: seed.projectId,
    recordNumber: `BKH-${seed.firstRecord - i}`,
    recordName: `${seed.site} _ ${seed.buildings[i % seed.buildings.length]} - ${ELEMENTS[i % ELEMENTS.length]}`,
    itpType: ITP_TYPES[i % ITP_TYPES.length],
    status: i < seed.activeCount ? 'Active' : 'Signed',
  })),
)
