import { useMemo, useState } from 'react'
import {
  useTransportHistoryList,
  useCreateTransportHistory,
  useUpdateTransportHistory,
  useDeleteTransportHistory,
} from '@/hooks/useTransportHistoryCrud'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bus,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  List,
  Users,
  IndianRupee,
  Filter,
  Download,
  RefreshCw,
  BadgeCheck,
  Layers3,
  Car,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock3,
  ShieldCheck,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ACADEMIC_YEARS = ['2025-2026', '2024-2025', '2023-2024']

const MONTHS = [
  { number: 1, name: 'January', short: 'Jan' },
  { number: 2, name: 'February', short: 'Feb' },
  { number: 3, name: 'March', short: 'Mar' },
  { number: 4, name: 'April', short: 'Apr' },
  { number: 5, name: 'May', short: 'May' },
  { number: 6, name: 'June', short: 'Jun' },
  { number: 7, name: 'July', short: 'Jul' },
  { number: 8, name: 'August', short: 'Aug' },
  { number: 9, name: 'September', short: 'Sep' },
  { number: 10, name: 'October', short: 'Oct' },
  { number: 11, name: 'November', short: 'Nov' },
  { number: 12, name: 'December', short: 'Dec' },
]

const TRANSPORT_STATUS_OPTIONS = ['Yes', 'No', 'Not A']

const EMPTY_FORM = {
  studentId: '',
  fullName: '',
  rollNo: '',
  admissionNo: '',
  classId: '',
  sectionId: '',
  transportStatus: 'Yes',
  route: '',
  vehicleNo: '',
  academicYear: '2025-2026',
  monthNumber: '',
  monthName: '',
}

const PAGE_SIZE = 12

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function normalizeText(v) {
  return String(v || '').trim().toLowerCase()
}

function getMonthMeta(monthNumber) {
  return MONTHS.find((m) => Number(m.number) === Number(monthNumber))
}

function statusConfig(status) {
  if (status === 'Yes') {
    return {
      key: 'Yes',
      label: 'Active',
      dot: 'bg-emerald-500',
      chip: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      soft: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
      icon: CheckCircle2,
    }
  }

  if (status === 'Not A') {
    return {
      key: 'Not A',
      label: 'Not Assigned',
      dot: 'bg-amber-500',
      chip: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      soft: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
      icon: Clock3,
    }
  }

  return {
    key: 'No',
    label: 'Inactive',
    dot: 'bg-slate-400',
    chip: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    soft: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    icon: XCircle,
  }
}

function groupByStudent(records) {
  const map = {}

  records.forEach((r) => {
    const key = r.StudentID
    if (!map[key]) {
      map[key] = {
        studentId: r.StudentID,
        fullName: r.FullName,
        rollNo: r.RollNo,
        admissionNo: r.AdmissionNo,
        classId: r.ClassID,
        sectionId: r.SectionID,
        records: [],
      }
    }
    map[key].records.push(r)
  })

  return Object.values(map)
    .map((s) => ({
      ...s,
      records: [...s.records].sort((a, b) => Number(a.MonthNumber) - Number(b.MonthNumber)),
    }))
    .sort((a, b) => {
      const cls = String(a.classId).localeCompare(String(b.classId), undefined, {
        numeric: true,
      })
      if (cls !== 0) return cls

      const sec = String(a.sectionId).localeCompare(String(b.sectionId))
      if (sec !== 0) return sec

      return String(a.fullName || '').localeCompare(String(b.fullName || ''))
    })
}

function exportCSV(rows, fileName = 'transport-history.csv') {
  if (!rows?.length) return

  const headers = Object.keys(rows[0])

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const cell = row[header] ?? ''
          const escaped = String(cell).replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', fileName)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function activeRecordForStudent(student) {
  return [...student.records].reverse().find((r) => r.TransportStatus === 'Yes') || null
}

function getStudentTransportSummary(student) {
  const totalMonths = student.records.length
  const activeMonths = student.records.filter((r) => r.TransportStatus === 'Yes').length
  const inactiveMonths = student.records.filter((r) => r.TransportStatus === 'No').length
  const notAssignedMonths = student.records.filter((r) => r.TransportStatus === 'Not A').length

  return {
    totalMonths,
    activeMonths,
    inactiveMonths,
    notAssignedMonths,
  }
}

