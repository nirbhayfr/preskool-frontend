import { useMemo, useState } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useAllTeachersMonthlySummary } from '@/hooks/useTeacherAttendance'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'

/* ------------------ Header ------------------ */
function TeacherSalaryHeader({ month, onMonthChange, totalTeachers }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
        Teacher Salary Summary
        {totalTeachers != null && (
          <span className="ml-2 text-sm text-gray-500">({totalTeachers})</span>
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
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export default function TeacherSalaryPage() {
  const [month, setMonth] = useState(getCurrentMonth())

  const { data, isLoading, error } = useAllTeachersMonthlySummary(month)

  const tableData = useMemo(() => data?.data ?? [], [data])

  const columns = useMemo(
    () => [
      {
        header: 'Teacher ID',
        accessorKey: 'teacherId',
        cell: ({ row }) => (
          <span className="font-medium text-primary">{row.original.teacherId}</span>
        ),
      },
      {
        header: 'Teacher',
        accessorKey: 'teacher.fullName',
      },
      {
        header: 'Subject',
        accessorKey: 'teacher.subject',
      },
      {
        header: 'Present',
        accessorFn: (row) => row.summary?.PresentDays ?? 0,
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-emerald-700" />
        ),
      },
      {
        header: 'Absent',
        accessorFn: (row) => row.summary?.AbsentDays ?? 0,
        cell: ({ getValue }) => <CountCell value={getValue()} className="text-red-700" />,
      },
      {
        header: 'Half Day',
        accessorFn: (row) => row.summary?.HalfDays ?? 0,
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-orange-600" />
        ),
      },
      {
        header: 'Leave',
        accessorFn: (row) => row.summary?.LeaveDays ?? 0,
        cell: ({ getValue }) => (
          <CountCell value={getValue()} className="text-blue-600" />
        ),
      },
    ],
    []
  )

  if (isLoading) return <CircleLoader />
  if (error) return 'Error loading teacher summary'

  return (
    <section className="p-6">
      <TeacherSalaryHeader
        month={month}
        onMonthChange={setMonth}
        totalTeachers={data?.totalTeachers}
      />
      <TableLayout columns={columns} data={tableData} />
    </section>
  )
}
