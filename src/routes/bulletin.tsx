import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/ComingSoon'

export const Route = createFileRoute('/bulletin')({
  staticData: { title: 'Bulletin' },
  component: () => <ComingSoon title="Bulletin" />,
})
