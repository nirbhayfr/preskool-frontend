import { Calendar, CheckCircle, XCircle, AlertCircle, ClipboardList } from 'lucide-react'
import './LeaveStatus.css'

/* ── All original data — completely untouched ── */
const leaveData = [
  {
    id: 1,
    type: 'Emergency Leave',
    date: '15 Jun 2024',
    status: 'Pending',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'blue',
  },
  {
    id: 2,
    type: 'Medical Leave',
    date: '15 Jun 2024',
    status: 'Approved',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'blue',
  },
  {
    id: 3,
    type: 'Medical Leave',
    date: '16 Jun 2024',
    status: 'Declined',
    icon: <XCircle className="h-4 w-4" />,
    color: 'red',
  },
  {
    id: 4,
    type: 'Fever',
    date: '16 Jun 2024',
    status: 'Approved',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'blue',
  },
]

/* stripe colour per status — feeds --ls-stripe CSS variable */
const stripeColor = {
  Approved: '#3b82f6',
  Pending: '#f59e0b',
  Declined: '#ef4444',
}

/* summary counts */
function summarise(data) {
  return data.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    return acc
  }, {})
}

export function LeaveStatus({ title = 'Leave Status' }) {
  const counts = summarise(leaveData)

  return (
    <div className="ls-wrap">
      {/* ── Live background ── */}
      <div className="ls-aurora" aria-hidden="true" />
      <div className="ls-grid" aria-hidden="true" />
      <div className="ls-border-spin" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="ls-header">
        <div className="ls-header-left">
          <div className="ls-header-icon">
            <ClipboardList />
          </div>
          <span className="ls-title">{title}</span>
        </div>

        {/* summary pills */}
        <div className="ls-summary">
          {counts.Approved && (
            <span className="ls-pill ls-pill-approved">{counts.Approved} approved</span>
          )}
          {counts.Pending && (
            <span className="ls-pill ls-pill-pending">{counts.Pending} pending</span>
          )}
          {counts.Declined && (
            <span className="ls-pill ls-pill-declined">{counts.Declined} declined</span>
          )}
        </div>
      </div>

      {/* ── List ── */}
      <div className="ls-list">
        {leaveData.map((leave, index) => {
          const accent = stripeColor[leave.status] || '#6366f1'
          const delay = `${0.07 + index * 0.08}s`

          return (
            <div
              key={leave.id}
              className="ls-row"
              style={{
                '--ls-stripe': accent,
                animationDelay: delay,
              }}
            >
              {/* shimmer layer */}
              <div className="ls-row-shimmer" aria-hidden="true" />

              {/* Icon */}
              <div className="ls-icon-box">{leave.icon}</div>

              {/* Text */}
              <div className="ls-text">
                <p className="ls-type">{leave.type}</p>
                <p className="ls-date">
                  <Calendar />
                  {leave.date}
                </p>
              </div>

              {/* Status badge */}
              <div className="ls-status">
                <span className={`ls-badge ls-badge-${leave.status.toLowerCase()}`}>
                  {leave.status === 'Pending' && <span className="ls-badge-dot" />}
                  {leave.status}
                </span>
              </div>
            </div>
          )
        })}

        {/* scroll hint when many items */}
        {leaveData.length > 3 && (
          <div className="ls-scroll-hint">
            <div className="ls-hint-dots">
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
