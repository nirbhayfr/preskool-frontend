import { useMemo, useState } from 'react'
import { usePendingFees, useStudentInventoryFees } from '@/hooks/usePendingFees'
import { classes, sections } from '@/data/basicData'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Mail,
  X,
  Users,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  IndianRupee,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Wallet,
  Download,
  FileText,
  Bus,
  BookOpen,
  Package,
  Receipt,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TUITION_TYPES = ['tuition', 'tuitionfee', 'tution', 'tutionfee']

const TRANSPORT_MONTHS = [
  { full: 'january', abbr: 'jan' },
  { full: 'february', abbr: 'feb' },
  { full: 'march', abbr: 'mar' },
  { full: 'april', abbr: 'apr' },
  { full: 'may', abbr: 'may' },
  { full: 'june', abbr: 'jun' },
  { full: 'july', abbr: 'jul' },
  { full: 'august', abbr: 'aug' },
  { full: 'september', abbr: 'sep' },
  { full: 'october', abbr: 'oct' },
  { full: 'november', abbr: 'nov' },
  { full: 'december', abbr: 'dec' },
]

function matchMonth(feeType = '') {
  const t = feeType.toLowerCase()
  return TRANSPORT_MONTHS.find((m) => t.includes(m.full) || t.includes(m.abbr))
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return Number(n || 0).toLocaleString('en-IN')
}

function isTransportFee(feeType = '') {
  const t = feeType.toLowerCase().replace(/[\s_-]/g, '')
  return t.includes('transport') || t.includes('bus') || t.includes('conveyance')
}

