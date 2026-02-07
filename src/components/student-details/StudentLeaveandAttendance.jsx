import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCheck, X, Calendar as CalendarIcon } from 'lucide-react'

import { useAttendanceMatrixByStudentId } from '@/hooks/useAttendance'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { ChevronDown, ChevronLeft, ChevronRight, Circle } from 'lucide-react'
import 'react-day-picker/style.css'

function StudentAttendance() {
  const { id } = useParams()

  const [selectedMonth, setSelectedMonth] = React.useState(() =>
    new Date().toISOString().slice(0, 7)
  )
  const [selected, setSelected] = React.useState(undefined)

  const defaultClassNames = getDefaultClassNames()

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
            <div className="flex flex-col items-center justify-center">
              <DayPicker
                month={new Date(`${selectedMonth}-01`)}
                onMonthChange={(date) =>
                  setSelectedMonth(
                    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                  )
                }
                hideNavigation
                classNames={{
                  root: defaultClassNames.root,

                  month: 'w-full space-y-4',

                  /* ✅ Center month text properly */
                  caption: 'w-full flex justify-center mb-4',
                  caption_label: 'text-base font-semibold text-center',

                  table: 'w-full',

                  /* ✅ Restore spacing using gap */
                  row: 'flex justify-between gap-2 mb-3',

                  head_row: 'flex justify-between gap-2',
                  head_cell: 'w-12 text-xs font-medium text-muted-foreground text-center',

                  cell: 'flex justify-center',

                  day: `group  w-10 h-10 rounded-full m-1 ${defaultClassNames.day}`,
                }}
                modifiers={{
                  present: (date) =>
                    attendanceMap[date.toISOString().slice(0, 10)] === 'P',
                  absent: (date) =>
                    attendanceMap[date.toISOString().slice(0, 10)] === 'A',
                  holiday: (date) =>
                    attendanceMap[date.toISOString().slice(0, 10)] === null,
                }}
                modifiersClassNames={{
                  present: 'bg-emerald-600 text-white',
                  absent: 'bg-red-600 text-white',
                  holiday: 'bg-blue-600 text-white',
                }}
                components={{
                  DayButton: ({ day, ...buttonProps }) => {
                    const key = day.date.toISOString().slice(0, 10)
                    const status = attendanceMap[key]

                    return (
                      <button
                        {...buttonProps}
                        disabled
                        //                   className={`
                        //   w-6 h-6 m-1 rounded-full
                        //   ${
                        //     status === 'P'
                        //       ? 'bg-emerald-600 text-white'
                        //       : status === 'A'
                        //         ? 'bg-red-600 text-white'
                        //         : status === null
                        //           ? 'bg-blue-600 text-white'
                        //           : 'bg-zinc-200 text-foreground'
                        //   }
                        // `}
                      >
                        {day.date.getDate()}
                      </button>
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
