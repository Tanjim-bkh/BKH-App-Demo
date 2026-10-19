import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns'

export const AU_DATE = 'dd/MM/yyyy'

export function formatAuDate(date: Date | string): string {
  return format(typeof date === 'string' ? new Date(date) : date, AU_DATE)
}

// - Short relative time, e.g. "just now", "12 mins ago", "2 hrs ago", "3 days ago"
export function formatRelativeShort(date: Date, now = new Date()): string {
  const mins = differenceInMinutes(now, date)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = differenceInHours(now, date)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  const days = differenceInDays(now, date)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatAuDate(date)
}

export function greetingFor(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
