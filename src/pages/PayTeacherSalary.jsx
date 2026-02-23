import { useCallback, useMemo, useState } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import {
  useBulkMarkTeacherSalaryPaid,
  useTeacherSalaries,
  useDeleteTeacherSalary,
} from '@/hooks/useTeacherSalary'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

function PayTeacherSalaryHeader({ month, onMonthChange, total, search, onSearchChange }) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Pay Teacher Salaries
          {total != null && (
            <span className="ml-2 text-sm text-muted-foreground">({total})</span>
          )}
        </h2>

        <Input
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      <Input
        placeholder="Search by Teacher ID or Name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-72"
      />
    </div>
  )
}
const getCurrentMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export default function PayTeacherSalaryPage() {
  const [search, setSearch] = useState('')
  const [month, setMonth] = useState(getCurrentMonth())

  const { data, isLoading, error } = useTeacherSalaries()
  const { mutate: bulkPay, isPending: isPaying } = useBulkMarkTeacherSalaryPaid()
  const { mutate: deleteSalary, isPending: isDeleting } = useDeleteTeacherSalary()

  const salaries = data?.data ?? []

  const filteredData = useMemo(() => {
    return salaries.filter((s) => {
      const matchesMonth = s.SalaryMonth === month

      const matchesSearch =
        s.FullName?.toLowerCase().includes(search.toLowerCase()) ||
        String(s.TeacherID).includes(search)

      return matchesMonth && matchesSearch
    })
  }, [salaries, month, search])

  const handlePay = useCallback(
    (salary) => {
      bulkPay([salary.TeacherID], {
        onSuccess: () => toast.success('Teacher salary marked as paid'),
        onError: () => toast.error('Failed to mark teacher salary as paid'),
      })
    },
    [bulkPay]
  )

  const handleDelete = useCallback(
    (salary) => {
      deleteSalary(salary.SalaryID, {
        onSuccess: () => toast.success('Teacher salary deleted successfully'),
        onError: () => toast.error('Failed to delete teacher salary'),
      })
    },
    [deleteSalary]
  )

  const columns = useMemo(
    () => [
      {
        header: 'Teacher ID',
        accessorKey: 'TeacherID',
        cell: ({ row }) => (
          <span className="font-medium text-primary">{row.original.TeacherID}</span>
        ),
      },
      { header: 'Name', accessorKey: 'FullName' },
      { header: 'Month', accessorKey: 'SalaryMonth' },
      {
        header: 'Basic',
        accessorKey: 'BasicSalary',
        cell: ({ getValue }) => <span>₹ {Number(getValue()).toLocaleString()}</span>,
      },
      {
        header: 'Allowances',
        accessorKey: 'Allowances',
        cell: ({ getValue }) => (
          <span className="text-emerald-600 font-medium">
            ₹ {Number(getValue()).toLocaleString()}
          </span>
        ),
      },
      {
        header: 'Deductions',
        accessorKey: 'Deductions',
        cell: ({ getValue }) => (
          <span className="text-destructive font-medium">
            ₹ {Number(getValue()).toLocaleString()}
          </span>
        ),
      },
      {
        header: 'Net Salary',
        accessorKey: 'NetSalary',
        cell: ({ getValue }) => (
          <span className="font-semibold">₹ {Number(getValue()).toLocaleString()}</span>
        ),
      },
      {
        header: 'Payment Date',
        accessorKey: 'PaymentDate',
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString() : '-',
      },
      {
        header: 'Status',
        cell: ({ row }) =>
          row.original.IsPaid ? (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Paid
            </Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          ),
      },
      {
        header: 'Action',
        cell: ({ row }) => {
          const isPaid = row.original.IsPaid

          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={isPaid || isPaying}
                onClick={() => handlePay(row.original)}
              >
                {isPaying ? <Spinner /> : 'Pay'}
              </Button>

              {!isPaid && (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => handleDelete(row.original)}
                >
                  {isDeleting ? <Spinner /> : 'Delete'}
                </Button>
              )}
            </div>
          )
        },
      },
    ],
    [handlePay, handleDelete, isPaying, isDeleting]
  )

  if (isLoading) return <CircleLoader />
  if (error) return <div className="text-destructive">Error loading teacher salaries</div>

  console.log(data)

  return (
    <section className="p-6 space-y-6">
      <PayTeacherSalaryHeader
        month={month}
        onMonthChange={setMonth}
        total={filteredData.length}
        search={search}
        onSearchChange={setSearch}
      />

      <Card>
        <CardContent className="p-4 text-sm space-y-1">
          <p>
            <strong>Payment Rule:</strong>
          </p>
          <p>• Click Pay to mark salary as paid</p>
          <p>• Payment date will be set to today</p>
          <p>• Paid salaries cannot be modified</p>
        </CardContent>
      </Card>

      <TableLayout columns={columns} data={filteredData} />
    </section>
  )
}
