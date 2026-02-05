import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAttendanceCountByDate } from '@/hooks/useAttendance'
import { CircleLoader } from '../layout/RouteLoader'
import { cn } from '@/lib/utils'

const entityMap = {
  Student: { img: '/img/icons/student.svg', color: 'emerald' },
  Teacher: { img: '/img/icons/teacher.svg', color: 'blue' },
  Staff: { img: '/img/icons/staff.svg', color: 'amber' },
}

const entityOrder = ['Student', 'Teacher', 'Staff']

const badgeColors = {
  emerald: 'bg-emerald-600',
  blue: 'bg-blue-600',
  amber: 'bg-amber-600',
  red: 'bg-red-600',
}

const imgColors = {
  emerald: 'bg-emerald-300',
  blue: 'bg-blue-300',
  amber: 'bg-amber-300',
}

export default function AttendanceSummaryCards() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const { data, isLoading } = useAttendanceCountByDate(date)

  const enrichedDataArray = useMemo(() => {
    if (!data?.Data) return []

    return data.Data.sort(
      (a, b) => entityOrder.indexOf(a.entity) - entityOrder.indexOf(b.entity)
    ).map((item) => {
      const inactivePercent = item.total > 0 ? (item.absent / item.total) * 100 : 0

      return {
        ...item,
        img: entityMap[item.entity]?.img || '/img/default.png',
        color: entityMap[item.entity]?.color || 'red',
        inactivePercent,
      }
    })
  }, [data])

  if (isLoading) return <CircleLoader />

  return (
    <div className="mt-3 rounded-sm">
      {/* Date Selector */}
      <div className="flex justify-end mb-2 px-3">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-4 px-2">
        {enrichedDataArray.map((item, i) => (
          <Card key={i} className="relative overflow-hidden py-3 rounded-sm">
            <CardContent className="px-4 space-y-3">
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div
                    className={`h-12 w-12 flex items-center justify-center ${imgColors[item.color]}`}
                  >
                    <img src={item.img} alt="" className="h-10 w-10" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold">{item.total}</h2>
                    <p className="text-sm text-muted-foreground">Total {item.entity}</p>
                  </div>
                </div>

                <Badge
                  className={`${badgeColors[item.color]} rounded-sm text-white font-semibold`}
                >
                  {item.inactivePercent.toFixed(2)}%
                </Badge>
              </div>

              {/* Bottom Row */}
              <div
                className={cn(
                  'grid mt-3 border-t pt-2 text-[11px] sm:text-sm',
                  item.entity === 'Student'
                    ? 'grid-cols-2 divide-x'
                    : 'grid-cols-2 sm:grid-cols-4 divide-x'
                )}
              >
                <p className="font-semibold px-2 flex items-center gap-1 whitespace-nowrap">
                  <span className="text-muted-foreground">Present:</span>
                  <span className="text-green-600">{item.present}</span>
                </p>

                <p className="font-semibold px-2 flex items-center gap-1 whitespace-nowrap">
                  <span className="text-muted-foreground">Absent:</span>
                  <span className="text-red-600">{item.absent}</span>
                </p>

                {item.entity !== 'Student' && (
                  <>
                    <p className="font-semibold px-2 flex items-center gap-1 whitespace-nowrap max-sm:mt-1">
                      <span className="text-muted-foreground">Late:</span>
                      <span className="text-yellow-600">{item.late ?? 0}</span>
                    </p>

                    <p className="font-semibold px-2 flex items-center gap-1 whitespace-nowrap max-sm:mt-1">
                      <span className="text-muted-foreground">Half-day:</span>
                      <span className="text-orange-600">{item.halfday ?? 0}</span>
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
