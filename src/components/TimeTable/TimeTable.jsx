import { useRef, useEffect, useState, useMemo } from 'react'
import TimeTableCard from './TimeTableCard'
import { useTeacherTimeTables } from '@/hooks/useTeacherTimeTable'
import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { classes, sections } from '@/data/basicData'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function TimeTable() {
  const [filters, setFilters] = useState({
    classId: 'all',
    sectionId: 'all',
  })

  const dayRefs = useRef({})
  const { data: timetable, isLoading, isError } = useTeacherTimeTables()

  const filteredData = useMemo(() => {
    if (!timetable?.data) return []

    return timetable.data.filter((item) => {
      const classMatch =
        filters.classId === 'all' || !filters.classId
          ? true
          : item.ClassID === filters.classId

      const sectionMatch =
        filters.sectionId === 'all' || !filters.sectionId
          ? true
          : item.SectionID === filters.sectionId

      return classMatch && sectionMatch
    })
  }, [timetable, filters])

  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const day = item.DayOfWeek

      if (!acc[day]) acc[day] = []

      acc[day].push(item)

      // Sort by PeriodNo
      acc[day].sort((a, b) => a.PeriodNo - b.PeriodNo)

      return acc
    }, {})
  }, [filteredData])

  useEffect(() => {
    if (!filteredData.length) return

    const today = new Date().toLocaleString('en-US', {
      weekday: 'long',
    })

    const el = dayRefs.current[today]

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        })
      }, 100)
    }
  }, [filteredData])

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load timetable</p>
  if (!timetable) return null

  return (
    <div className="bg-card rounded-xl shadow-sm p-5">
      <div className="border-b border-border pb-5 mb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}
          <h2 className="text-lg font-semibold text-foreground">Time Table</h2>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end gap-4 w-full lg:w-auto">
            {/* Class Filter */}
            <div className="space-y-2 w-full">
              <Label>Class</Label>
              <Select
                value={filters.classId}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, classId: value }))
                }
              >
                <SelectTrigger className="w-full lg:w-36">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section Filter */}
            <div className="space-y-2 w-full">
              <Label>Section</Label>
              <Select
                value={filters.sectionId}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sectionId: value }))
                }
              >
                <SelectTrigger className="w-full lg:w-36">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {sections.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      Section {sec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full lg:w-auto"
                onClick={() =>
                  setFilters({
                    classId: '',
                    sectionId: '',
                  })
                }
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="mt-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 min-w-max snap-x snap-mandatory">
          {days.map((day) => (
            <div
              key={day}
              ref={(el) => (dayRefs.current[day] = el)}
              className="min-w-60 shrink-0 flex flex-col snap-start"
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">{day}</h3>

              <div className="space-y-3">
                {groupedData[day]?.length ? (
                  groupedData[day].map((item) => (
                    <TimeTableCard key={item.TimeTableID} data={item} />
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No classes</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
