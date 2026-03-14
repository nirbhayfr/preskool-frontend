import { useMemo } from 'react'
import { Calendar, Clock, CalendarDays } from 'lucide-react'
import { useEvents } from '@/hooks/useEvent'
import moment from 'moment'
import { Skeleton } from '@/components/ui/skeleton'
import './EventsList.css'

/* ── All original data — untouched ── */
const BORDER_COLORS = [
  'border-blue-500',
  'border-red-500',
  'border-cyan-500',
  'border-emerald-500',
  'border-amber-500',
  'border-purple-500',
]

/* Maps the original border-color slot to a CSS accent class */
const ACCENT_CLASSES = [
  'el-accent-blue',
  'el-accent-red',
  'el-accent-cyan',
  'el-accent-emerald',
  'el-accent-amber',
  'el-accent-purple',
]

/* ── Skeleton ── */
function EventSkeleton() {
  return (
    <div className="el-card el-skeleton-card">
      <div className="el-skeleton-header">
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="el-skeleton-list">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="el-skeleton-row"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main export — all original logic untouched ── */
export function EventsList({ title = 'Events List' }) {
  const { data, isLoading, isError } = useEvents()

  const items = useMemo(() => {
    if (!data?.data) return []
    return data.data.slice().sort((a, b) => moment(a.StartDate).diff(moment(b.StartDate)))
  }, [data?.data])

  const colorMap = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      map[item.EventID] = BORDER_COLORS[item.EventID % BORDER_COLORS.length]
    })
    return map
  }, [items])

  if (isLoading) return <EventSkeleton />

  if (isError) {
    return (
      <div className="el-card">
        <div className="el-header">
          <div className="el-header-left">
            <div className="el-header-icon">
              <CalendarDays />
            </div>
            <span className="el-title">{title}</span>
          </div>
        </div>
        <div className="el-list">
          <p style={{ fontSize: 13, color: '#ef4444', padding: '12px 0' }}>
            Failed to load events.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="el-card">
      {/* Live background */}
      <div className="el-orb el-orb-1" aria-hidden="true" />
      <div className="el-orb el-orb-2" aria-hidden="true" />
      <div className="el-border-spin" aria-hidden="true" />

      {/* Header */}
      <div className="el-header">
        <div className="el-header-left">
          <div className="el-header-icon">
            <CalendarDays />
          </div>
          <span className="el-title">{title}</span>
        </div>
        {items.length > 0 && (
          <span className="el-count-badge">{items.length} events</span>
        )}
      </div>

      {/* Scroll list */}
      <div className="el-list">
        {items.length === 0 && (
          <div className="el-empty">
            <CalendarDays />
            No upcoming events.
          </div>
        )}

        {items.length > 0 && (
          <div className="el-timeline">
            {items.map((item, index) => {
              /* original colour-slot logic untouched */
              const slot = item.EventID % BORDER_COLORS.length
              const accentClass = ACCENT_CLASSES[slot]
              const delay = `${0.06 + index * 0.08}s`
              const dotDelay = `${0.12 + index * 0.08}s`

              const startDay = moment(item.StartDate).format('DD')
              const startMon = moment(item.StartDate).format('MMM')

              return (
                <div
                  key={item.EventID}
                  className={`el-row ${accentClass}`}
                  style={{ animationDelay: delay }}
                >
                  {/* Timeline dot */}
                  <div className="el-dot" style={{ animationDelay: dotDelay }} />

                  {/* Inner card */}
                  <div className="el-inner">
                    {/* Date chip top-right */}
                    <div className="el-date-chip">
                      <span className="el-date-chip-day">{startDay}</span>
                      <span className="el-date-chip-mon">{startMon}</span>
                    </div>

                    {/* Event name */}
                    <p className="el-name" style={{ paddingRight: 44 }}>
                      {item.EventName}
                    </p>

                    {/* Meta */}
                    <div className="el-meta-list">
                      <div className="el-meta-row">
                        <Calendar />
                        <span>
                          {moment(item.StartDate).format('DD-MM-YYYY')}
                          {item.EndDate &&
                            ` — ${moment(item.EndDate).format('DD-MM-YYYY')}`}
                        </span>
                      </div>

                      <div className="el-meta-row">
                        <Clock />
                        <span>
                          {item.PublishedDate
                            ? moment(item.PublishedDate).format('DD-MM-YYYY')
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Scroll hint — only visible when list is tall enough to scroll */}
        {items.length > 3 && (
          <div className="el-scroll-hint">
            <div className="el-scroll-hint-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
