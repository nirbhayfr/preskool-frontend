import { useState, useMemo, useEffect, useRef } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useStudents } from '@/hooks/useStudents'
import {
  useCustomConfigs,
  useCreateCustomConfig,
  useUpdateCustomConfig,
  useDeleteCustomConfig,
} from '@/hooks/useCustomConfig'
import { classes, sections } from '@/data/basicData'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import {
  Download, Search, X, SlidersHorizontal, FilterX, Plus, Trash2,
  Pencil, BookOpen, Users, GraduationCap, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, LayoutTemplate, Columns3, FileDown, ListFilter,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTeachers } from '@/hooks/useTeacher'
import { useStaffs } from '@/hooks/useStaff'

// ─── Column definitions ───────────────────────────────────────────────────────
const STUDENT_COLUMNS = [
  { key: 'StudentID', label: 'Student ID' },
  { key: 'FullName', label: 'Full Name' },
  { key: 'DOB', label: 'Date of Birth' },
  { key: 'Gender', label: 'Gender' },
  { key: 'ClassID', label: 'Class' },
  { key: 'SectionID', label: 'Section' },
  { key: 'RollNo', label: 'Roll No' },
  { key: 'AdmissionNo', label: 'Admission No' },
  { key: 'JoiningDate', label: 'Joining Date' },
  { key: 'Status', label: 'Status' },
  { key: 'Address', label: 'Address' },
  { key: 'ContactNumber', label: 'Contact Number' },
  { key: 'EmailAddress', label: 'Email' },
  { key: 'Nationality', label: 'Nationality' },
  { key: 'IdentificationNumber', label: 'ID Number' },
  { key: 'EnrollmentNumber', label: 'Enrollment No' },
  { key: 'Program', label: 'Program' },
  { key: 'YearSemester', label: 'Year / Semester' },
  { key: 'GPA', label: 'GPA' },
  { key: 'Attendance', label: 'Attendance' },
  { key: 'Subjects', label: 'Subjects' },
  { key: 'PreviousRecord', label: 'Previous Record' },
  { key: 'HouseName', label: 'House Name' },
  { key: 'Cast', label: 'Caste' },
  { key: 'GuardianName', label: 'Guardian Name' },
  { key: 'GuardianRelation', label: 'Guardian Relation' },
  { key: 'GuardianContact', label: 'Guardian Contact' },
  { key: 'GuardianOccupation', label: 'Guardian Occupation' },
  { key: 'GuardianAddress', label: 'Guardian Address' },
  { key: 'PendingFee', label: 'Pending Fee' },
  { key: 'DiscountAmount', label: 'Discount Amount' },
  { key: 'Route', label: 'Route' },
  { key: 'TransportStatus', label: 'Transport Status' },
  { key: 'VehicleNo', label: 'Vehicle No' },
]

const TEACHER_COLUMNS = [
  { key: 'TeacherID', label: 'Teacher ID' },
  { key: 'FullName', label: 'Full Name' },
  { key: 'Gender', label: 'Gender' },
  { key: 'DateOfBirth', label: 'Date of Birth' },
  { key: 'Subject', label: 'Subject' },
  { key: 'Position', label: 'Position' },
  { key: 'Class', label: 'Class' },
  { key: 'Section', label: 'Section' },
  { key: 'Qualification', label: 'Qualification' },
  { key: 'ExperienceYears', label: 'Experience (Yrs)' },
  { key: 'DateOfJoining', label: 'Date of Joining' },
  { key: 'Salary', label: 'Salary' },
  { key: 'PreviousSalary', label: 'Previous Salary' },
  { key: 'ContactNumber', label: 'Contact Number' },
  { key: 'Email', label: 'Email' },
  { key: 'Address', label: 'Address' },
  { key: 'City', label: 'City' },
  { key: 'State', label: 'State' },
  { key: 'PostalCode', label: 'Postal Code' },
  { key: 'Nationality', label: 'Nationality' },
  { key: 'BloodGroup', label: 'Blood Group' },
  { key: 'MaritalStatus', label: 'Marital Status' },
  { key: 'Caste', label: 'Caste' },
  { key: 'EmergencyContactName', label: 'Emergency Contact' },
  { key: 'EmergencyContactNumber', label: 'Emergency Number' },
  { key: 'VehicleNumber', label: 'Vehicle No' },
  { key: 'TransportNumber', label: 'Transport No' },
]

