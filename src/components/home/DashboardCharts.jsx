import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodayAttendanceCount } from '@/hooks/useAttendance'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'
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

export default function DashboardChartsSection() {
  const { data, isLoading } = useStudentStrength()

  const [active, setActive] = useState('Staff')

  const { chartData, sections } = useMemo(() => {
    if (!data) return { chartData: [], sections: [] }

    const sectionSet = new Set()

    data.forEach((cls) => {
      cls.sections.forEach((s) => {
        sectionSet.add(s.section)
      })
    })

    const sections = Array.from(sectionSet).sort()

    const map = {}

    data.forEach((cls) => {
      const key = String(cls.class).replace(/^0+/, '')

      map[key] = {}

      cls.sections.forEach((s) => {
        map[key][s.section] = s.strength
      })
    })

    const chartData = classes.map((cls) => {
      const row = { class: cls }

      sections.forEach((section) => {
        row[section] = map[cls]?.[section] || 0
      })

      return row
    })

    return { chartData, sections }
  }, [data])

  /*
  ----------------------------------
  Attendance Pie
  ----------------------------------
  */

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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 mt-8 items-stretch">
      {/* Student Strength Chart */}

      <Card className="min-w-0 rounded-sm h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Student Strength By Class
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[320px] sm:h-[360px]">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="class"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />

                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={28} />

                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    padding: '10px 12px',
                  }}
                  labelStyle={{
                    color: '#e5e7eb',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                  itemStyle={{
                    color: '#f1f5f9',
                    fontSize: '13px',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />

                <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="bottom" />

                {sections.map((section, index) => (
                  <Bar
                    key={section}
                    dataKey={section}
                    stackId="a"
                    fill={SECTION_COLORS[index % SECTION_COLORS.length]}
                    maxBarSize={30}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                ))}
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

const SECTION_COLORS = ['#3b82f6', '#ef4444', '#8b5cf6', '#22c55e', '#f59e0b']

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
