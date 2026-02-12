import { useMemo, useState } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useAllStaffMonthlySummary } from '@/hooks/useStaffAttendance'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'

/* ------------------ Header ------------------ */
function StaffSalaryHeader({ month, onMonthChange, totalStaff }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold tracking-tight">
        Staff Salary Summary
        {totalStaff != null && (
          <span className="ml-2 text-sm text-muted-foreground">({totalStaff})</span>
        )}
      </h2>

      <Input
        type="month"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="w-48"
      />
    </div>
  )
}

/* ------------------ Count Cell ------------------ */
const CountCell = ({ value, className = '' }) => {
  const isZero = value === 0

  return (
    <span className={isZero ? 'text-muted-foreground' : `font-semibold ${className}`}>
      {value}
    </span>
  )
}

const getCurrentMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function StaffSalaryPage() {
  const [month, setMonth] = useState(getCurrentMonth())

  const { data, isLoading, error } = useAllStaffMonthlySummary(month)

  const tableData = useMemo(() => data?.data ?? [], [data])

  const columns = useMemo(
    () => [
      {
        header: 'Staff ID',
        accessorKey: 'staffId',
        cell: ({ row }) => (
          <span className="font-medium text-primary">{row.original.staffId}</span>
        ),
      },
      {
        header: 'Name',
        accessorFn: (row) => row.staff?.fullName ?? '—',
      },
      {
        header: 'Email',
        accessorFn: (row) => row.staff?.email ?? '—',
      },
      {
        header: 'Role',
        accessorFn: (row) => row.staff?.role ?? '—',
      },
      {
        header: 'Salary',
        accessorFn: (row) => row.staff?.salary ?? 0,
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? `₹ ${Number(value).toLocaleString()}` : '—'
        },
      },
      {
        header: 'Present',
        accessorFn: (row) => row.summary?.PresentDays ?? 0,
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-emerald-600" />
        ),
      },
      {
        header: 'Absent',
        accessorFn: (row) => row.summary?.AbsentDays ?? 0,
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-destructive" />
        ),
      },
      {
        header: 'Half Day',
        accessorFn: (row) => row.summary?.HalfDays ?? 0,
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-orange-500" />
        ),
      },
      {
        header: 'Late',
        accessorFn: (row) => row.summary?.LeaveDays ?? 0,
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-blue-600" />
        ),
      },
    ],
    []
  )

  if (isLoading) return <CircleLoader />
  if (error) return <div className="text-destructive">Error loading staff summary</div>

  return (
    <section className="p-6">
      <StaffSalaryHeader
        month={data?.month ?? month}
        onMonthChange={setMonth}
        totalStaff={data?.totalStaff}
      />

      <TableLayout columns={columns} data={tableData} />
    </section>
  )
}