const STAFF_COLUMNS = [
  { key: 'StaffID', label: 'Staff ID' },
  { key: 'FullName', label: 'Full Name' },
  { key: 'Gender', label: 'Gender' },
  { key: 'DateOfBirth', label: 'Date of Birth' },
  { key: 'Role', label: 'Role' },
  { key: 'Qualification', label: 'Qualification' },
  { key: 'ExperienceYears', label: 'Experience (Yrs)' },
  { key: 'DateOfJoining', label: 'Date of Joining' },
  { key: 'Salary', label: 'Salary' },
  { key: 'PreviousSalary', label: 'Previous Salary' },
  { key: 'ContactNumber', label: 'Contact Number' },
  { key: 'Email', label: 'Email' },
  { key: 'Address', label: 'Address' },
  { key: 'City', label: 'City' },
  { key: 'State', label: 'State' },
  { key: 'PostalCode', label: 'Postal Code' },
  { key: 'Nationality', label: 'Nationality' },
  { key: 'MaritalStatus', label: 'Marital Status' },
  { key: 'Caste', label: 'Caste' },
  { key: 'EmergencyContactName', label: 'Emergency Contact' },
  { key: 'EmergencyContactNumber', label: 'Emergency Number' },
  { key: 'VehicleNumber', label: 'Vehicle No' },
  { key: 'TransportNumber', label: 'Transport No' },
]

const STUDENT_GROUPS = [
  { label: 'Basic Info', keys: ['StudentID','FullName','DOB','Gender','ClassID','SectionID','RollNo','AdmissionNo','JoiningDate','Status'] },
  { label: 'Contact', keys: ['Address','ContactNumber','EmailAddress','Nationality','IdentificationNumber','EnrollmentNumber'] },
  { label: 'Academic', keys: ['Program','YearSemester','GPA','Attendance','Subjects','PreviousRecord','HouseName','Cast'] },
  { label: 'Guardian', keys: ['GuardianName','GuardianRelation','GuardianContact','GuardianOccupation','GuardianAddress'] },
  { label: 'Fees & Transport', keys: ['PendingFee','DiscountAmount','Route','TransportStatus','VehicleNo'] },
]

const LIST_META = {
  Students: { columns: STUDENT_COLUMNS, groups: STUDENT_GROUPS, icon: GraduationCap },
  Teachers: { columns: TEACHER_COLUMNS, groups: [], icon: BookOpen },
  Staff:    { columns: STAFF_COLUMNS,   groups: [], icon: Users },
}

const DEFAULT_COLS = {
  Students: new Set(['FullName','ClassID','SectionID','RollNo','AdmissionNo','ContactNumber','GuardianName','PendingFee']),
  Teachers: new Set(['TeacherID','FullName','Subject','Position','Class','Section','ContactNumber','Email','Salary']),
  Staff:    new Set(['StaffID','FullName','Role','ContactNumber','Email','Salary']),
}

const OPERATORS = ['Contains', 'Equals', 'Starts with', 'Ends with', 'Is empty', 'Is not empty']
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCell(key, value) {
  if (value === null || value === undefined || value === '') return ''
  if (['DOB','JoiningDate','DateOfBirth','DateOfJoining'].includes(key)) {
    const d = new Date(value)
    if (!isNaN(d))
      return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  }
  return String(value)
}

function escapeCsv(val) {
  const s = String(val ?? '')
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g,'""')}"` : s
}

function matchesOperator(cellVal, operator, filterVal) {
  const cell = String(cellVal ?? '').toLowerCase()
  const fv   = filterVal.toLowerCase()
  switch (operator) {
    case 'Contains':     return cell.includes(fv)
    case 'Equals':       return cell === fv
    case 'Starts with':  return cell.startsWith(fv)
    case 'Ends with':    return cell.endsWith(fv)
    case 'Is empty':     return cell === ''
    case 'Is not empty': return cell !== ''
    default:             return true
  }
}

