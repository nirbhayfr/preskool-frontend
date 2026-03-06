import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodayAttendanceCount } from '@/hooks/useAttendance'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useStudentStrength } from '@/hooks/useStudents'
import { Skeleton } from '@/components/ui/skeleton'
import { classes } from '@/data/basicData'
import { CircleLoader } from '../layout/RouteLoader'

export default function DashboardChartsSection() {
  const { data, isLoading } = useStudentStrength()

  const [active, setActive] = useState('Staff')
  const [width, setWidth] = useState(0)

  const containerRef = useRef(null)
  const resizeTimeout = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)

      resizeTimeout.current = setTimeout(() => {
        setWidth(containerRef.current.offsetWidth)
      }, 100)
    }

    const resizeObserver = new ResizeObserver(handleResize)

    resizeObserver.observe(containerRef.current)

    setWidth(containerRef.current.offsetWidth)

    return () => {
      resizeObserver.disconnect()
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
    }
  }, [])

  const chartData = useMemo(() => {
    if (!data) return []

    const map = {}

    data.forEach((item) => {
      const key = String(item.ClassID).replace(/^0+/, '')
      map[key] = item.StudentStrength
    })

    return classes.map((cls) => ({
      class: cls,
      strength: map[cls] || 0,
    }))
  }, [data])

  const { data: attendanceData } = useTodayAttendanceCount()
  const attendanceDataArray = attendanceData?.Data ?? []

  const current = attendanceDataArray.find((tab) => tab.entity === active) || {}

  const present = current.present || 0
  const absent = current.absent || 0
  const total = current.total

  const pieData = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ]

  const PIE_COLORS = ['#3b82f6', '#94a3b8']

  const hasNonZero = pieData.some((d) => d.value > 0)

  console.log(data)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 mt-8 items-stretch">
      {/* Student Strength Chart */}
      <Card className="min-w-0 rounded-sm h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Student Strength By Class
          </CardTitle>
        </CardHeader>

        <CardContent className="h-98">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="class" tick={{ fontSize: 11 }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="strength"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Attendance Pie */}
      <Card className="min-w-0 rounded-sm">
        <CardHeader className="space-y-3">
          <CardTitle className="text-base font-semibold">Attendance Overview</CardTitle>

          <div className="flex gap-2">
            {attendanceDataArray.map((tab) => (
              <button
                key={tab.entity}
                onClick={() => setActive(tab.entity)}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition',
                  active === tab.entity
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                )}
              >
                {tab.entity}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="rounded-md border bg-muted/40 p-3 text-green-600">
              <p className="text-xs">Present</p>
              <p className="text-xl font-semibold">{present}</p>
            </div>

            <div className="rounded-md border bg-muted/40 p-3 text-red-600">
              <p className="text-xs">Absent</p>
              <p className="text-xl font-semibold">{absent}</p>
            </div>

            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              <p className="text-xs">Total</p>
              <p className="text-xl font-semibold">{total}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-72 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {hasNonZero ? (
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
              ) : (
                <Pie
                  data={[{ name: 'No Data', value: 1 }]}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#9ca3af"
                  isAnimationActive={false}
                />
              )}

              {hasNonZero && <Tooltip content={<PieTooltip pieData={pieData} />} />}

              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

const PieTooltip = ({ active, payload, pieData }) => {
  if (!active || !payload?.length) return null

  const { name, value } = payload[0]
  const total = pieData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
      <p className="font-medium">{name}</p>
      <p className="text-muted-foreground">
        {value} ({total ? ((value / total) * 100).toFixed(2) : 0}%)
      </p>
    </div>
  )
}
