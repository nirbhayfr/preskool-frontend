import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useMemo, useState } from 'react'
import { decryptData } from '@/utils/crypto'
import { useFeeSubmissionsByStudent } from '@/hooks/useFeeSubmissions'
import moment from 'moment'

import {
  Wallet,
  BookOpen,
  GraduationCap,
  Monitor,
  Trophy,
  FlaskConical,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { SkeletonCard } from '../extra/SkeletonCardList'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const MONTHS = new Set([
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
])

const TYPE_META = {
  TUITION: { label: 'Tuition', icon: GraduationCap, color: 'text-emerald-500' },
  EXAM: { label: 'Exam', icon: GraduationCap, color: 'text-green-500' },
  LIBRARY: { label: 'Library', icon: BookOpen, color: 'text-indigo-400' },
  COMPUTER: { label: 'Computer', icon: Monitor, color: 'text-blue-400' },
  SPORTS: { label: 'Sports', icon: Trophy, color: 'text-amber-400' },
  LAB: { label: 'Lab', icon: FlaskConical, color: 'text-purple-400' },
  ANNUAL: { label: 'Annual', icon: GraduationCap, color: 'text-teal-500' },
  MISC: { label: 'Misc', icon: Wallet, color: 'text-slate-400' },
}

const MONTH_LABELS = {
  JAN: 'Jan',
  FEB: 'Feb',
  MAR: 'Mar',
  APR: 'Apr',
  MAY: 'May',
  JUN: 'Jun',
  JUL: 'Jul',
  AUG: 'Aug',
  SEP: 'Sep',
  OCT: 'Oct',
  NOV: 'Nov',
  DEC: 'Dec',
}

function parseFeeType(feeType = '') {
  const parts = feeType.toUpperCase().split('_')
  let month = null,
    typeKey = null
  if (parts.length >= 2 && MONTHS.has(parts[0])) {
    month = parts[0]
    typeKey = parts.slice(1).join('_')
  } else {
    typeKey = parts.join('_')
  }
  const meta = TYPE_META[typeKey] || TYPE_META.MISC
  return {
    month: month ? MONTH_LABELS[month] : null,
    label: meta.label,
    icon: meta.icon,
    iconColor: meta.color,
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function FeesReminder() {
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  const { data: feeData, isLoading, isError } = useFeeSubmissionsByStudent(user?.LinkedID)

  const currentMonth = moment().format('YYYY-MM')
  const [selectedMonth, setSelectedMonth] = useState('ALL')

  if (isLoading) return <SkeletonCard />
  if (isError) return <p>Failed to load fees</p>
  if (!feeData?.data) return null

  const fees = feeData.data.map((item) => {
    const parsed = parseFeeType(item.FeeType)
    return {
      ...parsed,
      submissionId: item.SubmissionID,
      transactionId: item.TransactionID,
      originalAmount: item.OriginalAmount,
      discountAmount: item.DiscountAmount || 0,
      paidAmount: item.PaidAmount,
      remainingAmount: item.OriginalAmount - (item.DiscountAmount || 0) - item.PaidAmount,
      paymentMode: item.PaymentMode,
      paymentStatus: item.PaymentStatus,
      submittedDate: moment(item.SubmittedDate).format('DD MMM YYYY'),
      submittedMonth: moment(item.SubmittedDate).format('YYYY-MM'),
      submittedMonthLabel: moment(item.SubmittedDate).format('MMM YYYY'),
      createdAt: moment(item.CreatedAt).format('DD MMM YYYY, h:mm A'),
      submittedBy: item.SubmittedBy,
      remarks: item.Remarks,
      isPaid: item.PaymentStatus === 'SUCCESS',
      isPartial: item.PaymentStatus === 'PARTIAL',
      isDue: item.PaymentStatus !== 'SUCCESS' && item.PaymentStatus !== 'PARTIAL',
    }
  })

  // Unique months from submittedDate, newest first
  const monthOptions = [
    { value: 'ALL', label: 'All' },
    ...[
      ...new Map(
        fees
          .map((f) => ({ value: f.submittedMonth, label: f.submittedMonthLabel }))
          .sort((a, b) => b.value.localeCompare(a.value))
          .map((m) => [m.value, m])
      ).values(),
    ],
  ]

  const filtered =
    selectedMonth === 'ALL'
      ? fees
      : fees.filter((f) => f.submittedMonth === selectedMonth)

  const due = filtered.filter((f) => f.isDue)
  const partial = filtered.filter((f) => f.isPartial)
  const paid = filtered.filter((f) => f.isPaid)

  // Totals for filtered set
  const totalPaid = filtered.reduce((s, f) => s + f.paidAmount, 0)
  const totalOriginal = filtered.reduce((s, f) => s + f.originalAmount, 0)
  const totalDiscount = filtered.reduce((s, f) => s + f.discountAmount, 0)
  const totalPending = filtered.reduce((s, f) => s + Math.max(0, f.remainingAmount), 0)

  return (
    <Card className="w-full min-w-0 rounded-sm">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Fees</CardTitle>
      </CardHeader>

      <CardContent className="px-0 pb-3 overflow-y-auto">
        {/* ── Month filter ── */}
        <div className="flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-none border-b border-border/50">
          {monthOptions.map((m) => {
            const isSelected = m.value === selectedMonth
            const isCurrent = m.value === currentMonth
            return (
              <button
                key={m.value}
                onClick={() => setSelectedMonth(m.value)}
                className={`shrink-0 px-2.5 py-1 mb-2 rounded text-[11px] font-medium transition-colors border ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-muted-foreground border-border hover:bg-muted/60'
                }`}
              >
                {m.label}
                {isCurrent && (
                  <span
                    className={`ml-1 inline-block h-1 w-1 rounded-full align-middle mb-0.5 ${isSelected ? 'bg-background' : 'bg-foreground'}`}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Summary strip ── */}
        <div className="grid grid-cols-4 gap-px bg-border/40 border-b border-border/40">
          <SummaryCell
            label="Total"
            value={`₹${totalOriginal.toLocaleString('en-IN')}`}
          />
          <SummaryCell
            label="Discount"
            value={totalDiscount > 0 ? `-₹${totalDiscount.toLocaleString('en-IN')}` : '—'}
            valueColor="text-blue-500"
          />
          <SummaryCell
            label="Paid"
            value={`₹${totalPaid.toLocaleString('en-IN')}`}
            valueColor="text-emerald-600 dark:text-emerald-500"
          />
          <SummaryCell
            label="Pending"
            value={totalPending > 0 ? `₹${totalPending.toLocaleString('en-IN')}` : '—'}
            valueColor={totalPending > 0 ? 'text-red-500' : undefined}
          />
        </div>

        {/* ── Due ── */}
        {due.length > 0 && (
          <>
            <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-red-500">
              Due
            </p>
            <FeeTable rows={due} variant="due" />
          </>
        )}

        {due.length > 0 && (partial.length > 0 || paid.length > 0) && (
          <div className="border-b border-border/60 my-2" />
        )}

        {/* ── Partial ── */}
        {partial.length > 0 && (
          <>
            <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-500">
              Partial
            </p>
            <FeeTable rows={partial} variant="partial" />
          </>
        )}

        {partial.length > 0 && paid.length > 0 && (
          <div className="border-b border-border/60 my-2" />
        )}

        {/* ── Paid ── */}
        {paid.length > 0 && (
          <>
            <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Paid
            </p>
            <FeeTable rows={paid} variant="paid" />
          </>
        )}

        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            No fee records for this period.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary cell
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCell({ label, value, valueColor }) {
  return (
    <div className="bg-card px-3 py-2">
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-0.5">
        {label}
      </p>
      <p
        className={`text-xs font-semibold tabular-nums ${valueColor || 'text-foreground'}`}
      >
        {value}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Table with expandable rows
// ─────────────────────────────────────────────────────────────────────────────

function FeeTable({ rows, variant }) {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <table className="w-full text-xs border-collapse">
      <tbody>
        {rows.map((item) => {
          const Icon = item.icon
          const hasDiscount = item.discountAmount > 0
          const isExpanded = expandedId === item.submissionId

          const rowBg =
            variant === 'due'
              ? 'bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/70 dark:hover:bg-red-950/20'
              : variant === 'partial'
                ? 'bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/70 dark:hover:bg-amber-950/20'
                : 'hover:bg-muted/30'

          const expandBg =
            variant === 'due'
              ? 'bg-red-50/60 dark:bg-red-950/20'
              : variant === 'partial'
                ? 'bg-amber-50/60 dark:bg-amber-950/20'
                : 'bg-muted/20'

          return (
            <>
              {/* Main row */}
              <tr
                key={item.submissionId}
                onClick={() => setExpandedId(isExpanded ? null : item.submissionId)}
                className={`border-b border-border/40 cursor-pointer transition-colors ${isExpanded ? 'border-b-0' : 'last:border-0'} ${rowBg}`}
              >
                {/* Chevron */}
                <td className="pl-3 pr-1 py-2.5 w-4 align-middle">
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </td>

                {/* Icon */}
                <td className="pr-2 py-2.5 w-5 align-middle">
                  <Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                </td>

                {/* Name + month tag */}
                <td className="px-2 py-2.5 align-middle">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.month && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {item.month}
                      </span>
                    )}
                  </div>
                </td>

                {/* Submitted date */}
                <td className="px-2 py-2.5 text-muted-foreground align-middle whitespace-nowrap">
                  {item.submittedDate}
                </td>

                {/* Amount */}
                <td className="px-2 py-2.5 text-right align-middle tabular-nums">
                  {item.isPartial ? (
                    <div>
                      <span className="font-semibold text-foreground">
                        ₹{item.paidAmount}
                      </span>
                      <span className="block text-[10px] text-amber-500">
                        ₹{item.remainingAmount} left
                      </span>
                    </div>
                  ) : hasDiscount ? (
                    <div>
                      <span className="font-semibold text-foreground">
                        ₹{item.paidAmount}
                      </span>
                      <span className="block text-[10px] text-muted-foreground line-through">
                        ₹{item.originalAmount}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold text-foreground">
                      ₹{item.paidAmount}
                    </span>
                  )}
                </td>

                {/* Mode */}
                <td className="px-2 py-2.5 text-muted-foreground align-middle whitespace-nowrap hidden sm:table-cell">
                  {item.paymentMode}
                </td>

                {/* Status */}
                <td className="pl-2 pr-4 py-2.5 text-right align-middle">
                  {item.isDue ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-500">
                      <Clock className="h-2.5 w-2.5" /> Due
                    </span>
                  ) : item.isPartial ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-500">
                      <Clock className="h-2.5 w-2.5" /> Partial
                    </span>
                  ) : (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 inline-block" />
                  )}
                </td>
              </tr>

              {/* Expanded detail row */}
              {isExpanded && (
                <tr className={`border-b border-border/40 ${expandBg}`}>
                  <td colSpan={7} className="pl-10 pr-4 pt-1 pb-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                      <DetailField
                        label="Transaction ID"
                        value={item.transactionId}
                        mono
                      />
                      <DetailField
                        label="Submission ID"
                        value={`#${item.submissionId}`}
                      />
                      <DetailField label="Submitted by" value={item.submittedBy} />
                      <DetailField
                        label="Original amount"
                        value={`₹${item.originalAmount.toLocaleString('en-IN')}`}
                      />
                      <DetailField
                        label="Paid amount"
                        value={`₹${item.paidAmount.toLocaleString('en-IN')}`}
                        valueColor="text-emerald-600 dark:text-emerald-500"
                      />
                      {hasDiscount && (
                        <DetailField
                          label="Discount"
                          value={`-₹${item.discountAmount.toLocaleString('en-IN')}`}
                          valueColor="text-blue-500"
                        />
                      )}
                      {item.isPartial && (
                        <DetailField
                          label="Remaining"
                          value={`₹${item.remainingAmount.toLocaleString('en-IN')}`}
                          valueColor="text-amber-500"
                        />
                      )}
                      <DetailField label="Payment mode" value={item.paymentMode} />
                      <DetailField label="Payment status" value={item.paymentStatus} />
                      <DetailField label="Created at" value={item.createdAt} />
                      {item.remarks && (
                        <div className="col-span-2 sm:col-span-3">
                          <DetailField label="Remarks" value={item.remarks} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          )
        })}
      </tbody>
    </table>
  )
}

function DetailField({ label, value, mono, valueColor }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-0.5">
        {label}
      </p>
      <p
        className={`text-[11px] font-medium break-all ${valueColor || 'text-foreground'} ${mono ? 'font-mono text-[10px]' : ''}`}
      >
        {value || '—'}
      </p>
    </div>
  )
}