function isTuitionFee(feeType = '') {
  const t = feeType.toLowerCase().replace(/[\s_-]/g, '')
  return TUITION_TYPES.some((type) => t.includes(type))
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV Export — main table
// ─────────────────────────────────────────────────────────────────────────────

function exportCSV(students) {
  const rows = [
    [
      'Student ID',
      'Name',
      'Class',
      'Section',
      'Fee Type',
      'Total Fee',
      'Discount',
      'After Discount',
      'Paid',
      'Pending',
      'Status',
    ],
  ]
  students.forEach((student) => {
    student.fees.forEach((fee) => {
      rows.push([
        student.StudentID,
        student.FullName,
        student.ClassID,
        student.SectionID,
        fee.FeeType,
        Number(fee.TotalFee || 0),
        Number(fee.DiscountAmount || 0),
        Number(fee.FeeAfterDiscount || 0),
        Number(fee.PaidAmount || 0),
        Number(fee.PendingAmount || 0),
        fee.PaymentStatus || 'Unpaid',
      ])
    })
  })
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fee-status-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV Export — breakdown tab
// ─────────────────────────────────────────────────────────────────────────────

function exportBreakdownCSV({ studentId, tabLabel, rows }) {
  const headers = ['Fee Type', 'Total', 'Discount', 'Paid', 'Pending', 'Status']
  const data = [
    headers,
    ...rows.map((r) => [r.label, r.total, r.discount, r.paid, r.pending, r.status]),
  ]
  const csv = data
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${studentId}-${tabLabel.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF Export — main table
// ─────────────────────────────────────────────────────────────────────────────

function exportPDF(students, selectedClass, selectedSection) {
  const now = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const subtitle = `Class ${selectedClass}${selectedSection !== 'all' ? ` · Section ${selectedSection}` : ' · All Sections'}`
  const rows = students
    .map((student) => {
      const totalFee = student.fees.reduce((s, f) => s + Number(f.TotalFee || 0), 0)
      const totalPaid = student.fees.reduce((s, f) => s + Number(f.PaidAmount || 0), 0)
      const totalPending = student.fees.reduce(
        (s, f) => s + Number(f.PendingAmount || 0),
        0
      )
      return `<tr>
      <td>#${student.StudentID}</td><td>${student.FullName}</td>
      <td>${student.ClassID} / ${student.SectionID}</td>
      <td style="text-align:right">₹${fmt(totalFee)}</td>
      <td style="text-align:right;color:#16a34a">₹${fmt(totalPaid)}</td>
      <td style="text-align:right;color:${totalPending > 0 ? '#ef4444' : '#6b7280'}">
        ${totalPending > 0 ? `₹${fmt(totalPending)}` : '—'}
      </td>
    </tr>`
    })
    .join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Fee Status Report</title>
  <style>
    body{font-family:'Segoe UI',sans-serif;font-size:13px;color:#111;padding:32px}
    h1{font-size:20px;margin:0 0 4px}p.sub{color:#6b7280;margin:0 0 24px;font-size:12px}
    table{width:100%;border-collapse:collapse}
    th{background:#f3f4f6;text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;border-bottom:2px solid #e5e7eb}
    td{padding:8px 10px;border-bottom:1px solid #f3f4f6}tr:last-child td{border-bottom:none}
    .footer{margin-top:24px;font-size:11px;color:#9ca3af;text-align:right}
  </style></head><body>
  <h1>Fee Status Report</h1><p class="sub">${subtitle} · Generated on ${now}</p>
  <table><thead><tr>
    <th>ID</th><th>Student</th><th>Class / Sec</th>
    <th style="text-align:right">Total Fee</th>
    <th style="text-align:right">Paid</th>
    <th style="text-align:right">Pending</th>
  </tr></thead><tbody>${rows}</tbody></table>
  <div class="footer">Total students: ${students.length}</div>
  </body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.onload = () => {
    win.print()
    win.close()
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF Export — breakdown tab
// ─────────────────────────────────────────────────────────────────────────────

function exportBreakdownPDF({ studentName, studentId, tabLabel, rows }) {
  const now = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const tableRows = rows
    .map(
      (r) => `<tr>
    <td>${r.label}</td>
    <td style="text-align:right">₹${fmt(r.total)}</td>
    <td style="text-align:right;color:#3b82f6">${r.discount > 0 ? `-₹${fmt(r.discount)}` : '—'}</td>
    <td style="text-align:right;color:#16a34a">₹${fmt(r.paid)}</td>
    <td style="text-align:right;color:${r.pending > 0 ? '#ef4444' : '#6b7280'}">${r.pending > 0 ? `₹${fmt(r.pending)}` : '—'}</td>
    <td><span style="padding:2px 8px;border-radius:999px;font-size:11px;
      background:${r.status === 'Paid' ? '#d1fae5' : r.status === 'Partial' ? '#fef3c7' : '#fee2e2'};
      color:${r.status === 'Paid' ? '#065f46' : r.status === 'Partial' ? '#92400e' : '#991b1b'}">
      ${r.status}</span></td>
  </tr>`
    )
    .join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>${tabLabel} Fee Breakdown</title>
  <style>
    body{font-family:'Segoe UI',sans-serif;font-size:13px;color:#111;padding:32px}
    h1{font-size:20px;margin:0 0 2px}p.sub{color:#6b7280;margin:0 0 24px;font-size:12px}
    table{width:100%;border-collapse:collapse}
    th{background:#f3f4f6;text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;border-bottom:2px solid #e5e7eb}
    td{padding:8px 10px;border-bottom:1px solid #f3f4f6}tr:last-child td{border-bottom:none}
    .footer{margin-top:24px;font-size:11px;color:#9ca3af;text-align:right}
  </style></head><body>
  <h1>${tabLabel} Fee Breakdown</h1>
  <p class="sub">${studentName} (#${studentId}) · Generated on ${now}</p>
  <table><thead><tr>
    <th>Fee Type</th>
    <th style="text-align:right">Total</th>
    <th style="text-align:right">Discount</th>
    <th style="text-align:right">Paid</th>
    <th style="text-align:right">Pending</th>
    <th>Status</th>
  </tr></thead><tbody>${tableRows}</tbody></table>
  <div class="footer">Total rows: ${rows.length}</div>
  </body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.onload = () => {
    win.print()
    win.close()
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    Paid: {
      cls: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-100 dark:border-emerald-900',
      icon: <CheckCircle2 className="h-2.5 w-2.5" />,
      label: 'Paid',
    },
    Partial: {
      cls: 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-100 dark:border-amber-900',
      icon: <Clock className="h-2.5 w-2.5" />,
      label: 'Partial',
    },
    Unpaid: {
      cls: 'bg-red-50 dark:bg-red-950 text-red-500 border-red-100 dark:border-red-900',
      icon: <AlertCircle className="h-2.5 w-2.5" />,
      label: 'Unpaid',
    },
  }
  const s = map[status] || map.Unpaid
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${s.cls}`}
    >
      {s.icon} {s.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FeeCard — generic reusable card
// ─────────────────────────────────────────────────────────────────────────────

function FeeCard({ label, status, total, discount, afterDisc, paid, pending }) {
  const pct = afterDisc > 0 ? Math.round((paid / afterDisc) * 100) : 0
  return (
    <div
      className={`rounded-lg px-3 py-2.5 border ${
        status === 'Paid'
          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50'
          : status === 'Partial'
            ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50'
            : 'bg-background border-border/70'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold capitalize">{label}</span>
        <StatusBadge status={status} />
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${status === 'Paid' ? 'bg-emerald-500' : status === 'Partial' ? 'bg-amber-400' : 'bg-red-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-4 gap-1 text-center">
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">Total</p>
          <p className="text-[11px] font-medium tabular-nums">₹{fmt(total)}</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">Discount</p>
          <p className="text-[11px] font-medium text-blue-500 tabular-nums">
            {discount > 0 ? `-₹${fmt(discount)}` : '—'}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">Paid</p>
          <p className="text-[11px] font-semibold text-emerald-600 tabular-nums">
            ₹{fmt(paid)}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">Due</p>
          <p
            className={`text-[11px] font-semibold tabular-nums ${pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            {pending > 0 ? `₹${fmt(pending)}` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TabExportBar — CSV + PDF export buttons shown at the top of each tab
// ─────────────────────────────────────────────────────────────────────────────

function TabExportBar({ studentName, studentId, tabLabel, rows }) {
  if (!rows.length) return null
  return (
    <div className="flex gap-1.5 mb-3 justify-end">
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={() => exportBreakdownCSV({ studentId, tabLabel, rows })}
      >
        <Download className="h-3 w-3" /> CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={() => exportBreakdownPDF({ studentName, studentId, tabLabel, rows })}
      >
        <FileText className="h-3 w-3" /> PDF
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Tuition
// ─────────────────────────────────────────────────────────────────────────────

function TuitionTab({ fees, studentName, studentId }) {
  const tuitionFees = fees.filter((f) => isTuitionFee(f.FeeType))

  const exportRows = tuitionFees.map((f) => ({
    label: f.FeeType,
    total: Number(f.TotalFee || 0),
    discount: Number(f.DiscountAmount || 0),
    paid: Number(f.PaidAmount || 0),
    pending: Number(f.PendingAmount || 0),
    status: f.PaymentStatus || 'Unpaid',
  }))

  if (!tuitionFees.length)
    return (
      <p className="text-xs text-muted-foreground py-4 text-center">
        No tuition fee records found.
      </p>
    )

  return (
    <>
      <TabExportBar
        studentName={studentName}
        studentId={studentId}
        tabLabel="Tuition"
        rows={exportRows}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {tuitionFees.map((fee, idx) => (
          <FeeCard
            key={idx}
            label={fee.FeeType?.replaceAll('_', ' ') || 'Tuition Fee'}
            status={fee.PaymentStatus || 'Unpaid'}
            total={Number(fee.TotalFee || 0)}
            discount={Number(fee.DiscountAmount || 0)}
            afterDisc={Number(fee.FeeAfterDiscount || 0)}
            paid={Number(fee.PaidAmount || 0)}
            pending={Number(fee.PendingAmount || 0)}
          />
        ))}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Transport
// Shows ALL 12 months. Months present in payload show real data (paid/partial/
// unpaid). Months NOT in payload show as Unpaid placeholders.
// ─────────────────────────────────────────────────────────────────────────────

function TransportTab({ fees, studentName, studentId }) {
  const transportFees = fees.filter((f) => isTransportFee(f.FeeType))

  // abbr → fee row for months that exist in the payload
  const monthFeeMap = {}
  transportFees.forEach((f) => {
    const m = matchMonth(f.FeeType)
    if (m) monthFeeMap[m.abbr] = f
  })

  // Transport fees with no recognisable month (e.g. a flat "Transport" entry)
  const monthlessFees = transportFees.filter((f) => !matchMonth(f.FeeType))

  // Export rows: all 12 months + monthless entries
  const exportRows = [
    ...TRANSPORT_MONTHS.map((m) => {
      const f = monthFeeMap[m.abbr]
      return f
        ? {
            label: f.FeeType,
            total: Number(f.TotalFee || 0),
            discount: Number(f.DiscountAmount || 0),
            paid: Number(f.PaidAmount || 0),
            pending: Number(f.PendingAmount || 0),
            status: f.PaymentStatus || 'Unpaid',
          }
        : {
            label: `${m.full.charAt(0).toUpperCase() + m.full.slice(1)} Transport`,
            total: 0,
            discount: 0,
            paid: 0,
            pending: 0,
            status: 'Unpaid',
          }
    }),
    ...monthlessFees.map((f) => ({
      label: f.FeeType,
      total: Number(f.TotalFee || 0),
      discount: Number(f.DiscountAmount || 0),
      paid: Number(f.PaidAmount || 0),
      pending: Number(f.PendingAmount || 0),
      status: f.PaymentStatus || 'Unpaid',
    })),
  ]

  return (
    <div className="space-y-4">
      <TabExportBar
        studentName={studentName}
        studentId={studentId}
        tabLabel="Transport"
        rows={exportRows}
      />

      {/* Monthless transport entries (e.g. flat "Transport Fee") */}
      {monthlessFees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {monthlessFees.map((fee, idx) => (
            <FeeCard
              key={idx}
              label={fee.FeeType?.replaceAll('_', ' ') || 'Transport'}
              status={fee.PaymentStatus || 'Unpaid'}
              total={Number(fee.TotalFee || 0)}
              discount={Number(fee.DiscountAmount || 0)}
              afterDisc={Number(fee.FeeAfterDiscount || 0)}
              paid={Number(fee.PaidAmount || 0)}
              pending={Number(fee.PendingAmount || 0)}
            />
          ))}
        </div>
      )}

      {/* All 12 months grid */}
      <div>
        {monthlessFees.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Monthly breakdown
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
          {TRANSPORT_MONTHS.map((m) => {
            const fee = monthFeeMap[m.abbr]

            if (fee) {
              // ── Real entry from payload ──
              const total = Number(fee.TotalFee || 0)
              const discount = Number(fee.DiscountAmount || 0)
              const afterDis = Number(fee.FeeAfterDiscount || total - discount)
              const paid = Number(fee.PaidAmount || 0)
              const pending = Number(fee.PendingAmount || 0)
              const status = fee.PaymentStatus || 'Unpaid'
              const pct = afterDis > 0 ? Math.round((paid / afterDis) * 100) : 0

              return (
                <div
                  key={m.abbr}
                  className={`rounded-lg px-3 py-2.5 border ${
                    status === 'Paid'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50'
                      : status === 'Partial'
                        ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50'
                        : 'bg-background border-border/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold capitalize">{m.full}</span>
                    <StatusBadge status={status} />
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full ${status === 'Paid' ? 'bg-emerald-500' : status === 'Partial' ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-center">
                    <div>
                      <p className="text-[9px] text-muted-foreground">Paid</p>
                      <p className="text-[11px] font-semibold text-emerald-600 tabular-nums">
                        ₹{fmt(paid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground">Due</p>
                      <p
                        className={`text-[11px] font-semibold tabular-nums ${pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        {pending > 0 ? `₹${fmt(pending)}` : '—'}
                      </p>
                    </div>
                  </div>
                  {total > 0 && (
                    <p className="text-[9px] text-muted-foreground text-center mt-1 tabular-nums">
                      Total ₹{fmt(total)}
                      {discount > 0 ? ` · -₹${fmt(discount)} disc.` : ''}
                    </p>
                  )}
                </div>
              )
            }

            // ── Missing month — Unpaid placeholder ──
            return (
              <div
                key={m.abbr}
                className="rounded-lg px-3 py-2.5 border bg-red-50/30 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold capitalize">{m.full}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Transport Fee
                  </p>
                </div>
                <StatusBadge status="Unpaid" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: One-Time Fees
// ─────────────────────────────────────────────────────────────────────────────

function OneTimeTab({ fees, studentName, studentId }) {
  const oneTimeFees = fees.filter(
    (f) => !isTuitionFee(f.FeeType) && !isTransportFee(f.FeeType)
  )

  const exportRows = oneTimeFees.map((f) => ({
    label: f.FeeType,
    total: Number(f.TotalFee || 0),
    discount: Number(f.DiscountAmount || 0),
    paid: Number(f.PaidAmount || 0),
    pending: Number(f.PendingAmount || 0),
    status: f.PaymentStatus || 'Unpaid',
  }))

  if (!oneTimeFees.length)
    return (
      <p className="text-xs text-muted-foreground py-4 text-center">
        No one-time fee records found.
      </p>
    )

  return (
    <>
      <TabExportBar
        studentName={studentName}
        studentId={studentId}
        tabLabel="One-Time"
        rows={exportRows}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {oneTimeFees.map((fee, idx) => (
          <FeeCard
            key={idx}
            label={fee.FeeType?.replaceAll('_', ' ') || 'Fee'}
            status={fee.PaymentStatus || 'Unpaid'}
            total={Number(fee.TotalFee || 0)}
            discount={Number(fee.DiscountAmount || 0)}
            afterDisc={Number(fee.FeeAfterDiscount || 0)}
            paid={Number(fee.PaidAmount || 0)}
            pending={Number(fee.PendingAmount || 0)}
          />
        ))}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Inventory — fetches from useStudentInventoryFees hook
// Response: { fees: [{ feeId, feeType, originalAmount, paymentStatus,
//   paidAmount, discountAmount, remainingAmount, academicYear,
//   paymentMode, submittedDate, remarks }], summary: { ... } }
// ─────────────────────────────────────────────────────────────────────────────

function InventoryTab({ studentId, studentName }) {
  const { data, isLoading, isError } = useStudentInventoryFees(studentId)

  if (isLoading)
    return (
      <div className="flex justify-center py-6">
        <CircleLoader />
      </div>
    )

  if (isError)
    return (
      <p className="text-xs text-red-500 py-4 text-center">
        Failed to load inventory fees.
      </p>
    )

  const items = data?.fees || []

  const exportRows = items.map((item) => ({
    label: item.feeType,
    total: Number(item.originalAmount || 0),
    discount: Number(item.discountAmount || 0),
    paid: Number(item.paidAmount || 0),
    pending: Number(item.remainingAmount || 0),
    status: item.paymentStatus || 'Unpaid',
  }))

  if (!items.length)
    return (
      <p className="text-xs text-muted-foreground py-4 text-center">
        No inventory fee records found.
      </p>
    )

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        {/* Summary strip */}
        {data?.summary && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>{data.summary.totalFees} items</span>
            <span className="text-emerald-600 font-medium">
              Paid ₹{fmt(data.summary.totalPaid)}
            </span>
            <span className="text-red-500 font-medium">
              Pending ₹{fmt(data.summary.totalPending)}
            </span>
          </div>
        )}
        <TabExportBar
          studentName={studentName}
          studentId={studentId}
          tabLabel="Inventory"
          rows={exportRows}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {items.map((item, idx) => {
          const total = Number(item.originalAmount || 0)
          const discount = Number(item.discountAmount || 0)
          const paid = Number(item.paidAmount || 0)
          const pending = Number(item.remainingAmount || 0)
          const status = item.paymentStatus || 'Unpaid'
          const afterDis = total - discount
          const pct = afterDis > 0 ? Math.round((paid / afterDis) * 100) : 0

          return (
            <div
              key={idx}
              className={`rounded-lg px-3 py-2.5 border ${
                status === 'Paid'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50'
                  : status === 'Partial'
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50'
                    : 'bg-background border-border/70'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <p className="text-xs font-semibold capitalize">
                    {item.feeType?.replaceAll('_', ' ')}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {item.academicYear}
                    {item.paymentMode && ` · ${item.paymentMode}`}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>

              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${status === 'Paid' ? 'bg-emerald-500' : status === 'Partial' ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-center">
                <div>
                  <p className="text-[9px] text-muted-foreground mb-0.5">Total</p>
                  <p className="text-[11px] font-medium tabular-nums">₹{fmt(total)}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground mb-0.5">Discount</p>
                  <p className="text-[11px] font-medium text-blue-500 tabular-nums">
                    {discount > 0 ? `-₹${fmt(discount)}` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground mb-0.5">Paid</p>
                  <p className="text-[11px] font-semibold text-emerald-600 tabular-nums">
                    ₹{fmt(paid)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground mb-0.5">Due</p>
                  <p
                    className={`text-[11px] font-semibold tabular-nums ${pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    {pending > 0 ? `₹${fmt(pending)}` : '—'}
                  </p>
                </div>
              </div>

              {item.submittedDate && (
                <p className="text-[9px] text-muted-foreground text-right mt-1.5 border-t border-border/40 pt-1">
                  Paid on{' '}
                  {new Date(item.submittedDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Fee Detail Panel — tabbed
// ─────────────────────────────────────────────────────────────────────────────

const FEE_TABS = [
  { id: 'all', label: 'All', icon: Wallet },
  { id: 'tuition', label: 'Tuition', icon: BookOpen },
  { id: 'transport', label: 'Transport', icon: Bus },
  { id: 'onetime', label: 'One-Time', icon: Receipt },
  { id: 'inventory', label: 'Inventory', icon: Package },
]

function AllTab({ fees, studentName, studentId }) {
  const { data, isLoading } = useStudentInventoryFees(studentId)

  // Normalize main fees
  const normalFees = fees.map((f) => ({
    label: f.FeeType,
    total: Number(f.TotalFee || 0),
    discount: Number(f.DiscountAmount || 0),
    afterDisc: Number(f.FeeAfterDiscount || 0),
    paid: Number(f.PaidAmount || 0),
    pending: Number(f.PendingAmount || 0),
    status: f.PaymentStatus || 'Unpaid',
    type: 'Academic',
  }))

  // Normalize inventory fees
  const inventoryFees =
    data?.fees?.map((item) => ({
      label: item.feeType,
      total: Number(item.originalAmount || 0),
      discount: Number(item.discountAmount || 0),
      afterDisc: Number(item.originalAmount || 0) - Number(item.discountAmount || 0),
      paid: Number(item.paidAmount || 0),
      pending: Number(item.remainingAmount || 0),
      status: item.paymentStatus || 'Unpaid',
      type: 'Inventory',
    })) || []

  const allFees = [...normalFees, ...inventoryFees]

  const exportRows = allFees.map((f) => ({
    label: `[${f.type}] ${f.label}`,
    total: f.total,
    discount: f.discount,
    paid: f.paid,
    pending: f.pending,
    status: f.status,
  }))

  if (!fees.length && !inventoryFees.length)
    return (
      <p className="text-xs text-muted-foreground py-4 text-center">
        No fee records found.
      </p>
    )

  return (
    <>
      <TabExportBar
        studentName={studentName}
        studentId={studentId}
        tabLabel="All"
        rows={exportRows}
      />

      {isLoading && (
        <div className="flex justify-center py-4">
          <CircleLoader />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {allFees.map((fee, idx) => (
          <div key={idx} className="relative">
            {/* Type badge
            <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {fee.type}
            </span> */}

            <FeeCard
              label={fee.label?.replaceAll('_', ' ')}
              status={fee.status}
              total={fee.total}
              discount={fee.discount}
              afterDisc={fee.afterDisc}
              paid={fee.paid}
              pending={fee.pending}
            />
          </div>
        ))}
      </div>
    </>
  )
}

function FeeDetailPanel({ fees, studentId, studentName }) {
  const [activeTab, setActiveTab] = useState('tuition')

  return (
    <tr>
      <td colSpan={8} className="p-0">
        <div className="bg-muted/20 px-6 py-4 border-t border-dashed border-border/60">
          {/* Tab bar */}
          <div className="flex gap-1 mb-4 border-b border-border/50">
            {FEE_TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-md -mb-px border transition-colors ${
                    activeTab === tab.id
                      ? 'border-border border-b-background bg-background text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {activeTab === 'all' && (
            <AllTab fees={fees} studentName={studentName} studentId={studentId} />
          )}

          {activeTab === 'tuition' && (
            <TuitionTab fees={fees} studentName={studentName} studentId={studentId} />
          )}
          {activeTab === 'transport' && (
            <TransportTab fees={fees} studentName={studentName} studentId={studentId} />
          )}
          {activeTab === 'onetime' && (
            <OneTimeTab fees={fees} studentName={studentName} studentId={studentId} />
          )}
          {activeTab === 'inventory' && (
            <InventoryTab studentId={studentId} studentName={studentName} />
          )}
        </div>
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, colorClass, iconBg, iconColor }) {
  const Icon = icon
  return (
    <Card className="py-4 px-5">
      <CardContent className="p-0 flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${colorClass}`}>{label}</p>
          <p className={`text-2xl font-bold mt-0.5 ${colorClass}`}>{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <div
          className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function PendingFeesPage() {
  const [selectedClass, setSelectedClass] = useState(classes[0] || '')
  const [selectedSection, setSelectedSection] = useState('all')
  const [minPending, setMinPending] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [statusFilter, setStatusFilter] = useState('all')

  const toggleRow = (id) =>
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const resetAll = () => setExpandedRows(new Set())

  const filters = useMemo(() => {
    if (!selectedClass) return null
    return selectedSection === 'all'
      ? { ClassID: selectedClass }
      : { ClassID: selectedClass, SectionID: selectedSection }
  }, [selectedClass, selectedSection])

  const { data, isLoading, isError, error } = usePendingFees(filters)
  const tableData = data?.data || []

  const groupedStudents = useMemo(() => {
    if (!tableData.length) return []
    const map = {}
    tableData.forEach((row) => {
      if (!map[row.StudentID]) {
        map[row.StudentID] = {
          StudentID: row.StudentID,
          FullName: row.FullName,
          ClassID: row.ClassID,
          SectionID: row.SectionID,
          fees: [],
        }
      }
      map[row.StudentID].fees.push(row)
    })
    return Object.values(map)
  }, [tableData])

  const filteredStudents = useMemo(() => {
    let list = groupedStudents
    if (statusFilter !== 'all')
      list = list.filter((s) => s.fees.some((f) => f.PaymentStatus === statusFilter))
    if (minPending) {
      const min = Number(minPending)
      list = list.filter(
        (s) => s.fees.reduce((sum, f) => sum + Number(f.PendingAmount || 0), 0) >= min
      )
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(
        (s) =>
          String(s.StudentID).toLowerCase().includes(q) ||
          s.FullName.toLowerCase().includes(q)
      )
    }
    return list
  }, [groupedStudents, minPending, searchQuery, statusFilter])

  const summary = useMemo(() => {
    if (!tableData.length) return null
    const students = new Set(tableData.map((r) => r.StudentID)).size
    const totalFee = tableData.reduce((s, r) => s + Number(r.TotalFee || 0), 0)
    const totalDiscount = tableData.reduce((s, r) => s + Number(r.DiscountAmount || 0), 0)
    const totalPaid = tableData.reduce((s, r) => s + Number(r.PaidAmount || 0), 0)
    const totalPending = tableData.reduce((s, r) => s + Number(r.PendingAmount || 0), 0)
    const paidFees = tableData.filter((r) => r.PaymentStatus === 'Paid').length
    const partialFees = tableData.filter((r) => r.PaymentStatus === 'Partial').length
    const unpaidFees = tableData.filter((r) => r.PaymentStatus === 'Unpaid').length
    return {
      students,
      totalFee,
      totalDiscount,
      totalPaid,
      totalPending,
      paidFees,
      partialFees,
      unpaidFees,
    }
  }, [tableData])

  const hasActiveFilters = minPending || searchQuery.trim() || statusFilter !== 'all'

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircleLoader />
      </div>
    )

  if (isError)
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load fees. {error?.message}</AlertDescription>
        </Alert>
      </div>
    )

  return (
    <div className="p-6 space-y-5 w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fee Status</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectedClass
              ? `Class ${selectedClass}${selectedSection !== 'all' ? ` · Section ${selectedSection}` : ' · All Sections'}`
              : 'Select a class to view fees'}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {filteredStudents.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => exportCSV(filteredStudents)}
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() =>
                  exportPDF(filteredStudents, selectedClass, selectedSection)
                }
              >
                <FileText className="h-3.5 w-3.5" /> PDF
              </Button>
            </>
          )}

          <Select
            value={selectedClass}
            onValueChange={(v) => {
              setSelectedClass(v)
              resetAll()
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedSection}
            onValueChange={(v) => {
              setSelectedSection(v)
              resetAll()
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map((sec) => (
                <SelectItem key={sec} value={sec}>
                  Section {sec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {summary && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Total Fee"
              value={`₹${fmt(summary.totalFee)}`}
              sub={`Discount: ₹${fmt(summary.totalDiscount)}`}
              icon={Wallet}
              colorClass="text-slate-600"
              iconBg="bg-slate-100 dark:bg-slate-800"
              iconColor="text-slate-500"
            />
            <StatCard
              label="Total Paid"
              value={`₹${fmt(summary.totalPaid)}`}
              sub={`${summary.paidFees} fees fully paid`}
              icon={TrendingUp}
              colorClass="text-emerald-600"
              iconBg="bg-emerald-50 dark:bg-emerald-950"
              iconColor="text-emerald-500"
            />
            <StatCard
              label="Total Pending"
              value={`₹${fmt(summary.totalPending)}`}
              sub={`${summary.unpaidFees} unpaid · ${summary.partialFees} partial`}
              icon={TrendingDown}
              colorClass="text-red-500"
              iconBg="bg-red-50 dark:bg-red-950"
              iconColor="text-red-400"
            />
            <StatCard
              label="Students"
              value={summary.students}
              sub={`in class ${selectedClass}`}
              icon={Users}
              colorClass="text-blue-600"
              iconBg="bg-blue-50 dark:bg-blue-950"
              iconColor="text-blue-500"
            />
          </div>

          {(() => {
            const total = summary.paidFees + summary.partialFees + summary.unpaidFees
            const paidPct = total > 0 ? (summary.paidFees / total) * 100 : 0
            const partialPct = total > 0 ? (summary.partialFees / total) * 100 : 0
            const unpaidPct = total > 0 ? (summary.unpaidFees / total) * 100 : 0
            return (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Fee Status Breakdown ({total} total fee rows)</span>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-medium">
                      {summary.paidFees} Paid
                    </span>
                    <span className="text-amber-500 font-medium">
                      {summary.partialFees} Partial
                    </span>
                    <span className="text-red-500 font-medium">
                      {summary.unpaidFees} Unpaid
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted">
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${paidPct}%` }}
                  />
                  <div
                    className="bg-amber-400 h-full transition-all"
                    style={{ width: `${partialPct}%` }}
                  />
                  <div
                    className="bg-red-400 h-full transition-all"
                    style={{ width: `${unpaidPct}%` }}
                  />
                </div>
              </div>
            )
          })()}
        </>
      )}

      {/* ── Filter Bar ── */}
      {groupedStudents.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-56 h-8 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="relative">
            <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="number"
              placeholder="Min pending"
              value={minPending}
              onChange={(e) => setMinPending(e.target.value)}
              min={0}
              className="pl-8 w-40 h-8 text-sm"
            />
            {minPending && (
              <button
                onClick={() => setMinPending('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex gap-1">
            {['all', 'Unpaid', 'Partial', 'Paid'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  statusFilter === s
                    ? s === 'Paid'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : s === 'Partial'
                        ? 'bg-amber-400 text-white border-amber-400'
                        : s === 'Unpaid'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground/40'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <span className="text-xs text-muted-foreground">
              {filteredStudents.length} of {groupedStudents.length} students
            </span>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                setStatusFilter('all')
                setMinPending('')
                setSearchQuery('')
              }}
            >
              <X className="h-3 w-3 mr-1" /> Clear filters
            </Button>
          )}
          {expandedRows.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => setExpandedRows(new Set())}
            >
              Collapse all
            </Button>
          )}
          <p className="text-xs text-muted-foreground ml-auto hidden lg:block select-none">
            💡 Click any row to view fee breakdown
          </p>
        </div>
      )}

      {/* ── Table ── */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
          <IndianRupee className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p className="text-sm font-medium">No students found.</p>
          <p className="text-xs mt-1 opacity-60">
            {hasActiveFilters ? 'Try adjusting your filters.' : 'All dues are cleared!'}
          </p>
        </div>
      ) : (
        <div className="w-full rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="w-10 px-3 py-3" />
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">
                  Total Fee
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">
                  Paid
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">
                  Pending
                </th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => {
                const isExpanded = expandedRows.has(student.StudentID)
                const totalFee = student.fees.reduce(
                  (s, f) => s + Number(f.TotalFee || 0),
                  0
                )
                const totalDisc = student.fees.reduce(
                  (s, f) => s + Number(f.DiscountAmount || 0),
                  0
                )
                const totalPaid = student.fees.reduce(
                  (s, f) => s + Number(f.PaidAmount || 0),
                  0
                )
                const totalPending = student.fees.reduce(
                  (s, f) => s + Number(f.PendingAmount || 0),
                  0
                )
                const paidCount = student.fees.filter(
                  (f) => f.PaymentStatus === 'Paid'
                ).length
                const partialCount = student.fees.filter(
                  (f) => f.PaymentStatus === 'Partial'
                ).length
                const unpaidCount = student.fees.filter(
                  (f) => f.PaymentStatus === 'Unpaid'
                ).length
                const isLast = idx === filteredStudents.length - 1

                return (
                  <>
                    <tr
                      key={student.StudentID}
                      onClick={() => toggleRow(student.StudentID)}
                      className={`group cursor-pointer transition-colors ${!isLast || isExpanded ? 'border-b border-border' : ''} ${isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20'}`}
                    >
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded text-muted-foreground group-hover:text-foreground transition-colors">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{student.StudentID}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-sm leading-tight">
                          {student.FullName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Class {student.ClassID} · Section {student.SectionID}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2 py-0.5 border transition-opacity ${paidCount > 0 ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-100 dark:border-emerald-900' : 'bg-muted text-muted-foreground border-border opacity-40'}`}
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" /> {paidCount} paid
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2 py-0.5 border transition-opacity ${partialCount > 0 ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-100 dark:border-amber-900' : 'bg-muted text-muted-foreground border-border opacity-40'}`}
                          >
                            <Clock className="h-2.5 w-2.5" /> {partialCount} partial
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2 py-0.5 border transition-opacity ${unpaidCount > 0 ? 'bg-red-50 dark:bg-red-950 text-red-500 border-red-100 dark:border-red-900' : 'bg-muted text-muted-foreground border-border opacity-40'}`}
                          >
                            <AlertCircle className="h-2.5 w-2.5" /> {unpaidCount} unpaid
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-medium tabular-nums">
                          ₹{fmt(totalFee)}
                        </span>
                        {totalDisc > 0 && (
                          <p className="text-[10px] text-blue-500 tabular-nums">
                            -₹{fmt(totalDisc)} disc.
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-emerald-600 font-semibold text-sm tabular-nums">
                          ₹{fmt(totalPaid)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`font-bold text-sm tabular-nums ${totalPending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                        >
                          {totalPending > 0 ? `₹${fmt(totalPending)}` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Send reminder"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                          >
                            <Link to={`/pay-fees/${student.StudentID}`}>
                              Pay <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <FeeDetailPanel
                        fees={student.fees}
                        studentId={student.StudentID}
                        studentName={student.FullName}
                      />
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
