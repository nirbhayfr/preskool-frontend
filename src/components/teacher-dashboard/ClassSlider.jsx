import { memo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTeacherTimeTableByTeacher } from '@/hooks/useTeacherTimeTable'
import { Link } from 'react-router-dom'
import TimeTableCard from '../TimeTable/TimeTableCard'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function ClassSlider({ teacherId }) {
  console.log('ClassSlider render')
  const sliderRef = useRef(null)

  const todayDay = new Date().toLocaleString('en-US', { weekday: 'long' })
  const [selectedDay, setSelectedDay] = useState(todayDay)

  const {
    data = [],
    isLoading,
    isError,
  } = useTeacherTimeTableByTeacher(teacherId, selectedDay)

  const scroll = (dir) => {
    const node = sliderRef.current
    if (!node) return

    node.scrollBy({
      left: dir === 'left' ? -200 : 200,
      behavior: 'smooth',
    })
  }

  const cardColors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-violet-500',
    'bg-emerald-500',
    'bg-orange-500',
  ]

  // ✅ Loading state
  if (isLoading) {
    return <p className="text-sm">Loading classes...</p>
  }

  // ✅ Error state (important for Render cold start)
  if (isError) {
    return <p className="text-sm text-red-500">Server waking up... ⏳</p>
  }

  // ✅ Safety
  if (!Array.isArray(data)) return null
  const processedData = data
  return (
    <Card className="rounded-sm p-4 space-y-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {selectedDay === todayDay ? "Today's Class" : `${selectedDay}'s Classes`}
          </h3>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button size="sm" variant="outline">
          <Link to="/class-timetable">Edit Timetable</Link>
        </Button>
      </div>

      {/* Day Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {DAYS.map((day) => {
          const isToday = day === todayDay
          const isSelected = day === selectedDay

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium border transition
                ${
                  isSelected
                    ? 'bg-primary text-white border-primary'
                    : isToday
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted'
                }`}
            >
              {day.slice(0, 3)}
              {isToday && (
                <span className="ml-1 inline-block h-1 w-1 rounded-full bg-current" />
              )}
            </button>
          )
        })}
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="flex gap-3 overflow-x-auto scroll-smooth">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2">
            No classes for {selectedDay === todayDay ? 'today' : selectedDay}
          </p>
        ) : (
          processedData.map((item) => (
            <div key={item.TimeTableID} className="shrink-0 w-[220px]">
              <TimeTableCard data={item} />
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export default memo(ClassSlider)
