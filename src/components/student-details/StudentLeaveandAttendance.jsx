import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCheck, X, Calendar as CalendarIcon } from 'lucide-react'

import { useAttendanceMatrixByStudentId } from '@/hooks/useAttendance'

function StudentAttendance() {
  const { id } = useParams()

  const [selectedMonth, setSelectedMonth] = React.useState(() =>
    new Date().toISOString().slice(0, 7)
  )

  const { data: attendanceData, isLoading, isError } = useAttendanceMatrixByStudentId(id)

  const tableData = attendanceData?.Data || []
  const attendanceRow = tableData[0] || {}

  const attendanceMap = React.useMemo(() => {
    const map = {}
    Object.entries(attendanceRow).forEach(([key, value]) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        map[key] = value
      }
    })
    return map
  }, [attendanceRow])

  if (isLoading) return <AttendanceSkeleton />
  if (isError) return <p>Failed to load attendance</p>

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-muted/60">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Attendance
          </CardTitle>

          {/* Month Selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Month</span>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-[160px]"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4">
            <LegendItem
              icon={<CheckCheck className="h-4 w-4" />}
              label="Present"
              bg="bg-emerald-600"
            />
            <LegendItem icon={<X className="h-4 w-4" />} label="Absent" bg="bg-red-600" />
            <LegendItem
              icon={<CalendarIcon className="h-4 w-4" />}
              label="Holiday"
              bg="bg-blue-600"
            />
          </div>

          {/* Calendar */}
          <div className="flex justify-center sm:justify-start pt-2">
            <Calendar
              mode="single"
              month={new Date(`${selectedMonth}-01`)}
              onMonthChange={(date) =>
                setSelectedMonth(
                  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                )
              }
              modifiers={{
                present: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'P',
                absent: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'A',
                holiday: (date) =>
                  attendanceMap[date.toISOString().slice(0, 10)] === null,
              }}
              modifiersClassNames={{
                present: 'bg-emerald-600 text-white rounded-full',
                absent: 'bg-red-600 text-white rounded-full',
                holiday: 'bg-blue-600 text-white rounded-full',
              }}
              components={{
                DayContent: ({ date }) => {
                  const key = date.toISOString().slice(0, 10)
                  const value = attendanceMap[key]

                  if (!value) return <span>{date.getDate()}</span>

                  return <span className="font-semibold">{date.getDate()}</span>
                },
              }}
              className="bg-background border rounded-lg"
              classNames={{
                months: 'flex justify-center',
                month: 'space-y-4',

                caption: 'pb-6 flex justify-center',
                caption_label: 'text-lg font-semibold',

                head_cell: 'text-xs font-medium text-muted-foreground uppercase',

                table: 'border-separate border-spacing-4',
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentAttendance

function LegendItem({ icon, label, bg }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/60 text-sm font-medium">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md text-white ${bg}`}
      >
        {icon}
      </span>
      {label}
    </div>
  )
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-5 w-32 bg-muted rounded" />
        <div className="h-9 w-40 bg-muted rounded" />
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-muted" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Calendar Skeleton */}
      <div className="grid grid-cols-7 gap-3 max-w-sm">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-full bg-muted" />
        ))}
      </div>
    </div>
  )
}
