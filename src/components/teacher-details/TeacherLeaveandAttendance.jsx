import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCheck, X, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useTeacherAttendanceMatrixById } from '@/hooks/useTeacherAttendance'

function TeacherAttendanceCalendar() {
  const { id } = useParams()

  const [selectedMonth, setSelectedMonth] = React.useState(() =>
    new Date().toISOString().slice(0, 7)
  )

  const { data: attendanceData, isLoading, isError } = useTeacherAttendanceMatrixById(id)

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

  if (isLoading) return <TeacherAttendanceSkeleton />
  if (isError) return <p>Failed to load attendance</p>

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-muted/60">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Teacher Attendance
          </CardTitle>

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
          <div className="flex flex-wrap gap-4">
            <LegendItem
              label="Present"
              icon={<CheckCheck className="h-4 w-4" />}
              bg="bg-emerald-600"
            />
            <LegendItem label="Absent" icon={<X className="h-4 w-4" />} bg="bg-red-600" />
            <LegendItem
              label="Late"
              icon={<Clock className="h-4 w-4" />}
              bg="bg-yellow-500"
            />
            <LegendItem
              label="Half Day"
              icon={<Clock className="h-4 w-4" />}
              bg="bg-orange-600"
            />
            <LegendItem
              label="Holiday"
              icon={<CalendarIcon className="h-4 w-4" />}
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
                late: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'L',
                halfDay: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'H',
                holiday: (date) =>
                  attendanceMap[date.toISOString().slice(0, 10)] === null,
              }}
              modifiersClassNames={{
                present: 'bg-emerald-600 text-white rounded-full',
                absent: 'bg-red-600 text-white rounded-full',
                late: 'bg-yellow-500 text-white rounded-full',
                halfDay: 'bg-orange-600 text-white rounded-full',
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
              className="bg-background border rounded-lg p-4"
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

export default TeacherAttendanceCalendar

/* ---------- Helpers ---------- */

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

function TeacherAttendanceSkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-40" />
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex gap-4 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-lg" />
          ))}
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-[360px] w-[320px] rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}
