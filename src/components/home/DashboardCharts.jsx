import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodayAttendanceCount } from '@/hooks/useAttendance'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
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

export default function DashboardChartsSection() {
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

  const { data: attendanceData, isLoading } = useTodayAttendanceCount()
  const attendanceDataArray = attendanceData.Data
  if (isLoading) return <CircleLoader />

  const current = attendanceDataArray.find((tab) => tab.entity === active) || {}
  const present = current.present || 0
  const absent = current.absent || 0
  const total = current.total

  const pieData = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ]

  const PIE_COLORS = ['#3b82f6', '#94a3b8']

  const feeData = [
    { month: 'Jan', collected: 420000, total: 500000 },
    { month: 'Feb', collected: 380000, total: 500000 },
    { month: 'Mar', collected: 460000, total: 500000 },
    { month: 'Apr', collected: 490000, total: 520000 },
    { month: 'May', collected: 510000, total: 520000 },
    { month: 'Jun', collected: 470000, total: 520000 },
    { month: 'Jul', collected: 530000, total: 550000 },
    { month: 'Aug', collected: 540000, total: 550000 },
    { month: 'Sep', collected: 520000, total: 550000 },
    { month: 'Oct', collected: 560000, total: 580000 },
    { month: 'Nov', collected: 570000, total: 580000 },
    { month: 'Dec', collected: 590000, total: 600000 },
  ]

  const hasNonZero = pieData.some((d) => d.value > 0)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 mt-8 items-stretch">
      {/* Bar Chart – Fees */}
      <Card className="min-w-0 rounded-sm h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Fees Collection (2025)
          </CardTitle>
        </CardHeader>

        <CardContent className="h-72 overflow-hidden flex-1">
          <div ref={containerRef} className="w-full h-full">
            {width > 0 && (
              <BarChart width={width} height={380} data={feeData} barGap={6}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={0} />
                <YAxis
                  width={40}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip cursor={false} content={<FeesTooltip />} />
                <Bar dataKey="total" fill="#bfdbfe" isAnimationActive={false} />
                <Bar dataKey="collected" fill="#3b82f6" isAnimationActive={false} />
              </BarChart>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart – Attendance */}
      <Card className="min-w-0 rounded-sm">
        <CardHeader className="space-y-3">
          <CardTitle className="text-base font-semibold">Attendance Overview</CardTitle>

          {/* Toggle */}
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="rounded-md border bg-muted/40 p-3 text-green-600">
              <p className="text-xs ">Present</p>
              <p className="text-xl font-semibold ">{present}</p>
            </div>

            <div className="rounded-md border bg-muted/40 p-3 text-red-600">
              <p className="text-xs ">Absent</p>
              <p className="text-xl font-semibold ">{absent}</p>
            </div>
            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              <p className="text-xs">Total</p>
              <p className="text-xl font-semibold ">{total}</p>
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

const FeesTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border bg-background p-2 text-sm shadow-md">
      <p className="font-medium">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="text-muted-foreground">
          {item.name}:{' '}
          <span className="font-semibold text-foreground">
            ₹{item.value?.toLocaleString()}
          </span>
        </p>
      ))}
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
