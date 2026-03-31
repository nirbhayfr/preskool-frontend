import { useState, useMemo } from 'react'
import { useStudentsTransportReport } from '@/hooks/useTransportHistory'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  List,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MONTHS = [
  { number: 1, name: 'January' },
  { number: 2, name: 'February' },
  { number: 3, name: 'March' },
  { number: 4, name: 'April' },
  { number: 5, name: 'May' },
  { number: 6, name: 'June' },
  { number: 7, name: 'July' },
  { number: 8, name: 'August' },
  { number: 9, name: 'September' },
  { number: 10, name: 'October' },
  { number: 11, name: 'November' },
  { number: 12, name: 'December' },
]

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

// Flatten owners → vehicles → students into a flat student list
function flattenStudents(owners) {
  const list = []
  owners.forEach((owner) => {
    owner.vehicles.forEach((vehicle) => {
      vehicle.students.forEach((student) => {
        list.push({
          ...student,
          vehicleNo: vehicle.transportNumber,
          feePerStudent: vehicle.feePerStudent ?? student.feePerStudent,
          ownerName: owner.ownerName,
          transporterName: owner.transporterName,
        })
      })
    })
  })
  // Sort by class → section → name
  return list.sort((a, b) => {
    const cls = String(a.class ?? '').localeCompare(String(b.class ?? ''), undefined, { numeric: true })
    if (cls !== 0) return cls
    const sec = String(a.section ?? '').localeCompare(String(b.section ?? ''))
    if (sec !== 0) return sec
    return (a.fullName ?? '').localeCompare(b.fullName ?? '')
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────────────────────────────────────

function getStatusConfig(status, pending) {
  const isOverpaid = Number(pending || 0) < 0
  if (isOverpaid || status === 'PAID') {
    return {
      label: isOverpaid ? 'Excess' : 'Paid',
      icon: CheckCircle2,
      chip: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      bar: 'bg-emerald-500',
      dot: 'bg-emerald-500',
    }
  }
  if (status === 'PARTIAL') {
    return {
      label: 'Partial',
      icon: TrendingUp,
      chip: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      bar: 'bg-amber-400',
      dot: 'bg-amber-400',
    }
  }
  return {
    label: 'Not Paid',
    icon: AlertTriangle,
    chip: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    bar: 'bg-red-400',
    dot: 'bg-red-400',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary Cards
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCards({ students }) {
  const total = students.length
  const paid = students.filter((s) => s.paymentStatus === 'PAID' || Number(s.pendingAmount) < 0).length
  const partial = students.filter((s) => s.paymentStatus === 'PARTIAL' && Number(s.pendingAmount) >= 0).length
  const notPaid = students.filter((s) => s.paymentStatus === 'NOT PAID').length
  const totalCollected = students.reduce((s, r) => s + Number(r.totalPaid || 0), 0)
  const totalPending = students.reduce((s, r) => s + Math.max(0, Number(r.pendingAmount || 0)), 0)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
      {[
        { label: 'Total Students', value: total, icon: Users, color: 'text-foreground' },
        { label: 'Paid', value: paid, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Partial', value: partial, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400' },
        { label: 'Not Paid', value: notPaid, icon: AlertTriangle, color: 'text-red-500 dark:text-red-400' },
        { label: 'Outstanding', value: `₹${fmt(totalPending)}`, icon: Wallet, color: 'text-red-500 dark:text-red-400' },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="rounded-xl border border-border bg-card px-4 py-3.5 flex items-center gap-3">
          <Icon className={`h-5 w-5 shrink-0 ${color}`} />
          <div>
            <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
          </div>
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
        className={`group cursor-pointer transition-colors hover:bg-muted/30 ${open ? 'bg-muted/20' : ''} ${!isLast || open ? 'border-b border-border/60' : ''}`}
      >
        {/* Expand chevron */}
        <td className="pl-4 pr-2 py-3 w-8">
          {open
            ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        </td>

        {/* Student */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-[12px] font-bold text-muted-foreground">
              {student.fullName?.trim().charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-semibold capitalize leading-tight">
                {student.fullName?.trim() || '—'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                ID {student.studentId}
                {student.rollNo && ` · Roll ${student.rollNo}`}
                {student.admissionNo && ` · ${student.admissionNo}`}
              </p>
            </div>
          </div>
        </td>

        {/* Class / Section */}
        <td className="px-3 py-3 hidden sm:table-cell">
          <span className="inline-flex items-center text-xs font-medium bg-muted px-2 py-0.5 rounded">
            {student.class}{student.section}
          </span>
        </td>

        {/* Vehicle / Route */}
        <td className="px-3 py-3 hidden md:table-cell">
          <div>
            {student.vehicleNo && (
              <div className="flex items-center gap-1 text-xs font-medium">
                <Bus className="h-3 w-3 text-muted-foreground" />
                {student.vehicleNo}
              </div>
            )}
            {student.route && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                <MapPin className="h-2.5 w-2.5" />
                <span className="line-clamp-1 max-w-[140px]">{student.matchedRoute || student.route}</span>
              </div>
            )}
          </div>
        </td>

        {/* Fee */}
        <td className="px-3 py-3 text-right hidden sm:table-cell">
          <span className="text-xs font-medium tabular-nums">₹{fmt(fee)}</span>
          {discount > 0 && (
            <p className="text-[10px] text-blue-500 tabular-nums">-₹{fmt(discount)}</p>
          )}
        </td>

        {/* Collected */}
        <td className="px-3 py-3 text-right">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
            ₹{fmt(paid)}
          </span>
        </td>

        {/* Pending */}
        <td className="px-3 py-3 text-right">
          <span className={`text-sm font-bold tabular-nums ${isOverpaid ? 'text-amber-500' : pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {pending !== 0 ? `₹${fmt(pending)}` : '—'}
          </span>
          {isOverpaid && <p className="text-[9px] text-amber-500 font-medium">excess</p>}
        </td>

        {/* Status */}
        <td className="px-3 py-3 pr-4">
          <span className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${sc.chip}`}>
            <StatusIcon className="h-2.5 w-2.5" />
            {sc.label}
          </span>
        </td>
      </tr>

      {/* Expanded detail */}
      {open && (
        <tr>
          <td colSpan={8} className="p-0">
            <div className="bg-muted/10 border-b border-dashed border-border/60 px-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Payment summary */}
                <div className="rounded-lg border border-border bg-card p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Payment Summary
                  </p>
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">Collection</span>
                      <span className="text-[10px] font-semibold">{collPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${sc.bar}`} style={{ width: `${collPct}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Fee per student', value: `₹${fmt(fee)}`, color: '' },
                      { label: 'Total paid', value: `₹${fmt(paid)}`, color: 'text-emerald-600' },
                      { label: 'Discount', value: discount > 0 ? `-₹${fmt(discount)}` : '—', color: 'text-blue-500' },
                      {
                        label: isOverpaid ? 'Excess' : 'Pending',
                        value: pending !== 0 ? `₹${fmt(pending)}` : '—',
                        color: isOverpaid ? 'text-amber-500' : pending > 0 ? 'text-red-500' : 'text-muted-foreground',
                      },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{label}</span>
                        <span className={`text-[11px] font-semibold tabular-nums ${color}`}>{value}</span>
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
                    {[
                      { icon: Calendar, label: 'Last payment', value: fmtDate(student.lastPaymentDate) || '—' },
                      { icon: CreditCard, label: 'Payment mode', value: student.lastPaymentMode || '—' },
                      { icon: Hash, label: 'Total transactions', value: student.totalTxnCount ?? '—' },
                      { icon: Bus, label: 'Vehicle', value: student.vehicleNo || '—' },
                      { icon: MapPin, label: 'Route', value: student.route || '—' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-[9px] text-muted-foreground">{label}</p>
                          <p className="text-xs font-medium leading-snug">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact info */}
                <div className="rounded-lg border border-border bg-card p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Contact Info
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: UserCircle, label: 'Guardian', value: student.guardianName || '—' },
                      { icon: Phone, label: 'Contact', value: student.contactNumber || student.guardianContact || '—' },
                      { icon: Mail, label: 'Email', value: student.parentEmail || '—' },
                      { icon: BadgeInfo, label: 'Admission No.', value: student.admissionNo || '—' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-[9px] text-muted-foreground">{label}</p>
                          <p className="text-xs font-medium truncate max-w-[180px]">{value}</p>
                        </div>
                      </div>
                    ))}
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
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentsTransportReportPage() {
  const { data: raw, isLoading, isError, error } = useStudentsTransportReport()

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const owners = raw?.data || []

  // Flat student list (all students from all owners/vehicles)
  const allStudents = useMemo(() => flattenStudents(owners), [owners])

  // Derived filter options
  const classes = useMemo(
    () => [...new Set(allStudents.map((s) => String(s.class ?? '')).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [allStudents]
  )
  const sections = useMemo(() => {
    const base = classFilter === 'all' ? allStudents : allStudents.filter((s) => String(s.class) === classFilter)
    return [...new Set(base.map((s) => String(s.section ?? '')).filter(Boolean))].sort()
  }, [allStudents, classFilter])

  // Apply filters
  const filtered = useMemo(() => {
    let list = allStudents
    const q = search.trim().toLowerCase()

    if (classFilter !== 'all') list = list.filter((s) => String(s.class) === classFilter)
    if (sectionFilter !== 'all') list = list.filter((s) => String(s.section) === sectionFilter)

    // Month filter — compare against lastPaymentDate month or monthNumber if available
    if (monthFilter !== 'all') {
      list = list.filter((s) => {
        if (s.monthNumber) return String(s.monthNumber) === monthFilter
        if (s.lastPaymentDate) {
          const m = new Date(s.lastPaymentDate).getMonth() + 1
          return String(m) === monthFilter
        }
        return false
      })
    }

    if (statusFilter !== 'all') {
      list = list.filter((s) => {
        if (statusFilter === 'PAID') return s.paymentStatus === 'PAID' || Number(s.pendingAmount) < 0
        if (statusFilter === 'PARTIAL') return s.paymentStatus === 'PARTIAL' && Number(s.pendingAmount) >= 0
        if (statusFilter === 'NOT PAID') return s.paymentStatus === 'NOT PAID'
        return true
      })
    }

    if (q) {
      list = list.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(q) ||
          String(s.studentId).includes(q) ||
          s.route?.toLowerCase().includes(q) ||
          s.admissionNo?.toLowerCase().includes(q) ||
          s.vehicleNo?.toLowerCase().includes(q)
      )
    }

    return list
  }, [allStudents, search, classFilter, sectionFilter, monthFilter, statusFilter])

  const hasFilters = search.trim() || classFilter !== 'all' || sectionFilter !== 'all' || monthFilter !== 'all' || statusFilter !== 'all'

  function clearFilters() {
    setSearch('')
    setClassFilter('all')
    setSectionFilter('all')
    setMonthFilter('all')
    setStatusFilter('all')
  }

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
          <AlertDescription>Failed to load transport report. {error?.message}</AlertDescription>
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
            Fee collection per student · {allStudents.length} total students
          </p>
        </div>
      </div>

      {/* ── Summary ── */}
      {allStudents.length > 0 && <SummaryCards students={allStudents} />}

      {/* ── Filter Bar ── */}
      {allStudents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 justify-between">
          {/* LEFT: Search + Class + Section + Status */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search name, ID, vehicle…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-52 h-8 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Class */}
            <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setSectionFilter('all') }}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Section */}
            <Select value={sectionFilter} onValueChange={setSectionFilter} disabled={classFilter === 'all'}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
              </SelectContent>
            </Select>

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
          </div>

          {/* RIGHT: Count + Clear + Month */}
          <div className="flex items-center gap-2 flex-wrap">
            {hasFilters && (
              <span className="text-xs text-muted-foreground">
                {filtered.length} of {allStudents.length} students
              </span>
            )}
            {hasFilters && (
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}

            {/* Month filter */}
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {MONTHS.map((m) => (
                  <SelectItem key={m.number} value={String(m.number)}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* ── Student List ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
          <Bus className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p className="text-sm font-medium">No students found.</p>
          {hasFilters && <p className="text-xs mt-1 opacity-60">Try adjusting your filters.</p>}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="w-8 pl-4 pr-2 py-2.5" />
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Student
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Class
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Vehicle / Route
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
              {filtered.map((student, idx) => (
                <StudentRow
                  key={`${student.studentId}-${student.vehicleNo}`}
                  student={student}
                  isLast={idx === filtered.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {allStudents.length > 0 && (
        <p className="text-xs text-muted-foreground text-center select-none">
          💡 Click any student row to view payment details
        </p>
      )}
    </div>
  )
}