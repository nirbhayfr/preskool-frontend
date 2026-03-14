import { FileText, Bell } from 'lucide-react'
import { useNotices } from '@/hooks/useNoticeBoard'
import { SkeletonCard } from '../extra/SkeletonCardList'
import './NoticeBoard.css'

export function NoticeBoard({ title = 'Notices' }) {
  /* ── All original logic — untouched ── */
  const { data: notice, isLoading, isError } = useNotices()

  if (isLoading) return <SkeletonCard rows={4} />

  if (isError) {
    return (
      <div className="nb-wrap">
        <div className="nb-aurora" aria-hidden="true" />
        <div className="nb-grid" aria-hidden="true" />
        <div className="nb-border-spin" aria-hidden="true" />
        <div className="nb-header">
          <div className="nb-header-left">
            <div className="nb-header-icon">
              <Bell />
            </div>
            <span className="nb-title">{title}</span>
          </div>
        </div>
        <div className="nb-list">
          <div className="nb-empty">
            <Bell />
            Failed to load notices.
          </div>
        </div>
      </div>
    )
  }

  if (!notice?.data || notice.data.length === 0) {
    return (
      <div className="nb-wrap">
        <div className="nb-aurora" aria-hidden="true" />
        <div className="nb-grid" aria-hidden="true" />
        <div className="nb-border-spin" aria-hidden="true" />
        <div className="nb-header">
          <div className="nb-header-left">
            <div className="nb-header-icon">
              <Bell />
            </div>
            <span className="nb-title">{title}</span>
          </div>
        </div>
        <div className="nb-list">
          <div className="nb-empty">
            <Bell />
            No notices available.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="nb-wrap">
      {/* ── Live background — same as LeaveStatus ── */}
      <div className="nb-aurora" aria-hidden="true" />
      <div className="nb-grid" aria-hidden="true" />
      <div className="nb-border-spin" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="nb-header">
        <div className="nb-header-left">
          <div className="nb-header-icon">
            <Bell />
          </div>
          <span className="nb-title">{title}</span>
        </div>

        {/* original View All button */}
        <button className="nb-view-btn">View All</button>
      </div>

      {/* ── Scrollable list ── */}
      <div className="nb-list">
        {/* original notice.data.map — untouched */}
        {notice.data.map((item, index) => (
          <div
            key={item.NoticeID}
            className="nb-row"
            style={{ animationDelay: `${0.07 + index * 0.08}s` }}
          >
            {/* shimmer layer */}
            <div className="nb-row-shimmer" aria-hidden="true" />

            {/* Icon */}
            <div className="nb-icon-box">
              <FileText />
            </div>

            {/* Text — original fields untouched */}
            <div className="nb-text">
              <p className="nb-desc">{item.Description || '—'}</p>
              <span className="nb-classes">Classes: {item.Classes || 'All'}</span>
            </div>
          </div>
        ))}

        {/* scroll hint */}
        {notice.data.length > 3 && (
          <div className="nb-scroll-hint">
            <div className="nb-hint-dots">
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
