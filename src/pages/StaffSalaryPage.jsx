import { useMemo, useState } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useAllStaffMonthlySummary } from '@/hooks/useStaffAttendance'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'

function StaffSalaryHeader({ month, onMonthChange, totalStaff }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
        Staff Salary Summary
        {totalStaff != null && (
          <span className="ml-2 text-sm text-gray-500">({totalStaff})</span>
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

const CountCell = ({ value, className = '' }) => {
  const isZero = value === 0

  return (
    <span
      className={
        isZero ? 'text-muted-foreground font-normal' : `font-semibold ${className}`
      }
    >
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
        accessorKey: 'staff.fullName',
        cell: ({ getValue }) => getValue() || '—',
      },
      {
        header: 'Email',
        accessorKey: 'staff.email',
        cell: ({ getValue }) => getValue() || '—',
      },
      {
        header: 'Role',
        accessorKey: 'staff.role',
      },
      {
        header: 'Present',
        accessorKey: 'summary.PresentDays',
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-emerald-700" />
        ),
      },
      {
        header: 'Absent',
        accessorKey: 'summary.AbsentDays',
        cell: ({ getValue }) => <CountCell value={getValue()} className="text-red-700" />,
      },
      {
        header: 'Half Day',
        accessorKey: 'summary.HalfDays',
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-orange-600" />
        ),
      },
      {
        header: 'Leave',
        accessorKey: 'summary.LeaveDays',
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-blue-600" />
        ),
      },
    ],
    []
  )

  if (isLoading) return <CircleLoader />
  if (error) return 'Error loading staff summary'

  return (
    <section className="p-6">
      <StaffSalaryHeader
        month={month}
        onMonthChange={setMonth}
        totalStaff={tableData.length}
      />

      <TableLayout columns={columns} data={tableData} />
    </section>
  )
}
