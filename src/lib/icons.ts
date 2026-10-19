import {
  AlertTriangle,
  BarChart2,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Layers,
  LayoutDashboard,
  Megaphone,
  Settings,
  Share2,
  ShieldAlert,
  Users,
  type LucideIcon,
} from 'lucide-react'

// - Icon registry so data can reference icons by name without bundling all of lucide
const icons: Record<string, LucideIcon> = {
  AlertTriangle,
  BarChart2,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Layers,
  LayoutDashboard,
  Megaphone,
  Settings,
  Share2,
  ShieldAlert,
  Users,
}

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? LayoutDashboard
}
