import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/ComingSoon'

export const Route = createFileRoute('/settings')({
  staticData: { title: 'Settings' },
  component: () => <ComingSoon title="Settings" />,
})