// ─── Column Filter Popup ──────────────────────────────────────────────────────
function ColumnFilterPopup({ label, filter, onApply, onClear, onClose }) {
  const [operator, setOperator] = useState(filter?.operator ?? 'Contains')
  const [value, setValue]       = useState(filter?.value ?? '')
  const ref = useRef(null)
  const noValue = operator === 'Is empty' || operator === 'Is not empty'

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-50 mt-1 w-56 bg-popover border border-border rounded-xl shadow-xl p-3.5 space-y-3"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3 w-3" />
        </button>
      </div>

      <Select value={operator} onValueChange={v => { setOperator(v); if (v === 'Is empty' || v === 'Is not empty') setValue('') }}>
        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {OPERATORS.map(op => <SelectItem key={op} value={op} className="text-xs">{op}</SelectItem>)}
        </SelectContent>
      </Select>

      {!noValue && (
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Value…"
          className="h-7 text-xs"
          onKeyDown={e => { if (e.key === 'Enter') { onApply({ operator, value }); onClose() } }}
          autoFocus
        />
      )}

      <div className="flex gap-2 pt-0.5">
        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs"
          onClick={() => { onClear(); onClose() }}>
          Clear
        </Button>
        <Button size="sm" className="flex-1 h-7 text-xs"
          onClick={() => { onApply({ operator, value }); onClose() }}>
          Apply
        </Button>
      </div>
    </div>
  )
}

// ─── Filterable Column Header ─────────────────────────────────────────────────
function FilterableHeader({ col, colFilter, onApply, onClear }) {
  const [open, setOpen] = useState(false)
  const isActive = !!colFilter

  return (
    <TableHead className="whitespace-nowrap text-xs px-3 py-2.5 relative group/head">
      <div className="flex items-center gap-1.5">
        <span className="font-medium">{col.label}</span>
        <button
          onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
          className={`p-0.5 rounded transition-colors ${
            isActive
              ? 'text-primary'
              : 'text-muted-foreground/50 hover:text-muted-foreground'
          }`}
        >
          <ListFilter className="h-3 w-3" />
        </button>
        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </div>

      {open && (
        <ColumnFilterPopup
          label={col.label}
          filter={colFilter}
          onApply={f => onApply(col.key, f)}
          onClear={() => onClear(col.key)}
          onClose={() => setOpen(false)}
        />
      )}
    </TableHead>
  )
}

// ─── Active Filter Chips ──────────────────────────────────────────────────────
function ActiveFilterChips({ colFilters, orderedCols, onClear, onClearAll }) {
  const active = Object.entries(colFilters)
  if (!active.length) return null

  return (
    <div className="flex items-center gap-1.5 flex-wrap px-4 py-2 border-b bg-primary/5">
      <span className="text-xs text-muted-foreground font-medium shrink-0">Active filters:</span>
      {active.map(([key, f]) => {
        const col = orderedCols.find(c => c.key === key)
        const noValue = f.operator === 'Is empty' || f.operator === 'Is not empty'
        return (
          <span key={key}
            className="inline-flex items-center gap-1 text-xs bg-background text-foreground border border-primary/30 rounded-full px-2.5 py-0.5 shadow-sm">
            <span className="font-medium text-primary">{col?.label ?? key}</span>
            <span className="text-muted-foreground">{f.operator}</span>
            {!noValue && f.value && <span className="font-medium">"{f.value}"</span>}
            <button onClick={() => onClear(key)}
              className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        )
      })}
      <button onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 ml-1">
        <FilterX className="h-3 w-3" /> Clear all
      </button>
    </div>
  )
}

// ─── Config Card ──────────────────────────────────────────────────────────────
function ConfigCard({ config, isActive, onSelect, onEdit, onDelete }) {
  return (
    <div onClick={onSelect}
      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${
        isActive ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/40 hover:bg-accent/60'
      }`}>
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />}
      <div className="flex-1 min-w-0 pl-1">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : ''}`}>{config.ConfigName || 'Untitled'}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{config.Columns?.length ?? 0} columns</p>
      </div>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
        <button onClick={e => { e.stopPropagation(); onEdit(config) }}
          className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="h-3 w-3" />
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(config) }}
          className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

