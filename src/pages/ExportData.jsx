import { useState, useMemo, useEffect } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Download,
  Search,
  X,
  SlidersHorizontal,
  TableIcon,
  FilterX,
  Plus,
  Trash2,
  Pencil,
  BookOpen,
  Users,
  GraduationCap,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTeachers } from '@/hooks/useTeacher'
import { useStaffs } from '@/hooks/useStaff'

// ─── Column definitions per list ─────────────────────────────────────────────
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
  {
    label: 'Basic Info',
    keys: [
      'StudentID',
      'FullName',
      'DOB',
      'Gender',
      'ClassID',
      'SectionID',
      'RollNo',
      'AdmissionNo',
      'JoiningDate',
      'Status',
    ],
  },
  {
    label: 'Contact',
    keys: [
      'Address',
      'ContactNumber',
      'EmailAddress',
      'Nationality',
      'IdentificationNumber',
      'EnrollmentNumber',
    ],
  },
  {
    label: 'Academic',
    keys: [
      'Program',
      'YearSemester',
      'GPA',
      'Attendance',
      'Subjects',
      'PreviousRecord',
      'HouseName',
      'Cast',
    ],
  },
  {
    label: 'Guardian',
    keys: [
      'GuardianName',
      'GuardianRelation',
      'GuardianContact',
      'GuardianOccupation',
      'GuardianAddress',
    ],
  },
  {
    label: 'Fees & Transport',
    keys: ['PendingFee', 'DiscountAmount', 'Route', 'TransportStatus', 'VehicleNo'],
  },
]

const LIST_META = {
  Students: {
    columns: STUDENT_COLUMNS,
    groups: STUDENT_GROUPS,
    icon: GraduationCap,
    color: 'text-blue-600',
  },
  Teachers: {
    columns: TEACHER_COLUMNS,
    groups: [],
    icon: BookOpen,
    color: 'text-emerald-600',
  },
  Staff: { columns: STAFF_COLUMNS, groups: [], icon: Users, color: 'text-orange-600' },
}

const DEFAULT_COLS = {
  Students: new Set([
    'FullName',
    'ClassID',
    'SectionID',
    'RollNo',
    'AdmissionNo',
    'ContactNumber',
    'GuardianName',
    'PendingFee',
  ]),
  Teachers: new Set([
    'TeacherID',
    'FullName',
    'Subject',
    'Position',
    'Class',
    'Section',
    'ContactNumber',
    'Email',
    'Salary',
  ]),
  Staff: new Set(['StaffID', 'FullName', 'Role', 'ContactNumber', 'Email', 'Salary']),
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCell(key, value) {
  if (value === null || value === undefined || value === '') return ''
  if (['DOB', 'JoiningDate', 'DateOfBirth', 'DateOfJoining'].includes(key)) {
    const d = new Date(value)
    if (!isNaN(d))
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  }
  return String(value)
}

function escapeCsv(val) {
  const s = String(val ?? '')
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

// ─── Config Card ─────────────────────────────────────────────────────────────
function ConfigCard({ config, isActive, onSelect, onEdit, onDelete }) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${
        isActive
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{config.ConfigName || 'Untitled'}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {config.Columns?.length ?? 0} columns
        </p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(config)
          }}
          className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(config)
          }}
          className="p-1 rounded hover:bg-background text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full" />
      )}
    </div>
  )
}

