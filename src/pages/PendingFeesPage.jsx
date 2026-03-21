import { useMemo, useState } from 'react'
import { usePendingFees } from '@/hooks/usePendingFees'
import { classes, sections } from '@/data/basicData'
import TableLayout from '@/components/layout/Table'
import { CircleLoader } from '@/components/layout/RouteLoader'

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

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

export default function PendingFeesPage() {
  const [selectedClass, setSelectedClass] = useState(classes[0] || '')
  const [selectedSection, setSelectedSection] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [minPending, setMinPending] = useState('')

  const filters = useMemo(() => {
    if (!selectedClass) return null

    if (selectedSection === 'all') {
      return { ClassID: selectedClass }
    }

    return {
      ClassID: selectedClass,
      SectionID: selectedSection,
    }
  }, [selectedClass, selectedSection])

  const { data, isLoading, isError, error } = usePendingFees(filters)
  const tableData = data?.data || []

  // 🔹 Group by StudentID
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

  const filteredStudents = useMemo(() => {
    if (!minPending) return groupedStudents
    const min = Number(minPending)
    return groupedStudents.filter((s) => {
      const total = s.fees.reduce((sum, f) => sum + Number(f.PendingAmount || 0), 0)
      return total >= min
    })
  }, [groupedStudents, minPending])

  // 🔹 Summary Stats
  const summary = useMemo(() => {
    if (!tableData.length) return null

    const totalPending = tableData.reduce(
      (sum, row) => sum + Number(row.PendingAmount || 0),
      0
    )

    const totalPaid = tableData.reduce((sum, row) => sum + Number(row.PaidAmount || 0), 0)

    const uniqueStudents = new Set(tableData.map((r) => r.StudentID)).size

    return {
      totalPending,
      totalPaid,
      uniqueStudents,
    }
  }, [tableData])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'StudentID',
        header: 'Student ID',
        cell: ({ row }) => <span className="text-primary">{row.original.StudentID}</span>,
      },
      {
        accessorKey: 'FullName',
        header: 'Student Name',
        cell: ({ row }) => <span className="font-medium">{row.original.FullName}</span>,
      },

      // ✅ NEW COLUMN
      {
        id: 'totalPaid',
        header: 'Total Paid',
        cell: ({ row }) => {
          const totalPaid = row.original.fees.reduce(
            (sum, f) => sum + Number(f.PaidAmount || 0),
            0
          )

          return <span className="text-green-600 font-semibold">₹ {totalPaid}</span>
        },
      },

      {
        id: 'totalPending',
        header: 'Total Pending',
        cell: ({ row }) => {
          const totalPending = row.original.fees.reduce(
            (sum, f) => sum + Number(f.PendingAmount || 0),
            0
          )

          return <span className="text-red-600 font-bold">₹ {totalPending}</span>
        },
      },

      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const student = row.original

          const handleMail = () => {
            console.log('Send mail to:', student.StudentID)
          }

          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedStudent(student)}
              >
                View Details
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={handleMail}
                className="h-8 w-8"
              >
                <Mail className="h-4 w-4" />
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-semibold tracking-tight">Pending Fees</h2>

        <div className="flex gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map((sec) => (
                <SelectItem key={sec} value={sec}>
                  {sec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="py-3 px-4">
            <CardContent className="p-0">
              <p className="text-xs text-muted-foreground">Students</p>
              <p className="text-lg font-semibold mt-1">{summary.uniqueStudents}</p>
            </CardContent>
          </Card>

          <Card className="py-3 px-4">
            <CardContent className="p-0">
              <p className="text-xs text-green-600">Total Paid</p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                ₹ {summary.totalPaid}
              </p>
            </CardContent>
          </Card>

          <Card className="py-3 px-4">
            <CardContent className="p-0">
              <p className="text-xs text-red-600">Total Pending</p>
              <p className="text-lg font-semibold text-red-600 mt-1">
                ₹ {summary.totalPending}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {groupedStudents.length > 0 && (
        <div className="flex items-center gap-2 max-w-xs">
          <Input
            type="number"
            placeholder="Min pending fee (₹)"
            value={minPending}
            onChange={(e) => setMinPending(e.target.value)}
            min={0}
          />
          {minPending && (
            <Button variant="ghost" size="icon" onClick={() => setMinPending('')}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <CardContent className="p-0">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No pending fees found.
          </div>
        ) : (
          <TableLayout columns={columns} data={filteredStudents} />
        )}
      </CardContent>

      {/* Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pending Fees - {selectedStudent?.FullName}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[400px] overflow-y-auto pr-2 space-y-3">
            {selectedStudent?.fees.map((fee, index) => (
              <div key={index} className="flex justify-between border-b pb-2 text-sm">
                <span className="capitalize">{fee.FeeType.replaceAll('_', ' ')}</span>

                <div className="space-x-4">
                  <span className="text-green-600">Paid: ₹ {fee.PaidAmount}</span>

                  <span className="text-red-600 font-semibold">
                    Pending: ₹ {fee.PendingAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