// ─── Config Modal ─────────────────────────────────────────────────────────────
function ConfigModal({ open, onClose, listName, allColumns, initialData, onSave, isSaving }) {
  const [name, setName]         = useState('')
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch]     = useState('')

  useEffect(() => {
    if (open) { setName(initialData?.ConfigName ?? ''); setSelected(new Set(initialData?.Columns ?? [])); setSearch('') }
  }, [open, initialData])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? allColumns.filter(c => c.label.toLowerCase().includes(q)) : allColumns
  }, [allColumns, search])

  const toggle = (key) => setSelected(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })

  const handleSave = () => {
    if (!name.trim())   { toast.error('Config name is required'); return }
    if (!selected.size) { toast.error('Select at least one column'); return }
    onSave({ ConfigName: name.trim(), ListName: listName, Columns: [...selected] })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-primary" />
            {initialData ? 'Edit Config' : 'New Config'}
            <Badge variant="outline" className="text-xs font-normal ml-1">{listName}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div>
            <Label className="text-xs font-medium mb-1.5 block text-muted-foreground uppercase tracking-wide">Config Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Attendance Report" className="h-9" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Columns</Label>
              <Badge variant={selected.size ? 'default' : 'outline'} className="text-xs">{selected.size} selected</Badge>
            </div>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search columns…" className="pl-8 h-8 text-sm" />
            </div>
            <ScrollArea className="h-52 border rounded-lg px-1 py-1">
              <div className="space-y-0.5 px-1">
                {filtered.map(col => (
                  <div key={col.key} className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-accent cursor-pointer" onClick={() => toggle(col.key)}>
                    <Checkbox checked={selected.has(col.key)} onCheckedChange={() => toggle(col.key)} onClick={e => e.stopPropagation()} className="shrink-0" />
                    <Label className="text-sm font-normal cursor-pointer leading-none">{col.label}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="h-8 text-sm">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="h-8 text-sm">
            {isSaving ? 'Saving…' : initialData ? 'Update Config' : 'Create Config'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, pageSize, onPage, onPageSize, total, showing }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t bg-muted/20 shrink-0">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Rows per page</span>
        <Select value={String(pageSize)} onValueChange={v => onPageSize(Number(v))}>
          <SelectTrigger className="h-7 w-16 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map(n => <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>)}
          </SelectContent>
        </Select>
        <span>·</span>
        <span>{showing.from}–{showing.to} of <span className="font-medium text-foreground">{total}</span></span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPage(1)} disabled={page === 1}><ChevronsLeft className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPage(page-1)} disabled={page === 1}><ChevronLeft className="h-3.5 w-3.5" /></Button>
        <div className="flex items-center gap-1 mx-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p
            if (totalPages <= 5) p = i + 1
            else if (page <= 3) p = i + 1
            else if (page >= totalPages - 2) p = totalPages - 4 + i
            else p = page - 2 + i
            return (
              <button key={p} onClick={() => onPage(p)}
                className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${p === page ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}>
                {p}
              </button>
            )
          })}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPage(page+1)} disabled={page === totalPages}><ChevronRight className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPage(totalPages)} disabled={page === totalPages}><ChevronsRight className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  )
}

