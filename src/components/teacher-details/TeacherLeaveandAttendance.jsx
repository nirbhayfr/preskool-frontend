import * as React from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckCheck,
  X,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useTeacherAttendanceMatrixById } from '@/hooks/useTeacherAttendance'

function toLocalDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/** Returns array of Date | null for every cell in the 7-col grid */
function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month - 1, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

// Inline color map keyed by status — avoids Tailwind JIT purging dynamic class strings
const STATUS_COLORS = {
  P: { bg: '#22c55e', text: '#ffffff' }, // green-500  — Present
  A: { bg: '#ef4444', text: '#ffffff' }, // red-500    — Absent
  L: { bg: '#eab308', text: '#ffffff' }, // yellow-500 — Late
  H: { bg: '#f97316', text: '#ffffff' }, // orange-500 — Half Day
  null: { bg: '#3b82f6', text: '#ffffff' }, // blue-500 — Holiday
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

  const todayKey = new Date().toISOString().slice(0, 10)
  const [year, month] = selectedMonth.split('-').map(Number)
  const calendarDays = buildCalendarDays(year, month)

  const goPrev = () => {
    const d = new Date(year, month - 2, 1)
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  const goNext = () => {
    const d = new Date(year, month, 1)
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  return (
    <div className="w-full space-y-4">
      <Card className="rounded-xl border-muted/60 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">
            Teacher Attendance
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-3 sm:px-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-2">
            <LegendItem
              label="Present"
              icon={<CheckCheck className="h-3 w-3" />}
              bg="bg-emerald-500"
            />
            <LegendItem label="Absent" icon={<X className="h-3 w-3" />} bg="bg-red-500" />
            <LegendItem
              label="Late"
              icon={<Clock className="h-3 w-3" />}
              bg="bg-yellow-500"
            />
            <LegendItem
              label="Half Day"
              icon={<Clock className="h-3 w-3" />}
              bg="bg-orange-500"
            />
            <LegendItem
              label="Holiday"
              icon={<CalendarIcon className="h-3 w-3" />}
              bg="bg-blue-500"
            />
          </div>

          {/* Calendar */}
          <div className="w-full rounded-xl border border-muted/50 overflow-hidden bg-card">
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-muted/40">
              <button
                onClick={goPrev}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <button
                onClick={goNext}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-muted/10 border-b border-muted/30">
              {WEEK_DAYS.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid — fluid circles via w-full + aspect-square */}
            <div className="grid grid-cols-7 gap-y-1 p-2">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={`e-${idx}`} className="aspect-square" />

                const key = toLocalDateKey(date)
                const status = attendanceMap[key] // 'P' | 'A' | 'L' | 'H' | null | undefined
                const isFuture = key > todayKey
                const isToday = key === todayKey

                // Resolve colors — use inline styles to guarantee they apply
                let bgColor = 'transparent'
                let textColor = 'inherit'
                let fontWeight = '400'
                let boxShadow = 'none'
                let opacity = isFuture ? '0.35' : '1'

                if (status === 'P') {
                  bgColor = STATUS_COLORS.P.bg
                  textColor = STATUS_COLORS.P.text
                  fontWeight = '600'
                } else if (status === 'A') {
                  bgColor = STATUS_COLORS.A.bg
                  textColor = STATUS_COLORS.A.text
                  fontWeight = '600'
                } else if (status === 'L') {
                  bgColor = STATUS_COLORS.L.bg
                  textColor = STATUS_COLORS.L.text
                  fontWeight = '600'
                } else if (status === 'H') {
                  bgColor = STATUS_COLORS.H.bg
                  textColor = STATUS_COLORS.H.text
                  fontWeight = '600'
                } else if (status === null && !isFuture) {
                  bgColor = STATUS_COLORS.null.bg
                  textColor = STATUS_COLORS.null.text
                  fontWeight = '600'
                } else if (isToday) {
                  boxShadow = '0 0 0 2px #6366f1'
                  fontWeight = '700'
                  textColor = '#6366f1'
                }

                return (
                  <div key={key} className="flex items-center justify-center p-0.5">
                    <div
                      className="w-full max-w-[38px] aspect-square flex items-center justify-center rounded-full text-[11px] sm:text-xs select-none"
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        fontWeight,
                        boxShadow,
                        opacity,
                      }}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                )
              })}
            </div>
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
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 text-xs font-medium">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md text-white flex-shrink-0 ${bg}`}
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

      <CardContent className="space-y-4 px-3">
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-lg" />
          ))}
        </div>
        <div className="rounded-xl border border-muted/50 overflow-hidden">
          <div className="h-11 bg-muted/30 border-b border-muted/30" />
          <div className="grid grid-cols-7 gap-1 p-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-full bg-muted/40" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
