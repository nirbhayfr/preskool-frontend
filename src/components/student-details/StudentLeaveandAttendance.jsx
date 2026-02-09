import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCheck, X, Calendar as CalendarIcon } from 'lucide-react'

import { useAttendanceMatrixByStudentId } from '@/hooks/useAttendance'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

function toLocalDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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

  const todayKey = new Date().toISOString().slice(0, 10)

  console.log(todayKey)

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
              className="w-40"
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
            <div className="flex flex-col items-center justify-center">
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
                  holiday: (date) => {
                    const key = toLocalDateKey(date)

                    return attendanceMap[key] === null && key <= todayKey
                  },
                }}
                modifiersClassNames={{
                  present: 'bg-emerald-200 text-gray-900 w-5 h-5 rounded-full',
                  absent: 'bg-red-200 text-gray-900 w-9 h-9 rounded-full',
                  holiday: 'bg-blue-200 text-gray-900 w-9 h-9 rounded-full',
                }}
                components={{
                  DayButton: ({ day }) => {
                    const key = day.date.toISOString().slice(0, 10)
                    const status = attendanceMap[key]
                    const isFuture = key > todayKey

                    return (
                      <div className="w-[10px] h-[10px] bg-black">
                        <button
                          disabled
                          className="w-8 h-8 flex items-center justify-center"
                        >
                          <span
                            className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${
                              status === 'P'
                                ? 'bg-emerald-200 text-gray-900'
                                : status === 'A'
                                  ? 'bg-red-200 text-gray-900'
                                  : status === null && !isFuture
                                    ? 'bg-blue-200 text-gray-900'
                                    : ''
                            }
                          `}
                          >
                            {day.date.getDate()}
                          </span>
                        </button>
                      </div>
                    )
                  },
                }}
              />
            </div>
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