function sortStudents(list, sortKey, sortDir) {
  const rows = [...list]

  rows.sort((a, b) => {
    const activeA = activeRecordForStudent(a)
    const activeB = activeRecordForStudent(b)

    let av
    let bv

    switch (sortKey) {
      case 'name':
        av = String(a.fullName || '')
        bv = String(b.fullName || '')
        break
      case 'class':
        av = String(a.classId || '')
        bv = String(b.classId || '')
        break
      case 'section':
        av = String(a.sectionId || '')
        bv = String(b.sectionId || '')
        break
      case 'months':
        av = Number(a.records.length || 0)
        bv = Number(b.records.length || 0)
        break
      case 'activeMonths':
        av = Number(getStudentTransportSummary(a).activeMonths || 0)
        bv = Number(getStudentTransportSummary(b).activeMonths || 0)
        break
      case 'vehicle':
        av = String(activeA?.VehicleNo || '')
        bv = String(activeB?.VehicleNo || '')
        break
      case 'route':
        av = String(activeA?.Route || '')
        bv = String(activeB?.Route || '')
        break
      default:
        av = String(a.fullName || '')
        bv = String(b.fullName || '')
    }

    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av
    }

    const result = String(av).localeCompare(String(bv), undefined, {
      numeric: true,
      sensitivity: 'base',
    })

    return sortDir === 'asc' ? result : -result
  })

  return rows
}

