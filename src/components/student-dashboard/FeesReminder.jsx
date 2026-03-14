import { useMemo } from 'react'
import { decryptData } from '@/utils/crypto'
import { useFeeSubmissionsByStudent } from '@/hooks/useFeeSubmissions'
import moment from 'moment'
import { SkeletonCard } from '../extra/SkeletonCardList'
import './FeesReminder.css'

import {
  Wallet,
  BookOpen,
  GraduationCap,
  Monitor,
  Trophy,
  FlaskConical,
  Landmark,
  Check,
} from 'lucide-react'

/* ── All existing data maps — untouched ── */
const feeTypeMeta = {
  MISC: { title: 'Misc Fees', icon: Wallet, color: 'slate' },
  LIBRARY: { title: 'Library Fees', icon: BookOpen, color: 'indigo' },
  EXAM: { title: 'Exam Fees', icon: GraduationCap, color: 'green' },
  COMPUTER: { title: 'Computer Fees', icon: Monitor, color: 'blue' },
  SPORTS: { title: 'Sports Fees', icon: Trophy, color: 'amber' },
  LAB: { title: 'Lab Fees', icon: FlaskConical, color: 'purple' },
  ANNUAL: { title: 'Annual Fees', icon: GraduationCap, color: 'emerald' },
}

/* accent hex values for CSS custom property — light/dark friendly */
const accentHex = {
  blue: '#3b82f6',
  green: '#22c55e',
  indigo: '#6366f1',
  amber: '#f59e0b',
  purple: '#a855f7',
  emerald: '#10b981',
  slate: '#64748b',
}

export function FeesReminder() {
  /* ── Existing logic — untouched ── */
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  const { data: feeData, isLoading, isError } = useFeeSubmissionsByStudent(user?.LinkedID)

  if (isLoading) return <SkeletonCard />
  if (isError) return <p>Failed to load student</p>
  if (!feeData?.data) return null

  const fees = feeData.data.map((item) => {
    const meta = feeTypeMeta[item.FeeType] || feeTypeMeta.ANNUAL
    return {
      title: meta.title,
      amount: `₹${item.PaidAmount}`,
      rawAmount: Number(item.PaidAmount) || 0,
      date: moment(item.SubmittedDate).format('DD MMM YYYY'),
      icon: meta.icon,
      color: meta.color,
      status: item.PaymentStatus !== 'SUCCESS' ? 'Due' : null,
    }
  })

  /* max amount for relative progress bars */
  const maxAmt = Math.max(...fees.map((f) => f.rawAmount), 1)

  return (
    <div className="fr-card">
      {/* ── Header ── */}
      <div className="fr-header">
        <div className="fr-header-left">
          <div className="fr-header-icon">
            <Landmark />
          </div>
          <span className="fr-title">Fees Reminder</span>
        </div>
        <span className="fr-count-badge">{fees.length} items</span>
      </div>

      {/* ── List ── */}
      <div className="fr-list">
        {fees.length === 0 && <div className="fr-empty">No fee records found.</div>}

        {fees.map((item, index) => {
          const Icon = item.icon
          const accent = accentHex[item.color] || '#3b82f6'
          const progress = Math.round((item.rawAmount / maxAmt) * 100)
          const delay = `${0.05 + index * 0.07}s`

          return (
            <div
              key={index}
              className="fr-row"
              style={{
                '--fr-accent': accent,
                '--fr-progress': `${progress}%`,
                animationDelay: delay,
              }}
            >
              {/* Icon */}
              <div className="fr-icon-box">
                <Icon />
              </div>

              {/* Text */}
              <div className="fr-text">
                <p className="fr-fee-name">{item.title}</p>

                <div className="fr-date-row">
                  {item.status ? (
                    <span className="fr-badge-due">
                      <span className="fr-badge-due-dot" />
                      Due
                    </span>
                  ) : (
                    <span className="fr-badge-paid">Paid · {item.date}</span>
                  )}
                </div>

                {/* Progress bar — only for paid */}
                {!item.status && (
                  <div className="fr-progress-track">
                    <div
                      className="fr-progress-bar"
                      style={{ animationDelay: `${0.3 + index * 0.07}s` }}
                    />
                  </div>
                )}
              </div>

              {/* Amount + check */}
              <div className="fr-amount-wrap">
                <span className="fr-amount fr-amount-accent">{item.amount}</span>
                {!item.status && (
                  <div className="fr-check">
                    <Check strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
