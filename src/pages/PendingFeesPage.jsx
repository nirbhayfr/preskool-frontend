import { useMemo, useState } from 'react'
import { usePendingFees } from '@/hooks/usePendingFees'
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
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Badge by PaymentStatus
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Paid:    { cls: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-100 dark:border-emerald-900', icon: <CheckCircle2 className="h-2.5 w-2.5" />, label: 'Paid' },
    Partial: { cls: 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-100 dark:border-amber-900',         icon: <Clock        className="h-2.5 w-2.5" />, label: 'Partial' },
    Unpaid:  { cls: 'bg-red-50 dark:bg-red-950 text-red-500 border-red-100 dark:border-red-900',                   icon: <AlertCircle  className="h-2.5 w-2.5" />, label: 'Unpaid' },
  }
  const s = map[status] || map.Unpaid
  return (
    <span className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Fee Detail Panel
// ─────────────────────────────────────────────────────────────────────────────
function FeeDetailPanel({ fees }) {
  return (
    <tr>
      <td colSpan={8} className="p-0">
        <div className="bg-muted/20 px-6 py-4 border-t border-dashed border-border/60">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Fee Breakdown
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {fees.map((fee, idx) => {
              const total    = Number(fee.TotalFee         || 0)
              const discount = Number(fee.DiscountAmount   || 0)
              const afterDis = Number(fee.FeeAfterDiscount || 0)
              const paid     = Number(fee.PaidAmount       || 0)
              const pending  = Number(fee.PendingAmount    || 0)
              const status   = fee.PaymentStatus || 'Unpaid'
              const pct      = afterDis > 0 ? Math.round((paid / afterDis) * 100) : 0

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
                  {/* Top row: label + status badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold capitalize">
                      {fee.FeeType?.replaceAll('_', ' ')}
                    </span>
                    <StatusBadge status={status} />
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        status === 'Paid' ? 'bg-emerald-500' : status === 'Partial' ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Amount grid */}
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div>
                      <p className="text-[9px] text-muted-foreground mb-0.5">Total</p>
                      <p className="text-[11px] font-medium tabular-nums">₹{total.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground mb-0.5">Discount</p>
                      <p className="text-[11px] font-medium text-blue-500 tabular-nums">
                        {discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground mb-0.5">Paid</p>
                      <p className="text-[11px] font-semibold text-emerald-600 tabular-nums">
                        ₹{paid.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground mb-0.5">Due</p>
                      <p className={`text-[11px] font-semibold tabular-nums ${pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {pending > 0 ? `₹${pending.toLocaleString('en-IN')}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, colorClass, iconBg, iconColor }) {
  return (
    <Card className="py-4 px-5">
      <CardContent className="p-0 flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${colorClass}`}>{label}</p>
          <p className={`text-2xl font-bold mt-0.5 ${colorClass}`}>{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <div className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center`}>
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
  const [selectedClass,   setSelectedClass]   = useState(classes[0] || '')
  const [selectedSection, setSelectedSection] = useState('all')
  const [minPending,      setMinPending]      = useState('')
  const [searchQuery,     setSearchQuery]     = useState('')
  const [expandedRows,    setExpandedRows]    = useState(new Set())
  const [statusFilter,    setStatusFilter]    = useState('all') // all | Unpaid | Partial | Paid

  const toggleRow = (id) =>
    setExpandedRows(prev => {
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

  // ── Group rows by student ──
  const groupedStudents = useMemo(() => {
    if (!tableData.length) return []
    const map = {}
    tableData.forEach(row => {
      if (!map[row.StudentID]) {
        map[row.StudentID] = {
          StudentID: row.StudentID,
          FullName:  row.FullName,
          ClassID:   row.ClassID,
          SectionID: row.SectionID,
          fees: [],
        }
      }
      map[row.StudentID].fees.push(row)
    })
    return Object.values(map)
  }, [tableData])

  // ── Apply filters ──
  const filteredStudents = useMemo(() => {
    let list = groupedStudents

    // Filter by student-level status (has any fee in that status)
    if (statusFilter !== 'all') {
      list = list.filter(s => s.fees.some(f => f.PaymentStatus === statusFilter))
    }

    // Min pending
    if (minPending) {
      const min = Number(minPending)
      list = list.filter(s =>
        s.fees.reduce((sum, f) => sum + Number(f.PendingAmount || 0), 0) >= min
      )
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(s =>
        String(s.StudentID).toLowerCase().includes(q) ||
        s.FullName.toLowerCase().includes(q)
      )
    }

    return list
  }, [groupedStudents, minPending, searchQuery, statusFilter])

  // ── Summary ──
  const summary = useMemo(() => {
    if (!tableData.length) return null
    const students = new Set(tableData.map(r => r.StudentID)).size
    const totalFee      = tableData.reduce((s, r) => s + Number(r.TotalFee         || 0), 0)
    const totalDiscount = tableData.reduce((s, r) => s + Number(r.DiscountAmount   || 0), 0)
    const totalPaid     = tableData.reduce((s, r) => s + Number(r.PaidAmount       || 0), 0)
    const totalPending  = tableData.reduce((s, r) => s + Number(r.PendingAmount    || 0), 0)
    const paidFees      = tableData.filter(r => r.PaymentStatus === 'Paid').length
    const partialFees   = tableData.filter(r => r.PaymentStatus === 'Partial').length
    const unpaidFees    = tableData.filter(r => r.PaymentStatus === 'Unpaid').length
    return { students, totalFee, totalDiscount, totalPaid, totalPending, paidFees, partialFees, unpaidFees }
  }, [tableData])

  const hasActiveFilters = minPending || searchQuery.trim() || statusFilter !== 'all'

  if (isLoading)
    return <div className="flex justify-center items-center h-[60vh]"><CircleLoader /></div>

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
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedClass} onValueChange={v => { setSelectedClass(v); resetAll() }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Class" /></SelectTrigger>
            <SelectContent>
              {classes.map(cls => <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSection} onValueChange={v => { setSelectedSection(v); resetAll() }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Section" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map(sec => <SelectItem key={sec} value={sec}>Section {sec}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {summary && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Total Fee"    value={`₹${summary.totalFee.toLocaleString('en-IN')}`}
              sub={`Discount: ₹${summary.totalDiscount.toLocaleString('en-IN')}`}
              icon={Wallet}
              colorClass="text-slate-600"
              iconBg="bg-slate-100 dark:bg-slate-800" iconColor="text-slate-500"
            />
            <StatCard
              label="Total Paid"   value={`₹${summary.totalPaid.toLocaleString('en-IN')}`}
              sub={`${summary.paidFees} fees fully paid`}
              icon={TrendingUp}
              colorClass="text-emerald-600"
              iconBg="bg-emerald-50 dark:bg-emerald-950" iconColor="text-emerald-500"
            />
            <StatCard
              label="Total Pending" value={`₹${summary.totalPending.toLocaleString('en-IN')}`}
              sub={`${summary.unpaidFees} unpaid · ${summary.partialFees} partial`}
              icon={TrendingDown}
              colorClass="text-red-500"
              iconBg="bg-red-50 dark:bg-red-950" iconColor="text-red-400"
            />
            <StatCard
              label="Students"    value={summary.students}
              sub={`in class ${selectedClass}`}
              icon={Users}
              colorClass="text-blue-600"
              iconBg="bg-blue-50 dark:bg-blue-950" iconColor="text-blue-500"
            />
          </div>

          {/* ── Fee status breakdown bar ── */}
          {(() => {
            const total      = summary.paidFees + summary.partialFees + summary.unpaidFees
            const paidPct    = total > 0 ? (summary.paidFees    / total) * 100 : 0
            const partialPct = total > 0 ? (summary.partialFees / total) * 100 : 0
            const unpaidPct  = total > 0 ? (summary.unpaidFees  / total) * 100 : 0
            return (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Fee Status Breakdown ({total} total fee rows)</span>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-medium">{summary.paidFees} Paid</span>
                    <span className="text-amber-500 font-medium">{summary.partialFees} Partial</span>
                    <span className="text-red-500 font-medium">{summary.unpaidFees} Unpaid</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${paidPct}%` }} />
                  <div className="bg-amber-400 h-full transition-all"  style={{ width: `${partialPct}%` }} />
                  <div className="bg-red-400 h-full transition-all"    style={{ width: `${unpaidPct}%` }} />
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
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 w-56 h-8 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="relative">
            <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="number" placeholder="Min pending"
              value={minPending} onChange={e => setMinPending(e.target.value)} min={0}
              className="pl-8 w-40 h-8 text-sm"
            />
            {minPending && (
              <button onClick={() => setMinPending('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex gap-1">
            {['all', 'Unpaid', 'Partial', 'Paid'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  statusFilter === s
                    ? s === 'Paid'    ? 'bg-emerald-500 text-white border-emerald-500'
                    : s === 'Partial' ? 'bg-amber-400 text-white border-amber-400'
                    : s === 'Unpaid'  ? 'bg-red-500 text-white border-red-500'
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
              variant="ghost" size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => { setStatusFilter('all'); setMinPending(''); setSearchQuery('') }}
            >
              <X className="h-3 w-3 mr-1" /> Clear filters
            </Button>
          )}

          {expandedRows.size > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => setExpandedRows(new Set())}>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">Total Fee</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">Paid</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">Pending</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => {
                const isExpanded   = expandedRows.has(student.StudentID)
                const totalFee     = student.fees.reduce((s, f) => s + Number(f.TotalFee         || 0), 0)
                const totalDisc    = student.fees.reduce((s, f) => s + Number(f.DiscountAmount   || 0), 0)
                const totalPaid    = student.fees.reduce((s, f) => s + Number(f.PaidAmount       || 0), 0)
                const totalPending = student.fees.reduce((s, f) => s + Number(f.PendingAmount    || 0), 0)
                const paidCount    = student.fees.filter(f => f.PaymentStatus === 'Paid').length
                const partialCount = student.fees.filter(f => f.PaymentStatus === 'Partial').length
                const unpaidCount  = student.fees.filter(f => f.PaymentStatus === 'Unpaid').length
                const isLast       = idx === filteredStudents.length - 1

                return (
                  <>
                    <tr
                      key={student.StudentID}
                      onClick={() => toggleRow(student.StudentID)}
                      className={`group cursor-pointer transition-colors ${!isLast || isExpanded ? 'border-b border-border' : ''} ${isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20'}`}
                    >
                      {/* Chevron */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded text-muted-foreground group-hover:text-foreground transition-colors">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </span>
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-muted-foreground">#{student.StudentID}</span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-sm leading-tight">{student.FullName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Class {student.ClassID} · Section {student.SectionID}
                        </p>
                      </td>

                      {/* Status pills — always show all three, dim zero-count ones */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2 py-0.5 border transition-opacity ${
                            paidCount > 0
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-100 dark:border-emerald-900'
                              : 'bg-muted text-muted-foreground border-border opacity-40'
                          }`}>
                            <CheckCircle2 className="h-2.5 w-2.5" /> {paidCount} paid
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2 py-0.5 border transition-opacity ${
                            partialCount > 0
                              ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-100 dark:border-amber-900'
                              : 'bg-muted text-muted-foreground border-border opacity-40'
                          }`}>
                            <Clock className="h-2.5 w-2.5" /> {partialCount} partial
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2 py-0.5 border transition-opacity ${
                            unpaidCount > 0
                              ? 'bg-red-50 dark:bg-red-950 text-red-500 border-red-100 dark:border-red-900'
                              : 'bg-muted text-muted-foreground border-border opacity-40'
                          }`}>
                            <AlertCircle className="h-2.5 w-2.5" /> {unpaidCount} unpaid
                          </span>
                        </div>
                      </td>

                      {/* Total Fee */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-medium tabular-nums">
                          ₹{totalFee.toLocaleString('en-IN')}
                        </span>
                        {totalDisc > 0 && (
                          <p className="text-[10px] text-blue-500 tabular-nums">
                            -₹{totalDisc.toLocaleString('en-IN')} disc.
                          </p>
                        )}
                      </td>

                      {/* Paid */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-emerald-600 font-semibold text-sm tabular-nums">
                          ₹{totalPaid.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Pending */}
                      <td className="px-4 py-3.5 text-right">
                        <span className={`font-bold text-sm tabular-nums ${totalPending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {totalPending > 0 ? `₹${totalPending.toLocaleString('en-IN')}` : '—'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 justify-end">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Send reminder">
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          <Button asChild size="sm" variant="outline" className="h-7 gap-1 text-xs">
                            <Link to={`/pay-fees/${student.StudentID}`}>
                              Pay <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && <FeeDetailPanel fees={student.fees} />}
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
