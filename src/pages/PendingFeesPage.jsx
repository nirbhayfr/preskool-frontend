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
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Fee Detail Panel — rendered as a <tr> inside the same table
// ─────────────────────────────────────────────────────────────────────────────
function FeeDetailPanel({ fees }) {
  return (
    <tr>
      <td colSpan={7} className="p-0">
        <div className="bg-muted/20 px-6 py-4 border-t border-dashed border-border/60">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Fee Breakdown
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {fees.map((fee, idx) => {
              const paid    = Number(fee.PaidAmount    || 0)
              const pending = Number(fee.PendingAmount || 0)
              const total   = paid + pending
              const pct     = total > 0 ? Math.round((paid / total) * 100) : 0
              const cleared = pending === 0

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border ${
                    cleared
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50'
                      : 'bg-background border-border/70'
                  }`}
                >
                  {/* icon */}
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${cleared ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-red-50 dark:bg-red-950'}`}>
                    {cleared
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      : <Clock        className="h-3.5 w-3.5 text-red-500" />
                    }
                  </div>

                  {/* label + progress */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium capitalize truncate">
                        {fee.FeeType?.replaceAll('_', ' ')}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{pct}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* amounts */}
                  <div className="flex gap-3 shrink-0 text-right">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Paid</p>
                      <p className="text-xs font-semibold text-emerald-600 tabular-nums">
                        ₹{paid.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Due</p>
                      <p className={`text-xs font-semibold tabular-nums ${pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        ₹{pending.toLocaleString('en-IN')}
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
function StatCard({ label, value, icon: Icon, colorClass, iconBg, iconColor }) {
  return (
    <Card className="py-4 px-5">
      <CardContent className="p-0 flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${colorClass}`}>{label}</p>
          <p className={`text-2xl font-bold mt-0.5 ${colorClass}`}>{value}</p>
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

  const toggleRow = (id) =>
    setExpandedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const resetAll = () => {
    setExpandedRows(new Set())
  }

  // ── API filters ──
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
          fees:      [],
        }
      }
      map[row.StudentID].fees.push(row)
    })
    return Object.values(map)
  }, [tableData])

  // ── Apply filters ──
  const filteredStudents = useMemo(() => {
    let list = groupedStudents

    // Min pending amount
    if (minPending) {
      const min = Number(minPending)
      list = list.filter(s =>
        s.fees.reduce((sum, f) => sum + Number(f.PendingAmount || 0), 0) >= min
      )
    }

    // Search by ID or Name
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(s =>
        String(s.StudentID).toLowerCase().includes(q) ||
        s.FullName.toLowerCase().includes(q)
      )
    }

    return list
  }, [groupedStudents, minPending, searchQuery])

  // ── Summary ──
  const summary = useMemo(() => {
    if (!tableData.length) return null
    return {
      uniqueStudents: new Set(tableData.map(r => r.StudentID)).size,
      totalPaid:      tableData.reduce((s, r) => s + Number(r.PaidAmount    || 0), 0),
      totalPending:   tableData.reduce((s, r) => s + Number(r.PendingAmount || 0), 0),
    }
  }, [tableData])

  const hasActiveFilters = minPending || searchQuery.trim()

  // ── Loading / Error ──
  if (isLoading)
    return <div className="flex justify-center items-center h-[60vh]"><CircleLoader /></div>

  if (isError)
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load pending fees. {error?.message}</AlertDescription>
        </Alert>
      </div>
    )

  // ── Render ──
  return (
    <div className="p-6 space-y-5 w-full">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pending Fees</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectedClass
              ? `Class ${selectedClass}${selectedSection !== 'all' ? ` · Section ${selectedSection}` : ' · All Sections'}`
              : 'Select a class to view dues'}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={selectedClass} onValueChange={v => { setSelectedClass(v); resetAll() }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSection} onValueChange={v => { setSelectedSection(v); resetAll() }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map(sec => (
                <SelectItem key={sec} value={sec}>Section {sec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label="Students with Dues" value={summary.uniqueStudents}
            icon={Users}
            colorClass="text-blue-600"
            iconBg="bg-blue-50 dark:bg-blue-950" iconColor="text-blue-500"
          />
          <StatCard
            label="Total Paid" value={`₹${summary.totalPaid.toLocaleString('en-IN')}`}
            icon={TrendingUp}
            colorClass="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950" iconColor="text-emerald-500"
          />
          <StatCard
            label="Total Pending" value={`₹${summary.totalPending.toLocaleString('en-IN')}`}
            icon={TrendingDown}
            colorClass="text-red-500"
            iconBg="bg-red-50 dark:bg-red-950" iconColor="text-red-400"
          />
        </div>
      )}

      {/* ── Filter / Search Bar ── */}
      {groupedStudents.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">

          {/* Search by ID or Name */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or ID…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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

          {/* Min pending */}
          <div className="relative">
            <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="number"
              placeholder="Min pending"
              value={minPending}
              onChange={e => setMinPending(e.target.value)}
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

          {/* Active filter count */}
          {hasActiveFilters && (
            <span className="text-xs text-muted-foreground">
              {filteredStudents.length} of {groupedStudents.length} students
            </span>
          )}

          {/* Collapse all */}
          {expandedRows.size > 0 && (
            <Button
              variant="ghost" size="sm"
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

            {/* ── thead ── */}
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
                  Fee Types
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

            {/* ── tbody ── */}
            <tbody>
              {filteredStudents.map((student, idx) => {
                const isExpanded  = expandedRows.has(student.StudentID)
                const totalPaid    = student.fees.reduce((s, f) => s + Number(f.PaidAmount    || 0), 0)
                const totalPending = student.fees.reduce((s, f) => s + Number(f.PendingAmount || 0), 0)
                const dueCount     = student.fees.filter(f => Number(f.PendingAmount || 0) > 0).length
                const clearCount   = student.fees.length - dueCount
                const isLast       = idx === filteredStudents.length - 1

                return (
                  <>
                    {/* Student row */}
                    <tr
                      key={student.StudentID}
                      onClick={() => toggleRow(student.StudentID)}
                      className={`group cursor-pointer transition-colors ${!isLast || isExpanded ? 'border-b border-border' : ''} ${isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20'}`}
                    >
                      {/* Chevron */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded text-muted-foreground group-hover:text-foreground transition-colors">
                          {isExpanded
                            ? <ChevronDown  className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />
                          }
                        </span>
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{student.StudentID}
                        </span>
                      </td>

                      {/* Name + class/section */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-sm leading-tight">{student.FullName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Class {student.ClassID} · Section {student.SectionID}
                        </p>
                      </td>

                      {/* Fee type pills */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {dueCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950 text-red-500 text-[11px] font-medium px-2 py-0.5 border border-red-100 dark:border-red-900">
                              <AlertCircle className="h-2.5 w-2.5" />
                              {dueCount} due
                            </span>
                          )}
                          {clearCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[11px] font-medium px-2 py-0.5 border border-emerald-100 dark:border-emerald-900">
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              {clearCount} clear
                            </span>
                          )}
                        </div>
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
                          ₹{totalPending.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Actions — stop click bubbling */}
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 justify-end">
                          <Button
                            size="icon" variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Send reminder"
                          >
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

                    {/* Expanded fee detail */}
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
