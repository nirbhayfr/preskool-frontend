import { useState, useEffect, useRef } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import './StatisticsCard.css'

/* ── All original data — untouched ── */
const statisticsData = [
  { month: 'Jan', avgScore: 35, avgAttendance: 95 },
  { month: 'Feb', avgScore: 78, avgAttendance: 60 },
  { month: 'Mar', avgScore: 92, avgAttendance: 88 },
  { month: 'Apr', avgScore: 50, avgAttendance: 72 },
  { month: 'May', avgScore: 40, avgAttendance: 98 },
  { month: 'Jun', avgScore: 100, avgAttendance: 55 },
]

/* ── Animated count-up hook ── */
function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    let start = null
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * target))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])
  return value
}

/* ── Derived stats ── */
const avgScore = Math.round(
  statisticsData.reduce((s, d) => s + d.avgScore, 0) / statisticsData.length
)
const avgAttendance = Math.round(
  statisticsData.reduce((s, d) => s + d.avgAttendance, 0) / statisticsData.length
)
const peakScore = Math.max(...statisticsData.map((d) => d.avgScore))
const peakAttend = Math.max(...statisticsData.map((d) => d.avgAttendance))

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="sc-tooltip">
      <p className="sc-tooltip-month">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="sc-tooltip-row">
          <span className="sc-tooltip-label">
            <span className="sc-tooltip-swatch" style={{ background: p.stroke }} />
            {p.dataKey === 'avgScore' ? 'Score' : 'Attend.'}
          </span>
          <span className="sc-tooltip-val" style={{ color: p.stroke }}>
            {p.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── Animated stat tile ── */
function StatTile({ label, value, suffix = '%', delay = 0 }) {
  const counted = useCountUp(value, 1000, 300 + delay)
  return (
    <div className="sc-tile">
      <span className="sc-tile-label">{label}</span>
      <span className="sc-tile-value">
        <span>{counted}</span>
        {suffix}
      </span>
    </div>
  )
}

/* ── Main export ── */
export function StatisticsCard() {
  return (
    <div className="sc-wrap col-span-1 sm:col-span-2 h-full">
      {/* Live background layers */}
      <div className="sc-orb sc-orb-1" aria-hidden="true" />
      <div className="sc-orb sc-orb-2" aria-hidden="true" />
      <div className="sc-orb sc-orb-3" aria-hidden="true" />
      <div className="sc-grid-bg" aria-hidden="true" />
      <div className="sc-border-spin" aria-hidden="true" />

      {/* Content */}
      <div className="sc-content">
        {/* Header */}
        <div className="sc-header">
          <div className="sc-header-left">
            <h3 className="sc-title">Statistics</h3>
            <span className="sc-subtitle">Jan – Jun 2024</span>
          </div>
          <div className="sc-live">
            <span className="sc-live-dot" />
            Live
          </div>
        </div>

        {/* Stat tiles */}
        <div className="sc-tiles">
          <StatTile label="Avg Score" value={avgScore} delay={0} />
          <StatTile label="Avg Attend." value={avgAttendance} delay={80} />
          <StatTile label="Peak Score" value={peakScore} delay={160} />
          <StatTile label="Peak Attend" value={peakAttend} delay={240} />
        </div>

        {/* Legend */}
        <div className="sc-legend">
          <div className="sc-legend-pill sc-pill-score">
            <span className="sc-pill-dot" />
            Avg Score
          </div>
          <div className="sc-legend-pill sc-pill-attend">
            <span className="sc-pill-dot" />
            Avg Attendance
          </div>
        </div>

        {/* Chart — all original props untouched */}
        <div className="sc-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={statisticsData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--sc-grid)" strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                stroke="var(--sc-sub)"
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: 'var(--sc-grid)' }}
                tickLine={false}
              />
              <YAxis
                stroke="var(--sc-sub)"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Score line */}
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{
                  r: 6,
                  fill: '#3B82F6',
                  stroke: '#fff',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 0 6px #3B82F6)',
                }}
                animationDuration={1400}
                animationEasing="ease-out"
              />

              {/* Attendance line */}
              <Line
                type="monotone"
                dataKey="avgAttendance"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{
                  r: 6,
                  fill: '#06b6d4',
                  stroke: '#fff',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 0 6px #06b6d4)',
                }}
                animationDuration={1600}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
