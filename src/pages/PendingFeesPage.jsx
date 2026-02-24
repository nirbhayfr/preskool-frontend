import { useMemo, useState } from 'react'
import { usePendingFees } from '@/hooks/usePendingFees'
import { classes, sections } from '@/data/basicData'
import TableLayout from '@/components/layout/Table'
import { CircleLoader } from '@/components/layout/RouteLoader'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PendingFeesPage() {
  const [selectedClass, setSelectedClass] = useState(classes[0] || '')
  const [selectedSection, setSelectedSection] = useState('all')

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

  // 🔢 Summary Stats
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
      {
        accessorKey: 'FeeType',
        header: 'Fee Type',
        cell: ({ row }) => (
          <Badge variant="secondary" className="capitalize">
            {row.original.FeeType.replaceAll('_', ' ')}
          </Badge>
        ),
      },
      {
        accessorKey: 'TotalFee',
        header: 'Total Fee',
        cell: ({ row }) => (
          <span className="text-muted-foreground font-medium">
            ₹ {row.original.TotalFee}
          </span>
        ),
      },
      {
        accessorKey: 'PaidAmount',
        header: 'Paid',
        cell: ({ row }) => (
          <span className="text-green-600 font-semibold">
            ₹ {row.original.PaidAmount}
          </span>
        ),
      },
      {
        accessorKey: 'PendingAmount',
        header: 'Pending',
        cell: ({ row }) => (
          <span className="text-red-600 font-bold">₹ {row.original.PendingAmount}</span>
        ),
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
            <Button
              size="icon"
              variant="outline"
              onClick={handleMail}
              className="h-8 w-8"
            >
              <Mail className="h-4 w-4" />
            </Button>
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

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="py-3 px-4">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Students</p>
                <p className="text-lg font-semibold leading-none mt-1">
                  {summary.uniqueStudents}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="py-3 px-4">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 dark:text-green-400">Total Paid</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400 leading-none mt-1">
                  ₹ {summary.totalPaid}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="py-3 px-4">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700 dark:text-red-400">Total Pending</p>
                <p className="text-lg font-semibold text-red-700 dark:text-red-400 leading-none mt-1">
                  ₹ {summary.totalPending}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="border-none shadow-sm p-0">
        <CardContent className="p-0">
          {tableData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No pending fees found for selected filters.
            </div>
          ) : (
            <TableLayout columns={columns} data={tableData} />
          )}
        </CardContent>
      </div>
    </div>
  )
}
