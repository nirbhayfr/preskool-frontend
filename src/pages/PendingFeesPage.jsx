import { useMemo, useState } from 'react'
import { usePendingFees } from '@/hooks/usePendingFees'
import { classes, sections } from '@/data/basicData'
import TableLayout from '@/components/layout/Table'
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
import { Badge } from '@/components/ui/badge'

import {
  Mail,
  X,
  Users,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  IndianRupee,
  Download,
} from 'lucide-react'

export default function PendingFeesPage() {
  const [selectedClass, setSelectedClass] = useState(classes[0] || '')
  const [selectedSection, setSelectedSection] = useState('all')
  const [minPending, setMinPending] = useState('')
  const [selectedFeeType, setSelectedFeeType] = useState('all')

  const filters = useMemo(() => {
    if (!selectedClass) return null
    if (selectedSection === 'all') return { ClassID: selectedClass }
    return { ClassID: selectedClass, SectionID: selectedSection }
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

  const availableFeeTypes = useMemo(() => {
    const types = new Set()
    tableData.forEach((row) => {
      if (row.FeeType) {
        types.add(row.FeeType)
      }
    })
    return Array.from(types).sort()
  }, [tableData])

  const filteredStudents = useMemo(() => {
    let students = groupedStudents

    // Filter by min pending amount
    if (minPending) {
      const min = Number(minPending)
      students = students.filter((s) => {
        const total = s.fees.reduce((sum, f) => sum + Number(f.PendingAmount || 0), 0)
        return total >= min
      })
    }

    // Filter by fee type
    if (selectedFeeType !== 'all') {
      students = students.filter((s) => s.fees.some((f) => f.FeeType === selectedFeeType))
    }

    return students
  }, [groupedStudents, minPending, selectedFeeType])

  const summary = useMemo(() => {
    if (!tableData.length) return null
    const totalPending = tableData.reduce(
      (sum, row) => sum + Number(row.PendingAmount || 0),
      0
    )
    const totalPaid = tableData.reduce((sum, row) => sum + Number(row.PaidAmount || 0), 0)
    const uniqueStudents = new Set(tableData.map((r) => r.StudentID)).size
    return { totalPending, totalPaid, uniqueStudents }
  }, [tableData])

  const handleExport = () => {
    const headers = [
      'Student ID',
      'Full Name',
      'Class',
      'Section',
      'Fee Type',
      'Paid Amount',
      'Pending Amount',
    ]

    const rows = filteredStudents.flatMap((student) =>
      student.fees.map((fee) => [
        student.StudentID,
        student.FullName,
        student.ClassID,
        student.SectionID,
        fee.FeeType.replaceAll('_', ' '),
        fee.PaidAmount || 0,
        fee.PendingAmount || 0,
      ])
    )

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `pending-fees-${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'StudentID',
        header: 'Student ID',
        cell: ({ row }) => (
          <span className="text-xs font-mono text-muted-foreground">
            #{row.original.StudentID}
          </span>
        ),
      },
      {
        accessorKey: 'FullName',
        header: 'Student',
        cell: ({ row }) => {
          const { FullName, ClassID, SectionID } = row.original
          return (
            <div>
              <p className="font-medium text-sm">{FullName}</p>
              <p className="text-xs text-muted-foreground">
                Class {ClassID} · {SectionID}
              </p>
            </div>
          )
        },
      },
      {
        id: 'feeTypes',
        header: 'Fee Types',
        cell: ({ row }) => {
          const types = row.original.fees.map((f) => f.FeeType)
          return (
            <div className="flex flex-wrap gap-1">
              {types.slice(0, 3).map((t, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-xs capitalize px-1.5 py-0"
                >
                  {t.replaceAll('_', ' ')}
                </Badge>
              ))}
              {types.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{types.length - 3}
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        id: 'totalPaid',
        header: 'Paid',
        cell: ({ row }) => {
          const total = row.original.fees.reduce(
            (sum, f) => sum + Number(f.PaidAmount || 0),
            0
          )
          return (
            <span className="text-emerald-600 font-semibold text-sm">
              ₹{total.toLocaleString('en-IN')}
            </span>
          )
        },
      },
      {
        id: 'totalPending',
        header: 'Pending',
        cell: ({ row }) => {
          const total = row.original.fees.reduce(
            (sum, f) => sum + Number(f.PendingAmount || 0),
            0
          )
          return (
            <span
              className={`font-bold text-sm ${total > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              ₹{total.toLocaleString('en-IN')}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const student = row.original
          return (
            <div className="flex items-center gap-2 justify-end">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
              <Button asChild size="sm" variant="outline" className="h-7 gap-1 text-xs">
                <Link to={`/pay-fees/${student.StudentID}`}>
                  Pay Fees
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          )
        },
      },
    ],
    []
  )

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
            Failed to load pending fees. {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5">
      {/* ── Header ─��� */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pending Fees</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectedClass ? `Class ${selectedClass}` : 'All classes'}
            {selectedSection !== 'all' ? ` · Section ${selectedSection}` : ''}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
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

          <Select value={selectedSection} onValueChange={setSelectedSection}>
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

          <Select value={selectedFeeType} onValueChange={setSelectedFeeType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Fee Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fee Types</SelectItem>
              {availableFeeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replaceAll('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleExport}
            disabled={filteredStudents.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="py-4 px-5">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold mt-0.5">{summary.uniqueStudents}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="py-4 px-5">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600">Total Paid</p>
                <p className="text-2xl font-bold text-emerald-600 mt-0.5">
                  ₹{summary.totalPaid.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="py-4 px-5">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-red-500">Total Pending</p>
                <p className="text-2xl font-bold text-red-500 mt-0.5">
                  ₹{summary.totalPending.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Min Filter ── */}
      {groupedStudents.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="number"
              placeholder="Min pending amount"
              value={minPending}
              onChange={(e) => setMinPending(e.target.value)}
              min={0}
              className="pl-8 w-52 h-8 text-sm"
            />
          </div>
          {minPending && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMinPending('')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          {minPending && (
            <span className="text-xs text-muted-foreground">
              {filteredStudents.length} of {groupedStudents.length} students
            </span>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <IndianRupee className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No pending fees found.</p>
          </div>
        ) : (
          <TableLayout columns={columns} data={filteredStudents} />
        )}
      </div>
    </div>
  )
}
