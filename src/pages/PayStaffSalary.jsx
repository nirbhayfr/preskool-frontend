import { useCallback, useMemo, useState } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStaffSalaries } from '@/hooks/useStaffSalary'

function PayStaffSalaryHeader({ month, onMonthChange, total }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="text-xl font-semibold tracking-tight">
        Pay Staff Salaries
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
  )
}

const getCurrentMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export default function PayStaffSalaryPage() {
  const [month, setMonth] = useState(getCurrentMonth())

  const { data, isLoading, error } = useStaffSalaries()

  const salaries = data?.data ?? []

  const filteredData = useMemo(() => {
    return salaries.filter((s) => s.SalaryMonth === month)
  }, [salaries, month])

  const handlePay = useCallback((salary) => {
    console.log(salary)
  }, [])

  const columns = useMemo(
    () => [
      {
        header: 'Staff ID',
        accessorKey: 'StaffID',
      },
      {
        header: 'Name',
        accessorKey: 'FullName',
        cell: ({ getValue }) => (
          <span className="font-medium text-primary">{getValue()}</span>
        ),
      },
      {
        header: 'Month',
        accessorKey: 'SalaryMonth',
      },
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
        cell: ({ row }) => (
          <Button
            size="sm"
            disabled={row.original.IsPaid}
            onClick={() => handlePay(row.original)}
          >
            Pay
          </Button>
        ),
      },
    ],
    [handlePay]
  )

  if (isLoading) return <CircleLoader />
  if (error) return <div className="text-destructive">Error loading staff salaries</div>

  return (
    <section className="p-6 space-y-6">
      <PayStaffSalaryHeader
        month={month}
        onMonthChange={setMonth}
        total={filteredData.length}
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
