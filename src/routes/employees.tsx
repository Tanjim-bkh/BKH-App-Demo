import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { EmployeeList } from '@/components/employees/EmployeeList'
import { EmployeeProfile } from '@/components/employees/EmployeeProfile'
import { Button } from '@/components/ui/button'
import { employees, getEmployeeById } from '@/data/employees'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/employees')({
  staticData: { title: 'Site Crews', fullBleed: true },
  component: EmployeesPage,
})

function EmployeesPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0].id)
  const employee = getEmployeeById(selectedEmployeeId) ?? employees[0]
  // - Phones show the list or the profile, not both
  const [showProfile, setShowProfile] = useState(false)
  const isWide = useMediaQuery('(min-width: 768px)')

  const select = (id: string) => {
    setSelectedEmployeeId(id)
    setShowProfile(true)
  }

  return (
    <div className="flex h-full min-h-0">
      <div className={cn('w-full md:w-auto', showProfile && 'hidden md:block')}>
        <EmployeeList employees={employees} selectedEmployeeId={selectedEmployeeId} onSelect={select} />
      </div>
      <div className={cn('min-w-0 flex-1 overflow-y-auto p-4 md:p-7', !showProfile && 'hidden md:block')}>
        <Button variant="ghost" size="sm" className="mb-3 -ml-2 md:hidden" onClick={() => setShowProfile(false)}>
          <ArrowLeft />
          All site crews
        </Button>
        {/* - Charts measure their container, so don't mount them while hidden */}
        {(isWide || showProfile) && <EmployeeProfile employee={employee} />}
      </div>
    </div>
  )
}
