import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import TableLayout from '@/components/layout/Table'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useStaffSalaries } from '@/hooks/useStaffSalary'

const formatCurrency = (val) =>
  val != null ? `₹ ${Number(val).toLocaleString('en-IN')}` : '—'

const formatMonth = (ym) => {
  if (!ym) return '—'
  const [year, month] = ym.split('-')
  return new Date(year, month - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function TeacherSalaryList() {
  const { data, isLoading, isError } = useStaffSalaries()
  const [selectedMonth, setSelectedMonth] = useState('all')

  const salaries = data?.data || []

  /* UNIQUE MONTHS for filter */
  const months = useMemo(() => {
    const unique = [...new Set(salaries.map((s) => s.SalaryMonth))].sort((a, b) =>
      b.localeCompare(a)
    )
    return unique
  }, [salaries])

  /* FILTERED DATA */
  const filtered = useMemo(() => {
    if (selectedMonth === 'all') return salaries
    return salaries.filter((s) => s.SalaryMonth === selectedMonth)
  }, [salaries, selectedMonth])

  /* SUMMARY TOTALS */
  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, curr) => {
        acc.totalNet += curr.NetSalary ?? 0
        acc.totalPaid += curr.IsPaid ? (curr.NetSalary ?? 0) : 0
        acc.totalPending += !curr.IsPaid ? (curr.NetSalary ?? 0) : 0
        acc.paidCount += curr.IsPaid ? 1 : 0
        acc.pendingCount += !curr.IsPaid ? 1 : 0
        return acc
      },
      { totalNet: 0, totalPaid: 0, totalPending: 0, paidCount: 0, pendingCount: 0 }
    )
  }, [filtered])

  /* TABLE COLUMNS */
  const columns = [
    {
      accessorKey: 'FullName',
      header: 'Teacher',
      cell: ({ row }) => <span className="font-medium">{row.original.FullName}</span>,
    },
    {
      accessorKey: 'SalaryMonth',
      header: 'Month',
      cell: ({ row }) => formatMonth(row.original.SalaryMonth),
    },
    {
      accessorKey: 'BasicSalary',
      header: 'Basic Salary',
      cell: ({ row }) => formatCurrency(row.original.BasicSalary),
    },
    {
      accessorKey: 'Allowances',
      header: 'Allowances',
      cell: ({ row }) => (
        <span className="text-green-600">
          {row.original.Allowances > 0
            ? `+ ${formatCurrency(row.original.Allowances)}`
            : '—'}
        </span>
      ),
    },
    {
      accessorKey: 'Deductions',
      header: 'Deductions',
      cell: ({ row }) => (
        <span className="text-red-500">
          {row.original.Deductions > 0
            ? `- ${formatCurrency(row.original.Deductions)}`
            : '—'}
        </span>
      ),
    },
    {
      accessorKey: 'NetSalary',
      header: 'Net Salary',
      cell: ({ row }) => (
        <span className="font-semibold">{formatCurrency(row.original.NetSalary)}</span>
      ),
    },
    {
      accessorKey: 'PaymentDate',
      header: 'Payment Date',
      cell: ({ row }) => formatDate(row.original.PaymentDate),
    },
    {
      accessorKey: 'IsPaid',
      header: 'Status',
      cell: ({ row }) =>
        row.original.IsPaid ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
        ) : (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        ),
    },
  ]

  if (isLoading) return <CircleLoader />
  if (isError) return <p className="p-6 text-red-500">Failed to load salary data.</p>

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Teacher Salaries</h2>

        {/* MONTH FILTER */}
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {formatMonth(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Salary Disbursed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {formatCurrency(totals.totalNet)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-green-600">
            {formatCurrency(totals.totalPaid)}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({totals.paidCount} teachers)
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-yellow-600">
            {formatCurrency(totals.totalPending)}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({totals.pendingCount} teachers)
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Records</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {filtered.length}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              entries
            </span>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>
            Salary Records
            {selectedMonth !== 'all' && (
              <span className="text-muted-foreground font-normal text-base ml-2">
                — {formatMonth(selectedMonth)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableLayout columns={columns} data={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}
