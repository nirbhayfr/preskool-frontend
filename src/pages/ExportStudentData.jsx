import { useState, useMemo } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useStudents } from '@/hooks/useStudents'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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

import { Download, Search, X, SlidersHorizontal, TableIcon, FilterX } from 'lucide-react'
import { classes, sections } from '@/data/basicData'

// ─── Column definitions ───────────────────────────────────────────────────────
const ALL_COLUMNS = [
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

const COLUMN_GROUPS = [
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

const DEFAULT_COLS = new Set([
  'FullName',
  'ClassID',
  'SectionID',
  'RollNo',
  'AdmissionNo',
  'ContactNumber',
  'GuardianName',
  'PendingFee',
])

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCell(key, value) {
  if (value === null || value === undefined || value === '') return ''
  if (key === 'DOB' || key === 'JoiningDate') {
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function ExportStudentData() {
  const { data: rawData, isLoading, isError } = useStudents()

  const [selectedCols, setSelectedCols] = useState(new Set(DEFAULT_COLS))
  const [colSearch, setColSearch] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [filterSection, setFilterSection] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTransport, setFilterTransport] = useState('all')
  const [filterSearch, setFilterSearch] = useState('')

  // ── Data ──
  const students = useMemo(() => rawData?.data ?? [], [rawData])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filterClass !== 'all' && s.ClassID !== filterClass) return false
      if (filterSection !== 'all' && s.SectionID !== filterSection) return false
      if (
        filterStatus !== 'all' &&
        (s.Status || '').toLowerCase() !== filterStatus.toLowerCase()
      )
        return false
      // After
      if (filterTransport !== 'all') {
        const transportVal = (s.TransportStatus || '').trim() || 'No'
        if (transportVal !== filterTransport) return false
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
  }, [students, filterClass, filterSection, filterStatus, filterTransport, filterSearch])

  const orderedCols = ALL_COLUMNS.filter((c) => selectedCols.has(c.key))

  const filteredColOptions = useMemo(() => {
    const q = colSearch.trim().toLowerCase()
    return q
      ? ALL_COLUMNS.filter(
          (c) => c.label.toLowerCase().includes(q) || c.key.toLowerCase().includes(q)
        )
      : ALL_COLUMNS
  }, [colSearch])

  // ── Column helpers ──
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

  const selectAll = () => setSelectedCols(new Set(ALL_COLUMNS.map((c) => c.key)))
  const clearAll = () => setSelectedCols(new Set())

  const hasActiveFilters =
    filterClass !== 'all' ||
    filterSection !== 'all' ||
    filterStatus !== 'all' ||
    filterTransport !== 'all' ||
    filterSearch.trim() !== ''

  const clearFilters = () => {
    setFilterClass('all')
    setFilterSection('all')
    setFilterStatus('all')
    setFilterTransport('all')
    setFilterSearch('')
  }

  // ── Export ──
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
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  // ─────────────────────────────────────────────────────────────────────────
  if (isLoading) return <CircleLoader />
  if (isError) return <p className="p-8 text-destructive">Failed to load students.</p>

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            Export Students
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose columns, filter rows, then download as CSV.
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={!orderedCols.length || !filteredStudents.length}
          className="gap-2 shrink-0"
        >
          <Download className="h-4 w-4" />
          Export
          <Badge variant="secondary" className="ml-0.5 text-xs font-medium">
            {filteredStudents.length}r · {orderedCols.length}c
          </Badge>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6 items-start">
        {/* ══ LEFT: Column selector ══ */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Columns</CardTitle>
              <Badge variant="outline" className="text-xs">
                {selectedCols.size} / {ALL_COLUMNS.length}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Toggle fields or select by group.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-0 h-full">
            {/* Search */}
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Select All / Clear */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={selectAll}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>

            {/* Group shortcuts */}
            {!colSearch && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-1.5">
                  {COLUMN_GROUPS.map((g) => {
                    const allOn = g.keys.every((k) => selectedCols.has(k))
                    return (
                      <Badge
                        key={g.label}
                        variant={allOn ? 'default' : 'outline'}
                        className="cursor-pointer select-none text-xs transition-colors hover:opacity-80"
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

            {/* Checkbox list */}
            <ScrollArea className="h-72 -mx-1 px-1">
              <div className="space-y-px">
                {filteredColOptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No columns match "{colSearch}"
                  </p>
                ) : (
                  filteredColOptions.map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => toggleCol(col.key)}
                    >
                      <Checkbox
                        id={`col-${col.key}`}
                        checked={selectedCols.has(col.key)}
                        onCheckedChange={() => toggleCol(col.key)}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0"
                      />
                      <Label
                        htmlFor={`col-${col.key}`}
                        className="text-sm font-normal cursor-pointer leading-none"
                      >
                        {col.label}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* ══ RIGHT: Filters + Preview ══ */}
        <div className="space-y-4 min-w-0">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Filter Rows</CardTitle>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <FilterX className="h-3.5 w-3.5" />
                    Clear filters
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative sm:col-span-2 lg:col-span-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    placeholder="Search by name, admission no, roll no, student ID…"
                    className="pl-9"
                  />
                  {filterSearch && (
                    <button
                      onClick={() => setFilterSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Class */}
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger>
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

                {/* Section */}
                <Select value={filterSection} onValueChange={setFilterSection}>
                  <SelectTrigger>
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

                {/* Status */}
                {/* <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}

                {/* Transport */}
                <Select value={filterTransport} onValueChange={setFilterTransport}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transport</SelectItem>
                    <SelectItem value="Yes">Transport</SelectItem>
                    <SelectItem value="No">Non-Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <TableIcon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Preview</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {filteredStudents.length} rows
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">First 5 rows shown</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0 px-0 pb-0">
              {orderedCols.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                  <SlidersHorizontal className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Select at least one column to preview</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                  <Search className="h-8 w-8 opacity-30" />
                  <p className="text-sm">No students match the current filters</p>
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
                      {filteredStudents.slice(0, 5).map((student, i) => (
                        <TableRow key={student.StudentID ?? i}>
                          {orderedCols.map((col) => {
                            const val = formatCell(col.key, student[col.key])
                            return (
                              <TableCell
                                key={col.key}
                                className="text-xs whitespace-nowrap max-w-[180px] truncate"
                                title={val || undefined}
                              >
                                {val || (
                                  <span className="text-muted-foreground/30">—</span>
                                )}
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
      </div>
    </div>
  )
}
