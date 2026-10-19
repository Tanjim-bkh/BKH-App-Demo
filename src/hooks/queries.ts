import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/data/api'
import type { Notification, SiteDiaryTab } from '@/types'

export const queryKeys = {
  month: (month: string) => ['month-data', month] as const,
  day: (date: string) => ['day-detail', date] as const,
  notifications: ['notifications'] as const,
  itps: (projectId: string) => ['itps', projectId] as const,
  siteDiary: (tab: SiteDiaryTab, projectId: string) => ['site-diary', tab, projectId] as const,
  incidents: (projectId: string) => ['incidents', projectId] as const,
  incident: (id: string) => ['incident', id] as const,
  safetyAlerts: ['safety-alerts'] as const,
  safetyAlert: (id: string) => ['safety-alert', id] as const,
}

export function useMonthData(month: string) {
  return useQuery({ queryKey: queryKeys.month(month), queryFn: () => api.getMonthData(month) })
}

export function useDayDetail(date: string | null) {
  return useQuery({
    queryKey: queryKeys.day(date ?? ''),
    queryFn: () => api.getDayDetail(date!),
    enabled: date !== null,
  })
}

// - Keeps the previous project's rows on screen while the next project loads
export function useProjectItps(projectId: string) {
  return useQuery({
    queryKey: queryKeys.itps(projectId),
    queryFn: () => api.getProjectItps(projectId),
    placeholderData: keepPreviousData,
  })
}

export function useSiteDiaryRecords<K extends SiteDiaryTab>(tab: K, projectId: string) {
  return useQuery({
    queryKey: queryKeys.siteDiary(tab, projectId),
    queryFn: () => api.getSiteDiaryRecords(tab, projectId),
    placeholderData: keepPreviousData,
  })
}

export function useIncidents(projectId: string) {
  return useQuery({
    queryKey: queryKeys.incidents(projectId),
    queryFn: () => api.getIncidents(projectId),
    placeholderData: keepPreviousData,
  })
}

export function useIncident(id: string) {
  return useQuery({ queryKey: queryKeys.incident(id), queryFn: () => api.getIncident(id), retry: false })
}

export function useSafetyAlerts() {
  return useQuery({ queryKey: queryKeys.safetyAlerts, queryFn: api.getSafetyAlerts })
}

export function useSafetyAlert(id: string) {
  return useQuery({ queryKey: queryKeys.safetyAlert(id), queryFn: () => api.getSafetyAlert(id), retry: false })
}

// - Refreshes the alert, the alert list and incidents (they show the alert's status)
export function useSignOffSafetyAlert(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (signedBy: string) => api.signOffSafetyAlert(id, signedBy),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.safetyAlert(id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.safetyAlerts }),
        queryClient.invalidateQueries({ queryKey: ['incidents'] }),
        queryClient.invalidateQueries({ queryKey: ['incident'] }),
      ]),
  })
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: api.getNotifications })
}

// - Optimistically flips read flags so the UI responds instantly
function useNotificationMutation(mutationFn: (id?: string) => Promise<void>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onMutate: async (id?: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications })
      queryClient.setQueryData<Notification[]>(queryKeys.notifications, (prev) =>
        prev?.map((n) => (id === undefined || n.id === id ? { ...n, read: true } : n)),
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  })
}

export function useMarkNotificationRead() {
  return useNotificationMutation((id) => api.markNotificationRead(id!))
}

export function useMarkAllNotificationsRead() {
  return useNotificationMutation(() => api.markAllNotificationsRead())
}