// ─── Config Modal ─────────────────────────────────────────────────────────────
function ConfigModal({
  open,
  onClose,
  listName,
  allColumns,
  initialData,
  onSave,
  isSaving,
}) {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')

  // Re-sync whenever the modal opens or initialData changes
  useEffect(() => {
    if (open) {
      setName(initialData?.ConfigName ?? '')
      setSelected(new Set(initialData?.Columns ?? []))
      setSearch('')
    }
  }, [open, initialData])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? allColumns.filter((c) => c.label.toLowerCase().includes(q)) : allColumns
  }, [allColumns, search])

  const toggle = (key) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Config name is required')
      return
    }
    if (!selected.size) {
      toast.error('Select at least one column')
      return
    }
    onSave({ ConfigName: name.trim(), ListName: listName, Columns: [...selected] })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Config' : 'New Config'} — {listName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs mb-1.5 block">Config Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Attendance Report"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs">Columns</Label>
              <Badge variant="outline" className="text-xs">
                {selected.size} selected
              </Badge>
            </div>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search columns…"
                className="pl-8 h-8 text-sm"
              />
            </div>
            <ScrollArea className="h-56 border rounded-md px-2 py-1">
              <div className="space-y-px">
                {filtered.map((col) => (
                  <div
                    key={col.key}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => toggle(col.key)}
                  >
                    <Checkbox
                      checked={selected.has(col.key)}
                      onCheckedChange={() => toggle(col.key)}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    />
                    <Label className="text-sm font-normal cursor-pointer leading-none">
                      {col.label}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : initialData ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Tab Panel ────────────────────────────────────────────────────────────────
function ExportTabPanel({ listName, data, isDataLoading }) {
  const meta = LIST_META[listName]
  const allColumns = meta.columns
  const groups = meta.groups

  const { data: configsData, isLoading: configsLoading } = useCustomConfigs()
  const { mutate: createConfig, isPending: isCreating } = useCreateCustomConfig()
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateCustomConfig()
  const { mutate: deleteConfig } = useDeleteCustomConfig()

  const configs = useMemo(
    () => (configsData?.data ?? []).filter((c) => c.ListName === listName),
    [configsData, listName]
  )

  const [selectedCols, setSelectedCols] = useState(new Set(DEFAULT_COLS[listName]))
  const [activeConfigId, setActiveConfigId] = useState(null)
  const [colSearch, setColSearch] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [filterSection, setFilterSection] = useState('all')
  const [filterTransport, setFilterTransport] = useState('all')
  const [filterSearch, setFilterSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState(null)
  const [deletingConfig, setDeletingConfig] = useState(null)

  const students = useMemo(() => data ?? [], [data])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filterClass !== 'all' && s.ClassID !== filterClass) return false
      if (filterSection !== 'all' && s.SectionID !== filterSection) return false
      if (filterTransport !== 'all') {
        const tv = (s.TransportStatus || '').trim() || 'No'
        if (tv !== filterTransport) return false
      }
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase()
        return (
          (s.FullName || '').toLowerCase().includes(q) ||
          (s.AdmissionNo || '').toLowerCase().includes(q) ||
          String(s.RollNo || '')
            .toLowerCase()
            .includes(q) ||
          String(s.StudentID || '').includes(q)
        )
      }
      return true
    })
  }, [students, filterClass, filterSection, filterTransport, filterSearch])

  const orderedCols = allColumns.filter((c) => selectedCols.has(c.key))

  const filteredColOptions = useMemo(() => {
    const q = colSearch.trim().toLowerCase()
    return q
      ? allColumns.filter(
          (c) => c.label.toLowerCase().includes(q) || c.key.toLowerCase().includes(q)
        )
      : allColumns
  }, [colSearch, allColumns])

  const toggleCol = (key) =>
    setSelectedCols((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const toggleGroup = (keys) =>
    setSelectedCols((prev) => {
      const next = new Set(prev)
      const allOn = keys.every((k) => next.has(k))
      keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)))
      return next
    })

  const selectAll = () => setSelectedCols(new Set(allColumns.map((c) => c.key)))
  const clearAll = () => setSelectedCols(new Set())

  const applyConfig = (config) => {
    setActiveConfigId(config.ConfigID ?? config.ID)
    setSelectedCols(new Set(config.Columns ?? []))
  }

  const hasActiveFilters =
    filterClass !== 'all' ||
    filterSection !== 'all' ||
    filterTransport !== 'all' ||
    filterSearch.trim() !== ''

  const clearFilters = () => {
    setFilterClass('all')
    setFilterSection('all')
    setFilterTransport('all')
    setFilterSearch('')
  }

  const handleExport = () => {
    if (!orderedCols.length || !filteredStudents.length) return
    const header = orderedCols.map((c) => escapeCsv(c.label)).join(',')
    const rows = filteredStudents.map((s) =>
      orderedCols.map((c) => escapeCsv(formatCell(c.key, s[c.key]))).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${listName.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  const handleSaveConfig = (payload) => {
    if (editingConfig) {
      updateConfig(
        { id: editingConfig.ConfigID ?? editingConfig.ID, ...payload },
        {
          onSuccess: () => {
            toast.success('Config updated')
            setModalOpen(false)
            setEditingConfig(null)
          },
          onError: () => toast.error('Failed to update config'),
        }
      )
    } else {
      createConfig(payload, {
        onSuccess: () => {
          toast.success('Config created')
          setModalOpen(false)
        },
        onError: () => toast.error('Failed to create config'),
      })
    }
  }

  const handleDeleteConfig = () => {
    if (!deletingConfig) return
    deleteConfig(deletingConfig.ConfigID ?? deletingConfig.ID, {
      onSuccess: () => {
        toast.success('Config deleted')
        if (activeConfigId === (deletingConfig.ConfigID ?? deletingConfig.id)) {
          setActiveConfigId(null)
          setSelectedCols(new Set(DEFAULT_COLS[listName]))
        }
        setDeletingConfig(null)
      },
      onError: () => toast.error('Failed to delete config'),
    })
  }

  console.log(activeConfigId)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4 h-full">
      {/* ══ LEFT SIDEBAR ══ */}
      <div className="space-y-4">
        {/* Saved Configs */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Saved Configs</CardTitle>
              <div className="flex items-center gap-1.5">
                {activeConfigId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setActiveConfigId(null)
                      setSelectedCols(new Set(DEFAULT_COLS[listName]))
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
                <Button
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => {
                    setEditingConfig(null)
                    setModalOpen(true)
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {configsLoading ? (
              <p className="text-xs text-muted-foreground text-center py-4">Loading…</p>
            ) : configs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No configs yet
              </p>
            ) : (
              <div className="space-y-1">
                {configs.map((config, i) => (
                  <ConfigCard
                    key={config.ConfigID ?? config.ID ?? i}
                    config={config}
                    isActive={activeConfigId === (config.ConfigID ?? config.ID)}
                    onSelect={() => applyConfig(config)}
                    onEdit={(c) => {
                      setEditingConfig(c)
                      setModalOpen(true)
                    }}
                    onDelete={(c) => setDeletingConfig(c)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Column Selector */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Columns</CardTitle>
              <Badge variant="outline" className="text-xs">
                {selectedCols.size}/{allColumns.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={colSearch}
                onChange={(e) => setColSearch(e.target.value)}
                placeholder="Search columns…"
                className="pl-8 h-8 text-sm"
              />
              {colSearch && (
                <button
                  onClick={() => setColSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={selectAll}
              >
                All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={clearAll}
              >
                Clear
              </Button>
            </div>

            {!colSearch && groups.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {groups.map((g) => {
                    const allOn = g.keys.every((k) => selectedCols.has(k))
                    return (
                      <Badge
                        key={g.label}
                        variant={allOn ? 'default' : 'outline'}
                        className="cursor-pointer select-none text-xs hover:opacity-80"
                        onClick={() => toggleGroup(g.keys)}
                      >
                        {g.label}
                      </Badge>
                    )
                  })}
                </div>
                <Separator />
              </>
            )}

            <ScrollArea className="h-64 -mx-1 px-1">
              <div className="space-y-px">
                {filteredColOptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    No columns match
                  </p>
                ) : (
                  filteredColOptions.map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => toggleCol(col.key)}
                    >
                      <Checkbox
                        checked={selectedCols.has(col.key)}
                        onCheckedChange={() => toggleCol(col.key)}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0"
                      />
                      <Label className="text-xs font-normal cursor-pointer leading-none">
                        {col.label}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ══ RIGHT MAIN ══ */}
      <div className="space-y-4 min-w-0">
        {/* Filters + Export */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filter Rows</CardTitle>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 gap-1 text-xs text-muted-foreground"
                  >
                    <FilterX className="h-3.5 w-3.5" /> Clear
                  </Button>
                )}
                <Button
                  onClick={handleExport}
                  disabled={!orderedCols.length || !filteredStudents.length}
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                  <Badge variant="secondary" className="text-xs ml-0.5 px-1.5">
                    {filteredStudents.length}r · {orderedCols.length}c
                  </Badge>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 pb-6">
              <div className="relative flex-2 min-w-50">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search by name, admission no…"
                  className="pl-8 h-8 text-sm"
                />
                {filterSearch && (
                  <button
                    onClick={() => setFilterSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {listName === 'Students' && (
                <>
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="h-8 text-sm w-32.5">
                      <SelectValue placeholder="All Classes" />
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

                  <Select value={filterSection} onValueChange={setFilterSection}>
                    <SelectTrigger className="h-8 text-sm w-32.5">
                      <SelectValue placeholder="All Sections" />
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

                  <Select value={filterTransport} onValueChange={setFilterTransport}>
                    <SelectTrigger className="h-8 text-sm w-37.5">
                      <SelectValue placeholder="All Transport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transport</SelectItem>
                      <SelectItem value="Yes">Transport</SelectItem>
                      <SelectItem value="No">Non-Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm">Data Preview</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {filteredStudents.length} rows
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">First 10 rows shown</span>
            </div>
          </CardHeader>

          <CardContent className="pt-0 px-0 pb-0">
            {isDataLoading ? (
              <div className="flex justify-center py-12">
                <CircleLoader />
              </div>
            ) : orderedCols.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <SlidersHorizontal className="h-8 w-8 opacity-30" />
                <p className="text-sm">Select at least one column to preview</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <Search className="h-8 w-8 opacity-30" />
                <p className="text-sm">No records match the current filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-b-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {orderedCols.map((col) => (
                        <TableHead key={col.key} className="whitespace-nowrap text-xs">
                          {col.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.slice(0, 10).map((row, i) => (
                      <TableRow key={row.StudentID ?? row.TeacherID ?? row.StaffID ?? i}>
                        {orderedCols.map((col) => {
                          const val = formatCell(col.key, row[col.key])
                          return (
                            <TableCell
                              key={col.key}
                              className="text-xs whitespace-nowrap max-w-45 truncate"
                              title={val || undefined}
                            >
                              {val || <span className="text-muted-foreground/30">—</span>}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Config Modal */}
      <ConfigModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingConfig(null)
        }}
        listName={listName}
        allColumns={allColumns}
        initialData={editingConfig}
        onSave={handleSaveConfig}
        isSaving={isCreating || isUpdating}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deletingConfig} onOpenChange={() => setDeletingConfig(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Config</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingConfig?.ConfigName}"? This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfig}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
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
  const { data: rawStaffs, isLoading: staffsLoading } = useStaffs()

  const students = rawStudents?.data ?? []
  const teachers = rawTeachers?.data ?? []
  const staffs = rawStaffs?.data ?? []

  return (
    <div className="flex flex-col h-full p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Download className="h-6 w-6 text-primary" />
          Export Data
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage export configs and download CSV reports for students, teachers, and
          staff.
        </p>
      </div>

      <Tabs defaultValue="Students" className="flex-1 flex flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="Students" className="gap-2">
            <GraduationCap className="h-4 w-4" /> Students
          </TabsTrigger>
          <TabsTrigger value="Teachers" className="gap-2">
            <BookOpen className="h-4 w-4" /> Teachers
          </TabsTrigger>
          <TabsTrigger value="Staff" className="gap-2">
            <Users className="h-4 w-4" /> Staff
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Students" className="flex-1 mt-4">
          <ExportTabPanel
            listName="Students"
            data={students}
            isDataLoading={studentsLoading}
          />
        </TabsContent>

        <TabsContent value="Teachers" className="flex-1 mt-4">
          <ExportTabPanel
            listName="Teachers"
            data={teachers}
            isDataLoading={teachersLoading}
          />
        </TabsContent>

        <TabsContent value="Staff" className="flex-1 mt-4">
          <ExportTabPanel listName="Staff" data={staffs} isDataLoading={staffsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
