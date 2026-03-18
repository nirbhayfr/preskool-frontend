// components/staff-salary/StaffAttendanceSummaryCard.jsx

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCheck, X, Clock, CalendarIcon, AlarmClock } from 'lucide-react'
import { useStaffAttendanceMatrixById } from '@/hooks/useStaffAttendance'

function StaffAttendanceSummaryCard({ staffId }) {
  const [selectedMonth, setSelectedMonth] = React.useState(() =>
    new Date().toISOString().slice(0, 7)
  )

  const {
    data: attendanceData,
    isLoading,
    isError,
  } = useStaffAttendanceMatrixById(staffId)

  const attendanceMap = React.useMemo(() => {
    const row = attendanceData?.Data?.[0] || {}
    const map = {}
    Object.entries(row).forEach(([key, value]) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) map[key] = value
    })
    return map
  }, [attendanceData])

  const summary = React.useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, halfDay: 0, holiday: 0 }
    Object.entries(attendanceMap).forEach(([key, value]) => {
      if (!key.startsWith(selectedMonth)) return
      if (value === 'P') counts.present++
      else if (value === 'A') counts.absent++
      else if (value === 'L') counts.late++
      else if (value === 'H') counts.halfDay++
      else if (value === null) counts.holiday++
    })
    counts.total = counts.present + counts.absent + counts.late + counts.halfDay
    return counts
  }, [attendanceMap, selectedMonth])

  if (isLoading) return <StaffAttendanceSummarySkeleton />
  if (isError)
    return <p className="text-sm text-destructive">Failed to load attendance</p>

  const stats = [
    {
      label: 'Present',
      value: summary.present,
      icon: CheckCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      label: 'Absent',
      value: summary.absent,
      icon: X,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/40',
    },
    {
      label: 'Late',
      value: summary.late,
      icon: AlarmClock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    },
    {
      label: 'Half Day',
      value: summary.halfDay,
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
    },
    {
      label: 'Holidays',
      value: summary.holiday,
      icon: CalendarIcon,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      label: 'Working Days',
      value: summary.total,
      icon: CalendarIcon,
      color: 'text-muted-foreground',
      bg: 'bg-muted/60',
    },
  ]

  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Attendance Summary
        </CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Month</span>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 ${bg}`}
            >
              <Icon className={`size-5 shrink-0 ${color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-xl font-semibold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default StaffAttendanceSummaryCard

function StaffAttendanceSummarySkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-40" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
