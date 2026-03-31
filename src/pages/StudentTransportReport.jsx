import { useState, useMemo } from 'react'
import { useStudentsTransportReport } from '@/hooks/useTransportHistory'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Bus,
  ChevronDown,
  ChevronRight,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Search,
  X,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Hash,
  BadgeInfo,
  Wallet,
  BarChart3,
  UserCircle,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return Math.abs(Number(n || 0)).toLocaleString('en-IN')
}

function pct(a, b) {
  if (!b || b <= 0) return 0
  return Math.min(100, Math.round((a / b) * 100))
}

function fmtDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function capitalize(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment status config
// ─────────────────────────────────────────────────────────────────────────────

function getStatusConfig(status, pending) {
  const isOverpaid = Number(pending || 0) < 0
  if (isOverpaid || status === 'PAID') {
    return {
      label: isOverpaid ? 'Excess' : 'Paid',
      icon: CheckCircle2,
      chip: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      bar: 'bg-emerald-500',
    }
  }
  if (status === 'PARTIAL') {
    return {
      label: 'Partial',
      icon: TrendingUp,
      chip: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      bar: 'bg-amber-400',
    }
  }
  return {
    label: 'Not Paid',
    icon: AlertTriangle,
    chip: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    bar: 'bg-red-400',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Global Summary
// ─────────────────────────────────────────────────────────────────────────────

function GlobalSummary({ data, totalStudents }) {
  const totalEst = data.reduce((s, o) => s + Number(o.totalEstimated || 0), 0)
  const totalPaid = data.reduce((s, o) => s + Number(o.totalPaid || 0), 0)
  const totalPending = data.reduce(
    (s, o) => s + Math.max(0, Number(o.totalPending || 0)),
    0
  )
  const totalExcess = data.reduce(
    (s, o) => s + Math.abs(Math.min(0, Number(o.totalPending || 0))),
    0
  )
  const collRate = pct(totalPaid, totalEst)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
      {[
        {
          label: 'Total Students',
          value: totalStudents,
          sub: `across ${data.length} owners`,
          icon: Users,
          val: 'text-foreground',
        },
        {
          label: 'Total Estimated',
          value: `₹${fmt(totalEst)}`,
          sub: null,
          icon: Wallet,
          val: 'text-foreground',
        },
        {
          label: 'Total Collected',
          value: `₹${fmt(totalPaid)}`,
          sub: `${collRate}% collection rate`,
          icon: TrendingUp,
          val: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          label: 'Outstanding',
          value: `₹${fmt(totalPending)}`,
          sub: 'pending from students',
          icon: TrendingDown,
          val: 'text-red-500 dark:text-red-400',
        },
        {
          label: 'Excess Collected',
          value: `₹${fmt(totalExcess)}`,
          sub: 'overpaid by students',
          icon: TrendingUp,
          val: 'text-amber-600 dark:text-amber-400',
        },
      ].map(({ label, value, sub, icon: Icon, val }) => (
        <div key={label} className="rounded-xl border border-border bg-card px-4 py-3.5">
          <Icon className="h-4 w-4 text-muted-foreground mb-2" />
          <p className={`text-xl font-bold tabular-nums ${val}`}>{value}</p>
          {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Row
// ─────────────────────────────────────────────────────────────────────────────

function StudentRow({ student, isLast }) {
  const [open, setOpen] = useState(false)

  const pending = Number(student.pendingAmount || 0)
  const paid = Number(student.totalPaid || 0)
  const fee = Number(student.feePerStudent || 0)
  const discount = Number(student.totalDiscount || 0)
  const isOverpaid = pending < 0
  const sc = getStatusConfig(student.paymentStatus, pending)
  const StatusIcon = sc.icon
  const collPct = pct(paid, fee)

  return (
    <>
      <tr
        onClick={() => setOpen((v) => !v)}
        className={`group cursor-pointer transition-colors ${!isLast || open ? 'border-b border-border/60' : ''} hover:bg-muted/30 ${open ? 'bg-muted/20' : ''}`}
      >
        {/* Chevron */}
        <td className="pl-4 pr-2 py-3 text-center w-8">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </td>

        {/* Student */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {student.fullName?.trim().charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold capitalize leading-tight">
                {student.fullName?.trim() || '—'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Cl. {student.class}
                {student.section} · #{student.studentId}
                {student.rollNo && ` · Roll ${student.rollNo}`}
              </p>
            </div>
          </div>
        </td>

        {/* Route */}
        <td className="px-3 py-3 hidden md:table-cell">
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-xs text-muted-foreground leading-snug line-clamp-2 max-w-[160px]">
              {student.matchedRoute || student.route}
            </span>
          </div>
        </td>

        {/* Fee */}
        <td className="px-3 py-3 text-right hidden sm:table-cell">
          <span className="text-xs font-medium tabular-nums">₹{fmt(fee)}</span>
          {discount > 0 && (
            <p className="text-[10px] text-blue-500 tabular-nums">-₹{fmt(discount)}</p>
          )}
        </td>

        {/* Paid */}
        <td className="px-3 py-3 text-right">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
            ₹{fmt(paid)}
          </span>
        </td>

        {/* Pending / Excess */}
        <td className="px-3 py-3 text-right">
          <span
            className={`text-sm font-bold tabular-nums ${
              isOverpaid
                ? 'text-amber-500'
                : pending > 0
                  ? 'text-red-500'
                  : 'text-muted-foreground'
            }`}
          >
            {pending !== 0 ? `₹${fmt(pending)}` : '—'}
          </span>
          {isOverpaid && <p className="text-[9px] text-amber-500 font-medium">excess</p>}
        </td>

        {/* Status */}
        <td className="px-3 py-3 pr-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${sc.chip}`}
          >
            <StatusIcon className="h-2.5 w-2.5" />
            {sc.label}
          </span>
        </td>
      </tr>

      {/* Expanded detail */}
      {open && (
        <tr>
          <td colSpan={7} className="p-0">
            <div className="bg-muted/10 border-b border-dashed border-border/60 px-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Payment summary */}
                <div className="rounded-lg border border-border bg-card p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Payment Summary
                  </p>
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">
                        Collection
                      </span>
                      <span className="text-[10px] font-semibold">{collPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sc.bar}`}
                        style={{ width: `${collPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Fee per student', value: `₹${fmt(fee)}`, color: '' },
                      {
                        label: 'Total paid',
                        value: `₹${fmt(paid)}`,
                        color: 'text-emerald-600',
                      },
                      {
                        label: 'Discount',
                        value: discount > 0 ? `-₹${fmt(discount)}` : '—',
                        color: 'text-blue-500',
                      },
                      {
                        label: isOverpaid ? 'Excess' : 'Pending',
                        value: pending !== 0 ? `₹${fmt(pending)}` : '—',
                        color: isOverpaid
                          ? 'text-amber-500'
                          : pending > 0
                            ? 'text-red-500'
                            : 'text-muted-foreground',
                      },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{label}</span>
                        <span
                          className={`text-[11px] font-semibold tabular-nums ${color}`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction info */}
                <div className="rounded-lg border border-border bg-card p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Transaction Info
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">Last payment</p>
                        <p className="text-xs font-medium">
                          {fmtDate(student.lastPaymentDate) || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">Payment mode</p>
                        <p className="text-xs font-medium">
                          {student.lastPaymentMode || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">
                          Total transactions
                        </p>
                        <p className="text-xs font-medium">
                          {student.totalTxnCount ?? '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">Route</p>
                        <p className="text-xs font-medium leading-snug">
                          {student.route || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="rounded-lg border border-border bg-card p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Contact Info
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">Guardian</p>
                        <p className="text-xs font-medium">
                          {student.guardianName || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">Contact</p>
                        <p className="text-xs font-medium">
                          {student.contactNumber || student.guardianContact || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">Email</p>
                        <p className="text-xs font-medium truncate max-w-[180px]">
                          {student.parentEmail || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[9px] text-muted-foreground">Admission No.</p>
                        <p className="text-xs font-medium">
                          {student.admissionNo || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle Table
// ─────────────────────────────────────────────────────────────────────────────

function VehicleTable({ vehicle }) {
  const [open, setOpen] = useState(false)
  const pending = Number(vehicle.totalPending || 0)
  const paid = Number(vehicle.totalPaid || 0)
  const est = Number(vehicle.totalEstimated || 0)
  const collPct = pct(paid, est)
  const isOverpaid = pending < 0

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Vehicle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 dark:bg-slate-200 flex items-center justify-center">
            <Bus className="h-4 w-4 text-white dark:text-slate-800" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold tracking-wide">{vehicle.transportNumber}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {vehicle.totalStudents} students · ₹{fmt(vehicle.feePerStudent)}/student
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-5">
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground">Collected</p>
              <p className="text-xs font-bold text-emerald-600 tabular-nums">
                ₹{fmt(paid)}
              </p>
            </div>
            {pending !== 0 && (
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground">
                  {isOverpaid ? 'Excess' : 'Pending'}
                </p>
                <p
                  className={`text-xs font-bold tabular-nums ${isOverpaid ? 'text-amber-500' : 'text-red-500'}`}
                >
                  ₹{fmt(pending)}
                </p>
              </div>
            )}
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground">Collection</p>
              <p className="text-xs font-bold tabular-nums">{collPct}%</p>
            </div>
          </div>
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Students table */}
      {open && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/20 border-b border-border">
              <th className="w-8 pl-4 pr-2 py-2.5" />
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Student
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Route
              </th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Fee
              </th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Collected
              </th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Pending
              </th>
              <th className="px-3 py-2.5 pr-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicle.students.map((student, idx) => (
              <StudentRow
                key={student.studentId}
                student={student}
                isLast={idx === vehicle.students.length - 1}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Owner Section
// ─────────────────────────────────────────────────────────────────────────────

function OwnerSection({ owner }) {
  const [open, setOpen] = useState(false)
  const pending = Number(owner.totalPending || 0)
  const paid = Number(owner.totalPaid || 0)
  const est = Number(owner.totalEstimated || 0)
  const isOverpaid = pending < 0
  const collPct = pct(paid, est)

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      {/* Owner header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-card hover:bg-muted/20 transition-colors border-b border-border"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {owner.ownerName.charAt(0)}
            </span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold">{owner.ownerName}</h3>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {owner.transporterName}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> {owner.totalStudents} students
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bus className="h-3 w-3" /> {owner.vehicles.length} vehicle
                {owner.vehicles.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                <BarChart3 className="h-3 w-3 text-muted-foreground" /> {collPct}%
                collected
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground">Estimated</p>
            <p className="text-sm font-bold tabular-nums">₹{fmt(est)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Collected</p>
            <p className="text-sm font-bold text-emerald-600 tabular-nums">
              ₹{fmt(paid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">
              {isOverpaid ? 'Excess' : 'Pending'}
            </p>
            <p
              className={`text-sm font-bold tabular-nums ${isOverpaid ? 'text-amber-500' : pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              {pending !== 0 ? `₹${fmt(pending)}` : '—'}
            </p>
          </div>
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Collection progress bar */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${collPct}%` }}
        />
      </div>

      {/* Vehicles */}
      {open && (
        <div className="p-4 space-y-3 bg-muted/5">
          {owner.vehicles.map((vehicle, vIdx) => (
            <VehicleTable key={vIdx} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentsTransportReportPage() {
  const { data: raw, isLoading, isError, error } = useStudentsTransportReport()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | PAID | PARTIAL | NOT PAID

  const owners = raw?.data || []

  // Filter: search + status applied at student level, bubble up
  const filtered = useMemo(() => {
    if (!owners.length) return []
    const q = search.trim().toLowerCase()

    return owners
      .map((owner) => {
        const filteredVehicles = owner.vehicles
          .map((vehicle) => {
            const filteredStudents = vehicle.students.filter((s) => {
              const matchSearch =
                !q ||
                s.fullName?.toLowerCase().includes(q) ||
                String(s.studentId).includes(q) ||
                s.route?.toLowerCase().includes(q) ||
                s.admissionNo?.toLowerCase().includes(q)

              const matchStatus =
                statusFilter === 'all' ||
                (statusFilter === 'PAID' &&
                  (s.paymentStatus === 'PAID' || Number(s.pendingAmount) < 0)) ||
                (statusFilter === 'PARTIAL' &&
                  s.paymentStatus === 'PARTIAL' &&
                  Number(s.pendingAmount) >= 0) ||
                (statusFilter === 'NOT PAID' && s.paymentStatus === 'NOT PAID')

              return matchSearch && matchStatus
            })
            return { ...vehicle, students: filteredStudents }
          })
          .filter((v) => v.students.length > 0)

        return { ...owner, vehicles: filteredVehicles }
      })
      .filter((o) => o.vehicles.length > 0)
  }, [owners, search, statusFilter])

  const totalMatchedStudents = useMemo(
    () =>
      filtered.reduce(
        (s, o) => s + o.vehicles.reduce((vs, v) => vs + v.students.length, 0),
        0
      ),
    [filtered]
  )
  const totalStudents = raw?.totalStudents || 0
  const hasFilters = search.trim() || statusFilter !== 'all'

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
          <AlertDescription>
            Failed to load transport report. {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    )

  return (
    <div className="p-6 space-y-5 w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Transport Report</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fee collection per student across all vehicles and routes
          </p>
        </div>
      </div>

      {/* ── Summary ── */}
      {owners.length > 0 && <GlobalSummary data={owners} totalStudents={totalStudents} />}

      {/* ── Filter bar ── */}
      {owners.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search student, route, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-60 h-8 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Status pills */}
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'PAID', label: 'Paid' },
              { id: 'PARTIAL', label: 'Partial' },
              { id: 'NOT PAID', label: 'Not Paid' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  statusFilter === id
                    ? id === 'PAID'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : id === 'PARTIAL'
                        ? 'bg-amber-400 text-white border-amber-400'
                        : id === 'NOT PAID'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {hasFilters && (
            <span className="text-xs text-muted-foreground">
              {totalMatchedStudents} of {totalStudents} students
            </span>
          )}

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
              }}
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}

          <p className="text-xs text-muted-foreground ml-auto hidden lg:block select-none">
            💡 Click any student row for details
          </p>
        </div>
      )}

      {/* ── Owner sections ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
          <Bus className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p className="text-sm font-medium">No students found.</p>
          {hasFilters && (
            <p className="text-xs mt-1 opacity-60">Try adjusting your filters.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((owner) => (
            <OwnerSection key={owner.ownerName} owner={owner} />
          ))}
        </div>
      )}
    </div>
  )
}
