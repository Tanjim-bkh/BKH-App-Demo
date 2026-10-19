import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/ComingSoon'

export const Route = createFileRoute('/lost-hours')({
  staticData: { title: 'Lost Hours' },
  component: () => <ComingSoon title="Lost Hours" />,
})
