import * as React from 'react'
import { useParams } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCheck, X, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useTeacherAttendanceMatrixById } from '@/hooks/useTeacherAttendance'

function toLocalDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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
            <DayPicker
              style={{
                '--rdp-day-width': '44px',
                '--rdp-day-height': '44px',
                '--rdp-day_button-width': '28px',
                '--rdp-day_button-height': '28px',
                '--rdp-day_button-border-radius': '9999px',
              }}
              month={new Date(`${selectedMonth}-01`)}
              onMonthChange={(date) =>
                setSelectedMonth(
                  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                )
              }
              hideNavigation
              classNames={{
                table: 'border-separate border-spacing-x-6 border-spacing-y-6',
                cell: 'p-1 text-center',
                day_button: 'mx-auto',
              }}
              modifiers={{
                present: (date) => attendanceMap[toLocalDateKey(date)] === 'P',
                absent: (date) => attendanceMap[toLocalDateKey(date)] === 'A',
                late: (date) => attendanceMap[toLocalDateKey(date)] === 'L',
                halfDay: (date) => attendanceMap[toLocalDateKey(date)] === 'H',
                holiday: (date) => attendanceMap[toLocalDateKey(date)] === null,
              }}
              modifiersClassNames={{
                present: 'bg-emerald-200 text-gray-900 w-8 h-8 rounded-full',
                absent: 'bg-red-200 text-gray-900 w-8 h-8 rounded-full',
                late: 'bg-yellow-200 text-gray-900 w-8 h-8 rounded-full',
                halfDay: 'bg-orange-200 text-gray-900 w-8 h-8 rounded-full',
                holiday: 'bg-blue-200 text-gray-900 w-8 h-8 rounded-full',
              }}
              components={{
                DayButton: ({ day }) => {
                  const key = day.date.toISOString().slice(0, 10)
                  const status = attendanceMap[key]

                  return (
                    <button disabled className="w-8 h-8 flex items-center justify-center">
                      <span
                        className={`
                text-xs font-medium rounded-full
                ${
                  status === 'P'
                    ? 'bg-emerald-200 text-gray-900'
                    : status === 'A'
                      ? 'bg-red-200 text-gray-900'
                      : status === 'L'
                        ? 'bg-yellow-200 text-gray-900'
                        : status === 'H'
                          ? 'bg-orange-200 text-gray-900'
                          : status === null
                            ? 'bg-blue-200 text-gray-900'
                            : ''
                }
                w-8 h-8 flex items-center justify-center
              `}
                      >
                        {day.date.getDate()}
                      </span>
                    </button>
                  )
                },
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
