import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCheck, X, Calendar as CalendarIcon, Clock } from 'lucide-react'

import { useStaffAttendanceMatrixById } from '@/hooks/useStaffAttendance'

function StaffAttendanceCalendar() {
  const { id } = useParams()

  const [selectedMonth, setSelectedMonth] = React.useState(() =>
    new Date().toISOString().slice(0, 7)
  )

  const { data: attendanceData, isLoading, isError } = useStaffAttendanceMatrixById(id)

  const tableData = attendanceData?.Data || []
  const attendanceRow = tableData[0] || {}

  const today = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const attendanceMap = React.useMemo(() => {
    const map = {}
    Object.entries(attendanceRow).forEach(([key, value]) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        map[key] = value
      }
    })
    return map
  }, [attendanceRow])

  const summaryCounts = React.useMemo(() => {
    const counts = { P: 0, A: 0, L: 0, H: 0 }
    Object.entries(attendanceMap).forEach(([date, value]) => {
      if (!date.startsWith(selectedMonth)) return
      if (value in counts) counts[value]++
    })
    return counts
  }, [attendanceMap, selectedMonth])

  if (isLoading) return <p>Loading attendance...</p>
  if (isError) return <p>Failed to load attendance</p>

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-muted/60">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Staff Attendance
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

          {/* Summary */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <SummaryDot label="Present" value={summaryCounts.P} color="bg-emerald-600" />
            <SummaryDot label="Absent" value={summaryCounts.A} color="bg-red-600" />
            <SummaryDot label="Late" value={summaryCounts.L} color="bg-yellow-500" />
            <SummaryDot label="Half Day" value={summaryCounts.H} color="bg-orange-600" />
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
                P: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'P',
                A: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'A',
                L: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'L',
                H: (date) => attendanceMap[date.toISOString().slice(0, 10)] === 'H',
                Holiday: (date) =>
                  attendanceMap[date.toISOString().slice(0, 10)] === null,
                future: (date) => date > today,
              }}
              modifiersClassNames={{
                P: 'bg-emerald-600 text-white rounded-lg shadow-md',
                A: 'bg-red-600 text-white rounded-lg shadow-md',
                L: 'bg-yellow-500 text-white rounded-lg shadow-md',
                H: 'bg-orange-600 text-white rounded-lg shadow-md',
                Holiday: 'bg-blue-600 text-white rounded-lg shadow-md',
              }}
              components={{
                DayContent: ({ date }) => {
                  const key = date.toISOString().slice(0, 10)
                  const isFuture = date > today
                  const value = attendanceMap[key]

                  if (isFuture) {
                    return (
                      <span className="text-xs sm:text-sm text-muted-foreground">–</span>
                    )
                  }

                  if (!value) return null

                  return <span className="text-xs sm:text-sm font-semibold">{value}</span>
                },
              }}
              className="rounded-xl border border-muted/50 bg-background p-4 sm:p-5"
              classNames={{
                months: 'flex justify-center',
                month: 'w-full max-w-sm',
                caption: 'pb-4',
                caption_label: 'text-base sm:text-lg font-semibold',
                head_cell:
                  'text-[11px] sm:text-xs font-medium text-muted-foreground uppercase',
                table: 'w-full border-separate border-spacing-2 sm:border-spacing-3',
                day: 'h-9 w-9 sm:h-10 sm:w-10 text-sm',
                day_button:
                  'h-full w-full flex items-center justify-center rounded-lg transition hover:scale-[1.03]',
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StaffAttendanceCalendar

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

function SummaryDot({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="font-medium">
        {label}: {value}
      </span>
    </div>
  )
}