// ─────────────────────────────────────────────────────────────────────────────
// Small UI Helpers
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = '',
  valueClass = '',
}) {
  return (
    <div className="rounded-2xl border bg-card px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold mt-1 tracking-tight ${valueClass}`}>{value}</p>
          {subtitle ? <p className="text-xs text-muted-foreground mt-1">{subtitle}</p> : null}
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function StatusTab({ id, current, label, onClick, activeClass }) {
  const active = current === id

  return (
    <button
      onClick={() => onClick(id)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? activeClass
          : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
      }`}
    >
      {label}
    </button>
  )
}

function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs bg-background">
      {label}
      <button onClick={onClear} className="text-muted-foreground hover:text-foreground">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function SortButton({ label, column, sortKey, sortDir, onSort, align = 'left' }) {
  const active = sortKey === column
  const icon = !active ? (
    <ArrowUpDown className="h-3.5 w-3.5" />
  ) : sortDir === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  )

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`inline-flex items-center gap-1 font-semibold hover:text-foreground ${
        align === 'center' ? 'justify-center w-full' : ''
      }`}
    >
      <span>{label}</span>
      <span className={active ? 'text-foreground' : 'text-muted-foreground'}>{icon}</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Badges / Pills
// ─────────────────────────────────────────────────────────────────────────────

function TransportStatusBadge({ status }) {
  const cfg = statusConfig(status)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${cfg.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function MonthPill({ record, onEdit, onDelete }) {
  const cfg = statusConfig(record.TransportStatus)
  const [hover, setHover] = useState(false)
  const month = getMonthMeta(record.MonthNumber)

  return (
    <div
      className="relative group/pill"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`rounded-xl border px-2.5 py-2 min-w-[84px] text-center cursor-default transition-shadow hover:shadow-sm ${cfg.chip}`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wide leading-none">
          {month?.short || record.MonthName?.slice(0, 3) || 'Mon'}
        </p>
        <p className="text-[9px] mt-1 opacity-70">{record.AcademicYear?.slice(-4) || ''}</p>
        <div className="mt-1.5">
          <TransportStatusBadge status={record.TransportStatus} />
        </div>

        {record.VehicleNo && record.VehicleNo !== 'N/A' ? (
          <p className="text-[9px] mt-1.5 opacity-70 flex items-center justify-center gap-0.5">
            <Bus className="h-2.5 w-2.5" />
            {record.VehicleNo}
          </p>
        ) : null}
      </div>

      {hover ? (
        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(record)
            }}
            className="h-6 w-6 rounded-full bg-background border border-border shadow flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <Pencil className="h-3 w-3" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(record)
            }}
            className="h-6 w-6 rounded-full bg-background border border-border shadow flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary cards
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCards({ records, studentGroups }) {
  const totalStudents = studentGroups.length
  const activeStudents = studentGroups.filter((s) =>
    s.records.some((r) => r.TransportStatus === 'Yes')
  ).length
  const inactiveStudents = studentGroups.filter((s) =>
    s.records.every((r) => r.TransportStatus !== 'Yes')
  ).length
  const totalRecords = records.length
  const monthsCovered = new Set(records.map((r) => `${r.AcademicYear}-${r.MonthNumber}`)).size
  const vehicles = new Set(
    records.filter((r) => r.VehicleNo && r.VehicleNo !== 'N/A').map((r) => r.VehicleNo)
  ).size
  const routes = new Set(
    records.filter((r) => r.Route && r.Route !== 'N/A').map((r) => r.Route)
  ).size

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
      <SummaryCard
        title="Students"
        value={totalStudents}
        subtitle="Unique students"
        icon={Users}
        iconClass="bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
      />

      <SummaryCard
        title="Active Students"
        value={activeStudents}
        subtitle="At least one active month"
        icon={BadgeCheck}
        valueClass="text-emerald-600"
        iconClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      />

      <SummaryCard
        title="Inactive Students"
        value={inactiveStudents}
        subtitle="No active month"
        icon={XCircle}
        valueClass="text-slate-600"
        iconClass="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
      />

      <SummaryCard
        title="Records"
        value={totalRecords}
        subtitle="Total monthly entries"
        icon={List}
        valueClass="text-sky-600"
        iconClass="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
      />

      <SummaryCard
        title="Months Covered"
        value={monthsCovered}
        subtitle="Academic month snapshots"
        icon={Calendar}
        valueClass="text-indigo-600"
        iconClass="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
      />

      <SummaryCard
        title="Vehicles"
        value={vehicles}
        subtitle="Unique vehicles used"
        icon={Car}
        valueClass="text-amber-600"
        iconClass="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
      />

      <SummaryCard
        title="Routes"
        value={routes}
        subtitle="Unique route names"
        icon={MapPin}
        valueClass="text-rose-600"
        iconClass="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Insights
// ─────────────────────────────────────────────────────────────────────────────

function InsightPanel({ records, studentGroups }) {
  const monthStats = useMemo(() => {
    const map = {}

    records.forEach((r) => {
      const key = `${r.AcademicYear}-${r.MonthNumber}`
      if (!map[key]) {
        map[key] = {
          key,
          label: `${r.MonthName} ${r.AcademicYear}`,
          total: 0,
          active: 0,
          inactive: 0,
          notAssigned: 0,
        }
      }

      map[key].total += 1
      if (r.TransportStatus === 'Yes') map[key].active += 1
      else if (r.TransportStatus === 'Not A') map[key].notAssigned += 1
      else map[key].inactive += 1
    })

    return Object.values(map).sort((a, b) => {
      const [aYear, aMonth] = a.key.split('-')
      const [bYear, bMonth] = b.key.split('-')
      const aa = `${aYear}-${String(aMonth).padStart(2, '0')}`
      const bb = `${bYear}-${String(bMonth).padStart(2, '0')}`
      return bb.localeCompare(aa)
    })
  }, [records])

  const topVehicles = useMemo(() => {
    const map = {}
    records.forEach((r) => {
      const key = r.VehicleNo && r.VehicleNo !== 'N/A' ? r.VehicleNo : null
      if (!key) return
      map[key] = (map[key] || 0) + 1
    })

    return Object.entries(map)
      .map(([vehicle, count]) => ({ vehicle, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [records])

  const topRoutes = useMemo(() => {
    const map = {}
    records.forEach((r) => {
      const key = r.Route && r.Route !== 'N/A' ? r.Route : null
      if (!key) return
      map[key] = (map[key] || 0) + 1
    })

    return Object.entries(map)
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [records])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-violet-500" />
            Month Activity
          </h3>
        </div>
        <div className="p-4 space-y-3 max-h-[320px] overflow-auto">
          {monthStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No month data</p>
          ) : (
            monthStats.map((m) => (
              <div key={m.key} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{m.label}</p>
                  <span className="text-xs text-muted-foreground">{m.total} records</span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-[11px] rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active {m.active}
                  </span>
                  <span className="text-[11px] rounded-full px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200">
                    Inactive {m.inactive}
                  </span>
                  <span className="text-[11px] rounded-full px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                    Not Assigned {m.notAssigned}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Bus className="h-4 w-4 text-sky-500" />
            Top Vehicles
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {topVehicles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No vehicle data</p>
          ) : (
            topVehicles.map((item, idx) => (
              <div
                key={item.vehicle}
                className="flex items-center justify-between rounded-xl border px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{item.vehicle}</p>
                  <p className="text-xs text-muted-foreground">Vehicle #{idx + 1}</p>
                </div>
                <span className="text-sm font-bold text-sky-600">{item.count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <RouteIcon className="h-4 w-4 text-rose-500" />
            Top Routes
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {topRoutes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No route data</p>
          ) : (
            topRoutes.map((item, idx) => (
              <div
                key={item.route}
                className="flex items-center justify-between rounded-xl border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.route}</p>
                  <p className="text-xs text-muted-foreground">Route #{idx + 1}</p>
                </div>
                <span className="text-sm font-bold text-rose-600">{item.count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function RouteIcon(props) {
  return <MapPin {...props} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Expanded row
// ─────────────────────────────────────────────────────────────────────────────

function StudentExpandedContent({ student, onEdit, onDelete }) {
  const active = activeRecordForStudent(student)
  const summary = getStudentTransportSummary(student)

  return (
    <div className="bg-muted/20 px-4 py-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-background p-4">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-500" />
            Student Overview
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Student ID</span>
              <span className="font-medium">{student.studentId}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Roll No</span>
              <span className="font-medium">{student.rollNo || '—'}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Admission No</span>
              <span className="font-medium">{student.admissionNo || '—'}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Class / Section</span>
              <span className="font-medium">
                {student.classId}
                {student.sectionId}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Transport Summary
          </h4>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total Months</p>
              <p className="text-xl font-bold mt-1">{summary.totalMonths}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Active Months</p>
              <p className="text-xl font-bold mt-1 text-emerald-600">{summary.activeMonths}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="text-xl font-bold mt-1 text-slate-600">{summary.inactiveMonths}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Not Assigned</p>
              <p className="text-xl font-bold mt-1 text-amber-600">
                {summary.notAssignedMonths}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Car className="h-4 w-4 text-sky-500" />
            Latest Active Assignment
          </h4>

          {active ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Month</span>
                <span className="font-medium">
                  {active.MonthName} {active.AcademicYear}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-medium">{active.VehicleNo || '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium text-right">{active.Route || '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Status</span>
                <TransportStatusBadge status={active.TransportStatus} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active transport record found.</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-background p-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-indigo-500" />
          Month Timeline
        </h4>

        <div className="flex flex-wrap gap-2">
          {student.records.map((record) => (
            <MonthPill
              key={record.Id}
              record={record}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Table row
// ─────────────────────────────────────────────────────────────────────────────

function StudentRow({
  student,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  sortKey,
  sortDir,
}) {
  const active = activeRecordForStudent(student)
  const summary = getStudentTransportSummary(student)

  return (
    <>
      <tr className="group align-top border-b border-border/60 hover:bg-muted/20 transition-colors">
        <td className="px-4 py-3 align-middle w-[56px]">
          <button
            type="button"
            onClick={onToggle}
            className="h-8 w-8 rounded-lg border bg-background hover:bg-muted inline-flex items-center justify-center"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </td>

        <td className="px-4 py-3 align-top min-w-[240px]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
              {student.fullName?.charAt(0)?.toUpperCase() || '?'}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold capitalize leading-tight">
                {student.fullName}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                ID {student.studentId}
                {student.rollNo ? ` · Roll ${student.rollNo}` : ''}
              </p>
              {student.admissionNo ? (
                <p className="text-[11px] text-muted-foreground">{student.admissionNo}</p>
              ) : null}
            </div>
          </div>
        </td>

        <td className="px-4 py-3 align-top hidden sm:table-cell">
          <span className="inline-flex items-center text-xs font-medium bg-muted px-2 py-0.5 rounded">
            {student.classId}
            {student.sectionId}
          </span>
        </td>

        <td className="px-4 py-3 align-top hidden md:table-cell min-w-[180px]">
          {active ? (
            <div>
              <div className="flex items-center gap-1 text-xs font-medium">
                <Bus className="h-3.5 w-3.5 text-muted-foreground" />
                {active.VehicleNo || '—'}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{active.Route || '—'}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </td>

        <td className="px-4 py-3 align-top text-center hidden lg:table-cell">
          <span className="font-semibold">{student.records.length}</span>
        </td>

        <td className="px-4 py-3 align-top text-center hidden lg:table-cell">
          <span className="font-semibold text-emerald-600">{summary.activeMonths}</span>
        </td>

        <td className="px-4 py-3 align-top min-w-[360px]">
          <div className="flex flex-wrap gap-2">
            {student.records.slice(0, 6).map((record) => (
              <MonthPill
                key={record.Id}
                record={record}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}

            {student.records.length > 6 ? (
              <div className="rounded-xl border px-3 py-2 bg-muted/30 text-xs text-muted-foreground flex items-center">
                +{student.records.length - 6} more
              </div>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
              Active {summary.activeMonths}
            </span>
            <span className="rounded-full bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5">
              Inactive {summary.inactiveMonths}
            </span>
            <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5">
              Not Assigned {summary.notAssignedMonths}
            </span>
          </div>
        </td>
      </tr>

      {expanded ? (
        <tr className="border-b border-border/60">
          <td colSpan={7} className="p-0">
            <StudentExpandedContent student={student} onEdit={onEdit} onDelete={onDelete} />
          </td>
        </tr>
      ) : null}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialogs
// ─────────────────────────────────────────────────────────────────────────────

const Field = ({ label, children, className = '' }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {label}
    </Label>
    {children}
  </div>
)

function RecordFormDialog({ open, onClose, initial, mode }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const createMutation = useCreateTransportHistory()
  const updateMutation = useUpdateTransportHistory()

  const isEdit = mode === 'edit'
  const isPending = createMutation.isPending || updateMutation.isPending

  function set(key, val) {
    setForm((prev) => {
      const next = { ...prev, [key]: val }

      if (key === 'monthNumber') {
        const m = MONTHS.find((item) => String(item.number) === String(val))
        next.monthName = m ? m.name : ''
      }

      return next
    })
  }

  function handleSubmit() {
    const payload = {
      StudentID: Number(form.studentId),
      FullName: form.fullName,
      RollNo: form.rollNo || null,
      AdmissionNo: form.admissionNo || null,
      ClassId: form.classId,
      SectionId: form.sectionId,
      TransportStatus: form.transportStatus,
      Route: form.route || 'N/A',
      VehicleNo: form.vehicleNo || 'N/A',
      AcademicYear: form.academicYear,
      MonthNumber: Number(form.monthNumber),
      MonthName: form.monthName,
    }

    if (isEdit) {
      updateMutation.mutate(
        { id: initial.Id, data: payload },
        {
          onSuccess: onClose,
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: onClose,
      })
    }
  }

  function handleOpenChange(v) {
    if (!v) onClose()
    else setForm(initial || EMPTY_FORM)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? 'Edit Transport Record' : 'Add Transport Record'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <Field label="Student ID">
            <Input
              type="number"
              placeholder="e.g. 12025"
              value={form.studentId}
              onChange={(e) => set('studentId', e.target.value)}
            />
          </Field>

          <Field label="Full Name">
            <Input
              placeholder="e.g. Aarav Sharma"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
            />
          </Field>

          <Field label="Roll No">
            <Input
              placeholder="Optional"
              value={form.rollNo || ''}
              onChange={(e) => set('rollNo', e.target.value)}
            />
          </Field>

          <Field label="Admission No">
            <Input
              placeholder="Optional"
              value={form.admissionNo || ''}
              onChange={(e) => set('admissionNo', e.target.value)}
            />
          </Field>

          <Field label="Class">
            <Input
              placeholder="e.g. 10"
              value={form.classId}
              onChange={(e) => set('classId', e.target.value)}
            />
          </Field>

          <Field label="Section">
            <Input
              placeholder="e.g. A"
              value={form.sectionId}
              onChange={(e) => set('sectionId', e.target.value)}
            />
          </Field>

          <Field label="Academic Year">
            <Select value={form.academicYear} onValueChange={(v) => set('academicYear', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Month">
            <Select
              value={String(form.monthNumber)}
              onValueChange={(v) => set('monthNumber', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.number} value={String(m.number)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Transport Status">
            <Select
              value={form.transportStatus}
              onValueChange={(v) => set('transportStatus', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORT_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'Yes'
                      ? 'Active (Yes)'
                      : s === 'Not A'
                        ? 'Not Assigned'
                        : 'Inactive (No)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Vehicle No">
            <Input
              placeholder="e.g. DL01AB1234"
              value={form.vehicleNo}
              onChange={(e) => set('vehicleNo', e.target.value)}
            />
          </Field>

          <Field label="Route" className="sm:col-span-2">
            <Input
              placeholder="e.g. Route 3 - Shalimar Bagh"
              value={form.route}
              onChange={(e) => set('route', e.target.value)}
            />
          </Field>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={
              isPending || !form.studentId || !form.fullName || !form.monthNumber
            }
          >
            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Record'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({ open, onClose, record }) {
  const deleteMutation = useDeleteTransportHistory()

  function handleDelete() {
    deleteMutation.mutate(record.Id, {
      onSuccess: onClose,
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transport Record</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the{' '}
            <span className="font-semibold">{record?.MonthName}</span> record for{' '}
            <span className="font-semibold">{record?.FullName}</span>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function TransportHistoryPage() {
  const { data: raw, isLoading, isError, error, refetch, isFetching } =
    useTransportHistoryList()

  // filters
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [routeFilter, setRouteFilter] = useState('all')
  const [showOnlyLatestActive, setShowOnlyLatestActive] = useState(false)

  // sort & pagination
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  // row expand
  const [expandedRows, setExpandedRows] = useState({})

  // dialogs
  const [createOpen, setCreateOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [deleteRecord, setDeleteRecord] = useState(null)

  const allRecords = raw?.data || []

  const classes = useMemo(() => {
    return [...new Set(allRecords.map((r) => String(r.ClassID)))]
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }, [allRecords])

  const sections = useMemo(() => {
    const base = allRecords.filter(
      (r) => classFilter === 'all' || String(r.ClassID) === classFilter
    )
    return [...new Set(base.map((r) => String(r.SectionID)))].sort()
  }, [allRecords, classFilter])

  const academicYears = useMemo(() => {
    return [...new Set(allRecords.map((r) => r.AcademicYear))].sort().reverse()
  }, [allRecords])

  const vehicles = useMemo(() => {
    return [
      ...new Set(
        allRecords
          .map((r) => r.VehicleNo)
          .filter((v) => v && v !== 'N/A')
      ),
    ].sort((a, b) => a.localeCompare(b))
  }, [allRecords])

  const routes = useMemo(() => {
    return [
      ...new Set(
        allRecords
          .map((r) => r.Route)
          .filter((v) => v && v !== 'N/A')
      ),
    ].sort((a, b) => a.localeCompare(b))
  }, [allRecords])

  const filteredRecords = useMemo(() => {
    let list = [...allRecords]

    if (yearFilter !== 'all') {
      list = list.filter((r) => r.AcademicYear === yearFilter)
    }

    if (monthFilter !== 'all') {
      list = list.filter((r) => String(r.MonthNumber) === monthFilter)
    }

    if (classFilter !== 'all') {
      list = list.filter((r) => String(r.ClassID) === classFilter)
    }

    if (sectionFilter !== 'all') {
      list = list.filter((r) => String(r.SectionID) === sectionFilter)
    }

    if (statusFilter !== 'all') {
      list = list.filter((r) => {
        if (statusFilter === 'Yes') return r.TransportStatus === 'Yes'
        if (statusFilter === 'No') return r.TransportStatus === 'No'
        if (statusFilter === 'NotA') return r.TransportStatus === 'Not A'
        return true
      })
    }

    if (vehicleFilter !== 'all') {
      list = list.filter((r) => String(r.VehicleNo) === vehicleFilter)
    }

    if (routeFilter !== 'all') {
      list = list.filter((r) => String(r.Route) === routeFilter)
    }

    if (search.trim()) {
      const q = normalizeText(search)
      list = list.filter((r) => {
        return (
          normalizeText(r.FullName).includes(q) ||
          String(r.StudentID).includes(q) ||
          normalizeText(r.Route).includes(q) ||
          normalizeText(r.VehicleNo).includes(q) ||
          normalizeText(r.AdmissionNo).includes(q) ||
          normalizeText(r.RollNo).includes(q)
        )
      })
    }

    return list
  }, [
    allRecords,
    search,
    classFilter,
    sectionFilter,
    monthFilter,
    yearFilter,
    statusFilter,
    vehicleFilter,
    routeFilter,
  ])

  const groupedStudents = useMemo(() => {
    let groups = groupByStudent(filteredRecords)

    if (showOnlyLatestActive) {
      groups = groups.filter((student) => !!activeRecordForStudent(student))
    }

    return sortStudents(groups, sortKey, sortDir)
  }, [filteredRecords, showOnlyLatestActive, sortKey, sortDir])

  const pagedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return groupedStudents.slice(start, start + PAGE_SIZE)
  }, [groupedStudents, page])

  const totalPages = Math.max(1, Math.ceil(groupedStudents.length / PAGE_SIZE))

  const hasFilters =
    !!search ||
    classFilter !== 'all' ||
    sectionFilter !== 'all' ||
    monthFilter !== 'all' ||
    yearFilter !== 'all' ||
    statusFilter !== 'all' ||
    vehicleFilter !== 'all' ||
    routeFilter !== 'all' ||
    showOnlyLatestActive

  function clearFilters() {
    setSearch('')
    setClassFilter('all')
    setSectionFilter('all')
    setMonthFilter('all')
    setYearFilter('all')
    setStatusFilter('all')
    setVehicleFilter('all')
    setRouteFilter('all')
    setShowOnlyLatestActive(false)
    setPage(1)
  }

  function toFormShape(record) {
    return {
      studentId: record.StudentID,
      fullName: record.FullName,
      rollNo: record.RollNo || '',
      admissionNo: record.AdmissionNo || '',
      classId: record.ClassID,
      sectionId: record.SectionID,
      transportStatus: record.TransportStatus,
      route: record.Route || '',
      vehicleNo: record.VehicleNo || '',
      academicYear: record.AcademicYear,
      monthNumber: record.MonthNumber,
      monthName: record.MonthName,
      Id: record.Id,
    }
  }

  function handleSort(column) {
    setPage(1)
    if (sortKey === column) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(column)
      setSortDir('asc')
    }
  }

  function toggleExpanded(studentId) {
    setExpandedRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  function exportFilteredData() {
    const rows = filteredRecords.map((r) => ({
      id: r.Id,
      student_id: r.StudentID,
      full_name: r.FullName,
      roll_no: r.RollNo || '',
      admission_no: r.AdmissionNo || '',
      class_id: r.ClassID,
      section_id: r.SectionID,
      transport_status: r.TransportStatus,
      route: r.Route || '',
      vehicle_no: r.VehicleNo || '',
      academic_year: r.AcademicYear,
      month_number: r.MonthNumber,
      month_name: r.MonthName,
      created_at: r.CreatedAt ? fmtDate(r.CreatedAt) : '',
      updated_at: r.UpdatedAt ? fmtDate(r.UpdatedAt) : '',
    }))

    exportCSV(rows, 'transport-history.csv')
  }

  if (page > totalPages) {
    setPage(totalPages)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircleLoader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load transport history. {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center shadow">
              <Bus className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">Transport History</h2>
              <p className="text-sm text-muted-foreground">
                Student-wise transport timeline, CRUD controls and monthly history tracking
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => refetch?.()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={exportFilteredData}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <Button
            size="sm"
            className="gap-2"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Summary */}
      {allRecords.length > 0 ? (
        <SummaryCards records={allRecords} studentGroups={groupByStudent(allRecords)} />
      ) : null}

      {/* Insights */}
      {allRecords.length > 0 ? (
        <InsightPanel records={allRecords} studentGroups={groupByStudent(allRecords)} />
      ) : null}

      {/* Filters */}
      {allRecords.length > 0 ? (
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-violet-500" />
              <h3 className="font-semibold">Filters & Search</h3>
            </div>

            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            ) : null}
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 gap-3">
              <div className="relative lg:col-span-3 2xl:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search student, ID, admission, vehicle, route..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-9"
                />
              </div>

              <Select
                value={classFilter}
                onValueChange={(v) => {
                  setClassFilter(v)
                  setSectionFilter('all')
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sectionFilter}
                onValueChange={(v) => {
                  setSectionFilter(v)
                  setPage(1)
                }}
                disabled={classFilter === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((s) => (
                    <SelectItem key={s} value={s}>
                      Section {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={monthFilter}
                onValueChange={(v) => {
                  setMonthFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.number} value={String(m.number)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 gap-3">
              <Select
                value={yearFilter}
                onValueChange={(v) => {
                  setYearFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {academicYears.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={vehicleFilter}
                onValueChange={(v) => {
                  setVehicleFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {vehicles.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={routeFilter}
                onValueChange={(v) => {
                  setRouteFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {routes.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={() => {
                  setShowOnlyLatestActive((prev) => !prev)
                  setPage(1)
                }}
                className={`rounded-md border px-3 text-sm font-medium transition ${
                  showOnlyLatestActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                Latest active only
              </button>

              <div className="flex flex-wrap gap-1">
                <StatusTab
                  id="all"
                  current={statusFilter}
                  label="All"
                  onClick={(v) => {
                    setStatusFilter(v)
                    setPage(1)
                  }}
                  activeClass="bg-foreground text-background border-foreground"
                />
                <StatusTab
                  id="Yes"
                  current={statusFilter}
                  label="Active"
                  onClick={(v) => {
                    setStatusFilter(v)
                    setPage(1)
                  }}
                  activeClass="bg-emerald-500 text-white border-emerald-500"
                />
                <StatusTab
                  id="No"
                  current={statusFilter}
                  label="Inactive"
                  onClick={(v) => {
                    setStatusFilter(v)
                    setPage(1)
                  }}
                  activeClass="bg-slate-600 text-white border-slate-600"
                />
                <StatusTab
                  id="NotA"
                  current={statusFilter}
                  label="Not Assigned"
                  onClick={(v) => {
                    setStatusFilter(v)
                    setPage(1)
                  }}
                  activeClass="bg-amber-500 text-white border-amber-500"
                />
              </div>
            </div>

            {hasFilters ? (
              <div className="flex flex-wrap gap-2">
                {search ? (
                  <FilterChip label={`Search: ${search}`} onClear={() => setSearch('')} />
                ) : null}
                {classFilter !== 'all' ? (
                  <FilterChip
                    label={`Class: ${classFilter}`}
                    onClear={() => setClassFilter('all')}
                  />
                ) : null}
                {sectionFilter !== 'all' ? (
                  <FilterChip
                    label={`Section: ${sectionFilter}`}
                    onClear={() => setSectionFilter('all')}
                  />
                ) : null}
                {monthFilter !== 'all' ? (
                  <FilterChip
                    label={`Month: ${getMonthMeta(monthFilter)?.name || monthFilter}`}
                    onClear={() => setMonthFilter('all')}
                  />
                ) : null}
                {yearFilter !== 'all' ? (
                  <FilterChip
                    label={`Year: ${yearFilter}`}
                    onClear={() => setYearFilter('all')}
                  />
                ) : null}
                {vehicleFilter !== 'all' ? (
                  <FilterChip
                    label={`Vehicle: ${vehicleFilter}`}
                    onClear={() => setVehicleFilter('all')}
                  />
                ) : null}
                {routeFilter !== 'all' ? (
                  <FilterChip
                    label={`Route: ${routeFilter}`}
                    onClear={() => setRouteFilter('all')}
                  />
                ) : null}
                {statusFilter !== 'all' ? (
                  <FilterChip
                    label={`Status: ${statusFilter}`}
                    onClear={() => setStatusFilter('all')}
                  />
                ) : null}
                {showOnlyLatestActive ? (
                  <FilterChip
                    label="Latest active only"
                    onClear={() => setShowOnlyLatestActive(false)}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{groupedStudents.length}</span>{' '}
          students · page <span className="font-semibold text-foreground">{page}</span> of{' '}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Active
          </span>
          <span className="inline-flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5 text-slate-500" />
            Inactive
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-amber-500" />
            Not Assigned
          </span>
        </div>
      </div>

      {/* Empty / Table */}
      {groupedStudents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl bg-card">
          <Bus className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No transport records found.</p>
          {hasFilters ? (
            <p className="text-xs mt-1 opacity-60">Try changing or clearing filters.</p>
          ) : (
            <Button size="sm" className="mt-4 gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Add first record
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm border-collapse">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 py-3 w-[56px]"></th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <SortButton
                      label="Student"
                      column="name"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    <SortButton
                      label="Class"
                      column="class"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    <SortButton
                      label="Latest Vehicle / Route"
                      column="vehicle"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>

                  <th className="px-4 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    <SortButton
                      label="Months"
                      column="months"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      align="center"
                    />
                  </th>

                  <th className="px-4 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    <SortButton
                      label="Active"
                      column="activeMonths"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      align="center"
                    />
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Timeline
                  </th>
                </tr>
              </thead>

              <tbody>
                {pagedStudents.map((student) => (
                  <StudentRow
                    key={student.studentId}
                    student={student}
                    expanded={!!expandedRows[student.studentId]}
                    onToggle={() => toggleExpanded(student.studentId)}
                    onEdit={(record) => setEditRecord(record)}
                    onDelete={(record) => setDeleteRecord(record)}
                    sortKey={sortKey}
                    sortDir={sortDir}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {groupedStudents.length > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {(page - 1) * PAGE_SIZE + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-foreground">
              {Math.min(page * PAGE_SIZE, groupedStudents.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-foreground">{groupedStudents.length}</span>{' '}
            students
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              First
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>

            <div className="px-3 py-1.5 text-sm rounded-md border bg-background">
              {page} / {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      ) : null}

      {/* Dialogs */}
      <RecordFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initial={EMPTY_FORM}
        mode="create"
      />

      {editRecord ? (
        <RecordFormDialog
          open={!!editRecord}
          onClose={() => setEditRecord(null)}
          initial={toFormShape(editRecord)}
          mode="edit"
        />
      ) : null}

      {deleteRecord ? (
        <DeleteDialog
          open={!!deleteRecord}
          onClose={() => setDeleteRecord(null)}
          record={deleteRecord}
        />
      ) : null}
    </div>
  )
}