import { useState, useMemo } from 'react'
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
  Hash,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  Users,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ACADEMIC_YEARS = ['2025-2026', '2024-2025', '2023-2024']

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

function statusConfig(status) {
  if (status === 'Yes')
    return {
      label: 'Active',
      dot: 'bg-emerald-500',
      chip: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2,
    }
  return {
    label: status === 'Not A' ? 'Not Assigned' : 'Inactive',
    dot: 'bg-slate-400',
    chip: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    icon: XCircle,
  }
}

// Group flat list by MonthName + AcademicYear
function groupByMonth(records) {
  const map = {}
  records.forEach((r) => {
    const key = `${r.AcademicYear}__${r.MonthNumber}__${r.MonthName}`
    if (!map[key])
      map[key] = {
        academicYear: r.AcademicYear,
        monthNumber: r.MonthNumber,
        monthName: r.MonthName,
        records: [],
      }
    map[key].records.push(r)
  })
  // Sort descending by month number
  return Object.values(map).sort((a, b) => b.monthNumber - a.monthNumber)
}

// ─────────────────────────────────────────────────────────────────────────────
// TransportStatusBadge
// ─────────────────────────────────────────────────────────────────────────────

function TransportStatusBadge({ status }) {
  const cfg = statusConfig(status)
  const Icon = cfg.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${cfg.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary stat cards
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCards({ records }) {
  const total = records.length
  const active = records.filter((r) => r.TransportStatus === 'Yes').length
  const inactive = total - active
  const vehicles = new Set(
    records.map((r) => r.VehicleNo).filter((v) => v && v !== 'N/A')
  ).size
  const months = new Set(records.map((r) => r.MonthName)).size

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Total Records', value: total, icon: List, color: 'text-foreground' },
        {
          label: 'Active',
          value: active,
          icon: CheckCircle2,
          color: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          label: 'Not Assigned',
          value: inactive,
          icon: XCircle,
          color: 'text-slate-500',
        },
        {
          label: 'Months',
          value: months,
          icon: Calendar,
          color: 'text-sky-600 dark:text-sky-400',
        },
      ].map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card px-4 py-3.5 flex items-center gap-3"
        >
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
// Record Form Dialog (Create & Edit)
// ─────────────────────────────────────────────────────────────────────────────

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
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
      // Auto-fill monthName when monthNumber changes
      if (key === 'monthNumber') {
        const m = MONTHS.find((m) => String(m.number) === String(val))
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
      updateMutation.mutate({ id: initial.Id, data: payload }, { onSuccess: onClose })
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  // Reset form when dialog opens
  function handleOpenChange(v) {
    if (!v) onClose()
    else setForm(initial || EMPTY_FORM)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <Select
              value={form.academicYear}
              onValueChange={(v) => set('academicYear', v)}
            >
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

          <Field label="Route">
            <Input
              placeholder="e.g. Route 3 - Shalimar Bagh"
              value={form.route}
              onChange={(e) => set('route', e.target.value)}
              className="sm:col-span-2"
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
            disabled={isPending || !form.studentId || !form.fullName || !form.monthNumber}
          >
            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Record'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirm Dialog
// ─────────────────────────────────────────────────────────────────────────────

function DeleteDialog({ open, onClose, record }) {
  const deleteMutation = useDeleteTransportHistory()

  function handleDelete() {
    deleteMutation.mutate(record.Id, { onSuccess: onClose })
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transport Record</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the{' '}
            <span className="font-semibold">{record?.MonthName}</span> record for{' '}
            <span className="font-semibold">{record?.FullName}</span>? This cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Record Row (inside table)
// ─────────────────────────────────────────────────────────────────────────────

function RecordRow({ record, isLast, onEdit, onDelete }) {
  const cfg = statusConfig(record.TransportStatus)

  return (
    <tr
      className={`group transition-colors hover:bg-muted/30 ${!isLast ? 'border-b border-border/60' : ''}`}
    >
      {/* Student */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-muted-foreground">
              {record.FullName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold capitalize leading-tight">
              {record.FullName}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ID {record.StudentID}
              {record.RollNo && ` · Roll ${record.RollNo}`}
              {record.AdmissionNo && ` · ${record.AdmissionNo}`}
            </p>
          </div>
        </div>
      </td>

      {/* Class / Section */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="inline-flex items-center text-xs font-medium bg-muted px-2 py-0.5 rounded">
          {record.ClassID}
          {record.SectionID}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <TransportStatusBadge status={record.TransportStatus} />
      </td>

      {/* Vehicle / Route */}
      <td className="px-4 py-3 hidden md:table-cell">
        {record.VehicleNo && record.VehicleNo !== 'N/A' ? (
          <div>
            <div className="flex items-center gap-1 text-xs font-medium">
              <Bus className="h-3 w-3 text-muted-foreground" />
              {record.VehicleNo}
            </div>
            {record.Route && record.Route !== 'N/A' && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                <MapPin className="h-2.5 w-2.5" />
                <span className="line-clamp-1">{record.Route}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>

      {/* Academic Year */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-xs text-muted-foreground">{record.AcademicYear}</span>
      </td>

      {/* Created */}
      <td className="px-4 py-3 hidden xl:table-cell">
        <span className="text-[11px] text-muted-foreground">
          {fmtDate(record.CreatedAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(record)
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(record)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Month Group Section
// ─────────────────────────────────────────────────────────────────────────────

function MonthGroup({ group, onEdit, onDelete }) {
  const [open, setOpen] = useState(true)
  const activeCount = group.records.filter((r) => r.TransportStatus === 'Yes').length

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Month header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-800 dark:bg-slate-200 flex flex-col items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">
              {group.academicYear.split('-')[0].slice(-2)}-
              {group.academicYear.split('-')[1].slice(-2)}
            </span>
            <span className="text-white dark:text-slate-800 text-[11px] font-extrabold leading-tight">
              {group.monthName.slice(0, 3).toUpperCase()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold">
              {group.monthName} {group.academicYear}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {group.records.length} records ·{' '}
              <span className="text-emerald-600 font-medium">{activeCount} active</span>
              {group.records.length - activeCount > 0 && (
                <span className="text-slate-500">
                  {' '}
                  · {group.records.length - activeCount} not assigned
                </span>
              )}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>

      {/* Records table */}
      {open && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border">
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Class
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Vehicle / Route
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                Year
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                Created
              </th>
              <th className="px-4 py-2.5 w-20" />
            </tr>
          </thead>
          <tbody>
            {group.records.map((record, idx) => (
              <RecordRow
                key={record.Id}
                record={record}
                isLast={idx === group.records.length - 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function TransportHistoryPage() {
  const { data: raw, isLoading, isError, error } = useTransportHistoryList()

  // UI state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null) // record being edited
  const [deleteRecord, setDeleteRecord] = useState(null) // record to delete

  const allRecords = raw?.data || []

  // ── Filters ──
  const filtered = useMemo(() => {
    let list = allRecords
    if (yearFilter !== 'all') list = list.filter((r) => r.AcademicYear === yearFilter)
    if (statusFilter !== 'all')
      list = list.filter((r) => {
        if (statusFilter === 'Yes') return r.TransportStatus === 'Yes'
        if (statusFilter === 'NotA') return r.TransportStatus === 'Not A'
        return true
      })
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (r) =>
          r.FullName?.toLowerCase().includes(q) ||
          String(r.StudentID).includes(q) ||
          r.Route?.toLowerCase().includes(q) ||
          r.VehicleNo?.toLowerCase().includes(q) ||
          r.AdmissionNo?.toLowerCase().includes(q)
      )
    }
    return list
  }, [allRecords, search, statusFilter, yearFilter])

  const grouped = useMemo(() => groupByMonth(filtered), [filtered])

  const academicYears = useMemo(
    () => [...new Set(allRecords.map((r) => r.AcademicYear))].sort().reverse(),
    [allRecords]
  )

  const hasFilters = search.trim() || statusFilter !== 'all' || yearFilter !== 'all'

  // Map record fields to form-friendly shape for editing
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
            Failed to load transport history. {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    )

  return (
    <div className="p-6 space-y-5 w-full">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transport History</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monthly transport assignment records · {raw?.total ?? allRecords.length} total
            entries
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 h-9 self-start sm:self-auto"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Record
        </Button>
      </div>

      {/* ── Summary ── */}
      {allRecords.length > 0 && <SummaryCards records={allRecords} />}

      {/* ── Filter Bar ── */}
      {allRecords.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search name, ID, vehicle, route…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-64 h-8 text-sm"
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

          {/* Academic year filter */}
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Year" />
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

          {/* Status pills */}
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'Yes', label: 'Active' },
              { id: 'NotA', label: 'Not Assigned' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  statusFilter === id
                    ? id === 'Yes'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : id === 'NotA'
                        ? 'bg-slate-600 text-white border-slate-600'
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
              {filtered.length} of {allRecords.length} records
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
                setYearFilter('all')
              }}
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}

          <p className="text-xs text-muted-foreground ml-auto hidden lg:block select-none">
            💡 Hover a row to edit or delete
          </p>
        </div>
      )}

      {/* ── Month Groups ── */}
      {grouped.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
          <Bus className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p className="text-sm font-medium">No records found.</p>
          {hasFilters ? (
            <p className="text-xs mt-1 opacity-60">Try adjusting your filters.</p>
          ) : (
            <Button
              size="sm"
              className="mt-4 gap-1.5"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Add first record
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <MonthGroup
              key={`${group.academicYear}-${group.monthNumber}`}
              group={group}
              onEdit={(record) => setEditRecord(record)}
              onDelete={(record) => setDeleteRecord(record)}
            />
          ))}
        </div>
      )}

      {/* ── Create Dialog ── */}
      <RecordFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initial={EMPTY_FORM}
        mode="create"
      />

      {/* ── Edit Dialog ── */}
      {editRecord && (
        <RecordFormDialog
          open={!!editRecord}
          onClose={() => setEditRecord(null)}
          initial={toFormShape(editRecord)}
          mode="edit"
        />
      )}

      {/* ── Delete Dialog ── */}
      {deleteRecord && (
        <DeleteDialog
          open={!!deleteRecord}
          onClose={() => setDeleteRecord(null)}
          record={deleteRecord}
        />
      )}
    </div>
  )
}
