import { Bell, CheckCheck } from 'lucide-react'
import { NotificationItem } from '@/components/notifications/NotificationItem'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/hooks/queries'

export function NotificationPanel() {
  const { data: notifications = [], isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unreadCount} unread)`}>
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b pr-12">
          <div className="flex flex-col gap-1">
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>{unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}</SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0}
            onClick={() => markAllRead.mutate(undefined)}
          >
            <CheckCheck />
            Mark all read
          </Button>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading notifications...</p>
          ) : (
            <ul className="divide-y">
              {notifications.map((n) => (
                <li key={n.id}>
                  <NotificationItem notification={n} onSelect={() => !n.read && markRead.mutate(n.id)} />
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