// ─── Tab Panel ────────────────────────────────────────────────────────────────
function ExportTabPanel({ listName, data, isDataLoading }) {
  const meta       = LIST_META[listName]
  const allColumns = meta.columns
  const groups     = meta.groups

  const { data: configsData, isLoading: configsLoading } = useCustomConfigs()
  const { mutate: createConfig, isPending: isCreating }  = useCreateCustomConfig()
  const { mutate: updateConfig, isPending: isUpdating }  = useUpdateCustomConfig()
  const { mutate: deleteConfig }                         = useDeleteCustomConfig()

  const configs = useMemo(
    () => (configsData?.data ?? []).filter(c => c.ListName === listName),
    [configsData, listName]
  )

  const [selectedCols, setSelectedCols]     = useState(new Set(DEFAULT_COLS[listName]))
  const [activeConfigId, setActiveConfigId] = useState(null)
  const [colSearch, setColSearch]           = useState('')
  const [globalSearch, setGlobalSearch]     = useState('')
  // { [colKey]: { operator: string, value: string } }
  const [colFilters, setColFilters]         = useState({})
  const [page, setPage]                     = useState(1)
  const [pageSize, setPageSize]             = useState(25)
  const [modalOpen, setModalOpen]           = useState(false)
  const [editingConfig, setEditingConfig]   = useState(null)
  const [deletingConfig, setDeletingConfig] = useState(null)

  const rows        = useMemo(() => data ?? [], [data])
  const orderedCols = allColumns.filter(c => selectedCols.has(c.key))

  useEffect(() => { setPage(1) }, [globalSearch, colFilters, selectedCols])

  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      // Global search across visible columns
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase()
        const hit = orderedCols.some(col => formatCell(col.key, row[col.key]).toLowerCase().includes(q))
        if (!hit) return false
      }
      // Per-column filters
      for (const [key, f] of Object.entries(colFilters)) {
        if (!matchesOperator(formatCell(key, row[key]), f.operator, f.value)) return false
      }
      return true
    })
  }, [rows, globalSearch, colFilters, orderedCols])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const pagedRows  = filteredRows.slice((safePage-1)*pageSize, safePage*pageSize)

  const filteredColOptions = useMemo(() => {
    const q = colSearch.trim().toLowerCase()
    return q ? allColumns.filter(c => c.label.toLowerCase().includes(q) || c.key.toLowerCase().includes(q)) : allColumns
  }, [colSearch, allColumns])

  const toggleCol   = (key) => setSelectedCols(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  const toggleGroup = (keys) => setSelectedCols(prev => { const n = new Set(prev); const allOn = keys.every(k => n.has(k)); keys.forEach(k => allOn ? n.delete(k) : n.add(k)); return n })
  const selectAll   = () => setSelectedCols(new Set(allColumns.map(c => c.key)))
  const clearAll    = () => setSelectedCols(new Set())
  const applyConfig = (config) => { setActiveConfigId(config.ConfigID ?? config.ID); setSelectedCols(new Set(config.Columns ?? [])) }

  const applyColFilter  = (key, f) => setColFilters(prev => ({ ...prev, [key]: f }))
  const clearColFilter  = (key) => setColFilters(prev => { const n = { ...prev }; delete n[key]; return n })
  const clearAllFilters = () => { setColFilters({}); setGlobalSearch('') }

  const activeFilterCount = Object.keys(colFilters).length + (globalSearch.trim() ? 1 : 0)

  const handleExport = () => {
    if (!orderedCols.length || !filteredRows.length) return
    const header  = orderedCols.map(c => escapeCsv(c.label)).join(',')
    const csvRows = filteredRows.map(r => orderedCols.map(c => escapeCsv(formatCell(c.key, r[c.key]))).join(','))
    const csv     = [header, ...csvRows].join('\n')
    const blob    = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url     = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href = url; a.download = `${listName.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
    toast.success(`Exported ${filteredRows.length} rows`)
  }

  const handleSaveConfig = (payload) => {
    if (editingConfig) {
      updateConfig({ id: editingConfig.ConfigID ?? editingConfig.ID, ...payload }, {
        onSuccess: () => { toast.success('Config updated'); setModalOpen(false); setEditingConfig(null) },
        onError: () => toast.error('Failed to update config'),
      })
    } else {
      createConfig(payload, {
        onSuccess: () => { toast.success('Config created'); setModalOpen(false) },
        onError: () => toast.error('Failed to create config'),
      })
    }
  }

  const handleDeleteConfig = () => {
    if (!deletingConfig) return
    deleteConfig(deletingConfig.ConfigID ?? deletingConfig.ID, {
      onSuccess: () => {
        toast.success('Config deleted')
        if (activeConfigId === (deletingConfig.ConfigID ?? deletingConfig.ID)) {
          setActiveConfigId(null); setSelectedCols(new Set(DEFAULT_COLS[listName]))
        }
        setDeletingConfig(null)
      },
      onError: () => toast.error('Failed to delete config'),
    })
  }

  const showing = {
    from: filteredRows.length === 0 ? 0 : (safePage-1)*pageSize+1,
    to:   Math.min(safePage*pageSize, filteredRows.length),
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4 h-full">

      {/* ══ LEFT SIDEBAR ══ */}
      <div className="flex flex-col gap-3">
        <Card className="shrink-0">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground" />
                <CardTitle className="text-sm">Saved Configs</CardTitle>
                {configs.length > 0 && <Badge variant="secondary" className="text-xs h-4 px-1.5">{configs.length}</Badge>}
              </div>
              <div className="flex items-center gap-1">
                {activeConfigId && (
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => { setActiveConfigId(null); setSelectedCols(new Set(DEFAULT_COLS[listName])) }}>
                    <X className="h-3 w-3 mr-1" />Reset
                  </Button>
                )}
                <Button size="sm" className="h-6 px-2 text-xs gap-1"
                  onClick={() => { setEditingConfig(null); setModalOpen(true) }}>
                  <Plus className="h-3 w-3" />New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            {configsLoading ? (
              <p className="text-xs text-muted-foreground text-center py-6">Loading…</p>
            ) : configs.length === 0 ? (
              <div className="text-center py-6 space-y-1">
                <LayoutTemplate className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                <p className="text-xs text-muted-foreground">No saved configs yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {configs.map((config, i) => (
                  <ConfigCard key={config.ConfigID ?? config.ID ?? i} config={config}
                    isActive={activeConfigId === (config.ConfigID ?? config.ID)}
                    onSelect={() => applyConfig(config)}
                    onEdit={c => { setEditingConfig(c); setModalOpen(true) }}
                    onDelete={c => setDeletingConfig(c)} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 min-h-0">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Columns3 className="h-3.5 w-3.5 text-muted-foreground" />
                <CardTitle className="text-sm">Columns</CardTitle>
              </div>
              <Badge variant={selectedCols.size ? 'default' : 'outline'} className="text-xs">
                {selectedCols.size}/{allColumns.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              <Input value={colSearch} onChange={e => setColSearch(e.target.value)} placeholder="Search columns…" className="pl-7 h-7 text-xs" />
              {colSearch && <button onClick={() => setColSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="flex-1 h-6 text-xs" onClick={selectAll}>All</Button>
              <Button variant="outline" size="sm" className="flex-1 h-6 text-xs" onClick={clearAll}>Clear</Button>
            </div>
            {!colSearch && groups.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {groups.map(g => {
                    const allOn = g.keys.every(k => selectedCols.has(k))
                    return (
                      <Badge key={g.label} variant={allOn ? 'default' : 'outline'}
                        className="cursor-pointer select-none text-xs hover:opacity-80 transition-opacity"
                        onClick={() => toggleGroup(g.keys)}>
                        {g.label}
                      </Badge>
                    )
                  })}
                </div>
                <Separator />
              </>
            )}
            <ScrollArea className="h-56 -mx-1 px-1">
              <div className="space-y-px">
                {filteredColOptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No columns match</p>
                ) : filteredColOptions.map(col => (
                  <div key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer" onClick={() => toggleCol(col.key)}>
                    <Checkbox checked={selectedCols.has(col.key)} onCheckedChange={() => toggleCol(col.key)} onClick={e => e.stopPropagation()} className="shrink-0 h-3.5 w-3.5" />
                    <Label className="text-xs font-normal cursor-pointer leading-none">{col.label}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ══ RIGHT MAIN ══ */}
      <div className="flex flex-col gap-3 min-w-0">
        {/* Toolbar */}
        <Card>
          <CardContent className="px-4 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input value={globalSearch} onChange={e => setGlobalSearch(e.target.value)}
                  placeholder="Search across all columns…" className="pl-8 h-8 text-sm" />
                {globalSearch && (
                  <button onClick={() => setGlobalSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 gap-1 text-xs text-muted-foreground">
                  <FilterX className="h-3.5 w-3.5" />Clear filters
                  <Badge variant="destructive" className="h-4 px-1.5 text-xs ml-0.5">{activeFilterCount}</Badge>
                </Button>
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                <div className="text-xs text-muted-foreground border rounded-md px-2.5 py-1.5 bg-muted/30 flex items-center gap-1">
                  <span className="font-medium text-foreground">{filteredRows.length}</span> rows ·
                  <span className="font-medium text-foreground">{orderedCols.length}</span> cols
                </div>
                <Button onClick={handleExport} disabled={!orderedCols.length || !filteredRows.length} size="sm" className="h-8 gap-1.5 text-xs">
                  <FileDown className="h-3.5 w-3.5" />Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Active filter chips */}
          <ActiveFilterChips colFilters={colFilters} orderedCols={orderedCols} onClear={clearColFilter} onClearAll={clearAllFilters} />

          <div className="flex-1 overflow-hidden flex flex-col">
            {isDataLoading ? (
              <div className="flex justify-center py-20"><CircleLoader /></div>
            ) : orderedCols.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <SlidersHorizontal className="h-6 w-6 opacity-40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">No columns selected</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">Pick columns from the sidebar</p>
                </div>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-6 w-6 opacity-40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">No records found</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">Try adjusting your search or column filters</p>
                  {activeFilterCount > 0 && (
                    <Button variant="link" size="sm" onClick={clearAllFilters} className="text-xs h-auto p-0 mt-1">Clear all filters</Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-auto flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-10 text-center text-xs text-muted-foreground font-medium px-2 sticky left-0 bg-muted/40">#</TableHead>
                        {orderedCols.map(col => (
                          <FilterableHeader key={col.key} col={col}
                            colFilter={colFilters[col.key]}
                            onApply={applyColFilter}
                            onClear={clearColFilter} />
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedRows.map((row, i) => (
                        <TableRow key={row.StudentID ?? row.TeacherID ?? row.StaffID ?? i} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-center text-xs text-muted-foreground/50 px-2 sticky left-0 bg-background">
                            {(safePage-1)*pageSize+i+1}
                          </TableCell>
                          {orderedCols.map(col => {
                            const val      = formatCell(col.key, row[col.key])
                            const isFiltered = !!colFilters[col.key]
                            return (
                              <TableCell key={col.key}
                                className={`text-xs whitespace-nowrap max-w-48 truncate transition-colors ${isFiltered ? 'bg-primary/5' : ''}`}
                                title={val || undefined}>
                                {val || <span className="text-muted-foreground/25">—</span>}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Pagination page={safePage} totalPages={totalPages} pageSize={pageSize}
                  onPage={p => setPage(Math.max(1, Math.min(p, totalPages)))}
                  onPageSize={n => { setPageSize(n); setPage(1) }}
                  total={filteredRows.length} showing={showing} />
              </>
            )}
          </div>
        </Card>
      </div>

      <ConfigModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingConfig(null) }}
        listName={listName} allColumns={allColumns} initialData={editingConfig}
        onSave={handleSaveConfig} isSaving={isCreating || isUpdating} />

      <AlertDialog open={!!deletingConfig} onOpenChange={() => setDeletingConfig(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Config</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">"{deletingConfig?.ConfigName}"</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfig} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExportPage() {
  const { data: rawStudents, isLoading: studentsLoading } = useStudents()
  const { data: rawTeachers, isLoading: teachersLoading } = useTeachers()
  const { data: rawStaffs,   isLoading: staffsLoading }   = useStaffs()

  const students = rawStudents?.data ?? []
  const teachers = rawTeachers?.data ?? []
  const staffs   = rawStaffs?.data   ?? []

  return (
    <div className="flex flex-col h-full p-6 gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Download className="h-4 w-4 text-primary" />
          </div>
          Export Data
        </h1>
        <p className="text-sm text-muted-foreground mt-1 ml-10">Configure columns, filter records, and export CSV reports.</p>
      </div>

      <Tabs defaultValue="Students" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit h-9">
          <TabsTrigger value="Students" className="gap-1.5 text-sm px-4">
            <GraduationCap className="h-3.5 w-3.5" />Students
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-0.5">{students.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Teachers" className="gap-1.5 text-sm px-4">
            <BookOpen className="h-3.5 w-3.5" />Teachers
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-0.5">{teachers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Staff" className="gap-1.5 text-sm px-4">
            <Users className="h-3.5 w-3.5" />Staff
            <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-0.5">{staffs.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Students" className="flex-1 mt-4 min-h-0">
          <ExportTabPanel listName="Students" data={students} isDataLoading={studentsLoading} />
        </TabsContent>
        <TabsContent value="Teachers" className="flex-1 mt-4 min-h-0">
          <ExportTabPanel listName="Teachers" data={teachers} isDataLoading={teachersLoading} />
        </TabsContent>
        <TabsContent value="Staff" className="flex-1 mt-4 min-h-0">
          <ExportTabPanel listName="Staff" data={staffs} isDataLoading={staffsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
