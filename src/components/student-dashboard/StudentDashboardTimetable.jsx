import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { useClassTimetable } from '@/hooks/useTimeTable'
import moment from 'moment'
import { BookOpen, Clock, User, DoorOpen } from 'lucide-react'
import { SkeletonCard } from '../extra/SkeletonCardList'

// ─────────────────────────────────────────────────────────

const DAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const DAY_SHORT = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
}

function formatTime(iso) {
  return moment(iso).utc().format('h:mm A')
}

function subjectLabel(subjectID, periodNo) {
  if (!subjectID) return `Period ${periodNo}`
  return isNaN(subjectID) ? subjectID : `Period ${periodNo}`
}

// ─────────────────────────────────────────────────────────

export default function StudentDashboardTimetable({ student }) {
  const params = student?.ClassID
    ? { classId: student.ClassID, sectionId: student.SectionID }
    : null

  const { data: raw, isLoading, isError } = useClassTimetable(params)

  const todayName = moment().format('dddd')
  const [selectedDay, setSelectedDay] = useState(todayName)

  if (isLoading) return <SkeletonCard />
  if (isError) return <p>Failed to load timetable</p>
  if (!raw?.timeTable?.length) return null

  const timetable = raw.timeTable.filter((t) => t.isActive)

  const availableDays = DAY_ORDER.filter((d) => timetable.some((t) => t.dayOfWeek === d))

  const activeDay = availableDays.includes(selectedDay) ? selectedDay : availableDays[0]

  const periods = timetable
    .filter((t) => t.dayOfWeek === activeDay)
    .sort((a, b) => moment(a.startTime).utc().diff(moment(b.startTime).utc()))

  return (
    <Card className="w-full min-w-0 rounded-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Timetable</CardTitle>
          {raw.sectionID && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-auto">
              Class {raw.classID} · {raw.sectionID}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-3">
        {/* ── Day Filter ── */}
        <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
          {availableDays.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">No timetable available.</p>
          ) : (
            availableDays.map((day) => {
              const isToday = day === todayName
              const isSelected = day === activeDay

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-2.5 py-1 rounded text-[11px] border ${
                    isSelected
                      ? 'bg-foreground text-background border-foreground'
                      : 'text-muted-foreground border-border'
                  }`}
                >
                  {DAY_SHORT[day]}
                  {isToday && (
                    <span
                      className={`ml-1 inline-block h-1 w-1 rounded ${
                        isSelected ? 'bg-background' : 'bg-foreground'
                      }`}
                    />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* ── Table ── */}
        {periods.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            No periods scheduled for {activeDay}.
          </p>
        ) : (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="pl-4 pr-2 py-1.5 text-left text-[10px] w-6">#</th>
                <th className="px-2 py-1.5 text-left text-[10px]">Subject</th>
                <th className="px-2 py-1.5 text-left text-[10px]">Teacher</th>
                <th className="px-2 py-1.5 text-left text-[10px] hidden sm:table-cell">
                  Room
                </th>
                <th className="pl-2 pr-4 py-1.5 text-right text-[10px]">Time</th>
              </tr>
            </thead>

            <tbody>
              {periods.map((period) => (
                <tr key={period.timeTableID} className="border-b hover:bg-muted/30">
                  <td className="pl-4 pr-2 py-2.5">{period.periodNo}</td>

                  <td className="px-2 py-2.5 font-medium">
                    {subjectLabel(period.subjectID, period.periodNo)}
                  </td>

                  <td className="px-2 py-2.5 text-muted-foreground">
                    {period.teacherName}
                  </td>

                  <td className="px-2 py-2.5 text-muted-foreground hidden sm:table-cell">
                    {period.roomID}
                  </td>

                  <td className="pl-2 pr-4 py-2.5 text-right text-muted-foreground">
                    {formatTime(period.startTime)}–{formatTime(period.endTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
