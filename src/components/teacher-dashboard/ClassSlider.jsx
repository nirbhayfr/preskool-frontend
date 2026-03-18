import { memo, useRef, useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTeacherTimeTableByTeacher } from '@/hooks/useTeacherTimeTable'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function ClassSlider({ teacherId }) {
  const sliderRef = useRef(null)
  const todayDay = new Date().toLocaleString('en-US', { weekday: 'long' })
  const [selectedDay, setSelectedDay] = useState(todayDay)

  const { data = [], isLoading } = useTeacherTimeTableByTeacher(teacherId)
  const classes = data

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      return item.DayOfWeek?.trim().toLowerCase() === selectedDay.trim().toLowerCase()
    })
  }, [classes, selectedDay])
  const scroll = (dir) => {
    const node = sliderRef.current
    if (!node) return

    try {
      node.scrollBy({
        left: dir === 'left' ? -200 : 200,
        behavior: 'smooth',
      })
    } catch (e) {
      console.log('Scroll prevented crash')
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const cardColors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-violet-500',
    'bg-emerald-500',
    'bg-orange-500',
  ]

  if (isLoading) return <p className="text-sm">Loading...</p>
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
        {/* <span className="text-xs text-muted-foreground">{today}</span> */}
      </div>

      {/* Day Filter Pills */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: 'none' }}
      >
        {DAYS.map((day) => {
          const isToday = day === todayDay
          const isSelected = day === selectedDay
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors border
                ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : isToday
                      ? 'border-primary text-primary bg-transparent'
                      : 'border-border text-muted-foreground bg-transparent hover:bg-muted'
                }`}
            >
              {day.slice(0, 3)}
              {isToday && (
                <span className="ml-1 inline-block h-1 w-1 rounded-full bg-current align-middle" />
              )}
            </button>
          )
        })}
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {filteredClasses.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2">
            No classes scheduled for {selectedDay === todayDay ? 'today' : selectedDay}
          </p>
        ) : (
          filteredClasses.map((item, index) => (
            <div
              key={index}
              className="shrink-0 w-[180px] rounded-md bg-muted p-3 space-y-3"
            >
              <div
                className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-medium text-white ${cardColors[index % cardColors.length]}`}
              >
                <Clock className="h-3 w-3" />
                {new Date(item.StartTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' - '}
                {new Date(item.EndTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.Subject}</p>
                <p className="text-xs text-muted-foreground">
                  Class {item.ClassID}, {item.SectionID}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
