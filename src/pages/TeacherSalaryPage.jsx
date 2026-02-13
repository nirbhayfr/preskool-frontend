import { useMemo, useState, useEffect } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useAllTeachersMonthlySummary } from '@/hooks/useTeacherAttendance'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

function TeacherSalaryHeader({ month, onMonthChange, totalTeachers }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="text-xl font-semibold tracking-tight">
        Teacher Salary Summary
        {totalTeachers != null && (
          <span className="ml-2 text-sm text-muted-foreground">({totalTeachers})</span>
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

export default function TeacherSalaryPage() {
  const [month, setMonth] = useState(getCurrentMonth())

  const [leaveDeduction, setLeaveDeduction] = useState(0)
  const [paidLeaves, setPaidLeaves] = useState(0)

  const [salaryOverrides, setSalaryOverrides] = useState({})

  const { data, isLoading, error } = useAllTeachersMonthlySummary(month)

  const tableData = useMemo(() => data?.data ?? [], [data])

  // Reset overrides when month changes
  useEffect(() => {
    setSalaryOverrides({})
  }, [month])

  const calculatedRows = useMemo(() => {
    return tableData.map((row) => {
      const baseSalary = row.teacher?.salary ?? 0
      const absent = row.summary?.AbsentDays ?? 0
      const halfDays = row.summary?.HalfDays ?? 0
      const lateDays = row.summary?.LeaveDays ?? 0

      // Step 1: Convert late → half days
      const halfFromLate = Math.floor(lateDays / 2)

      // Step 2: Combine half days
      const totalHalfDays = halfDays + halfFromLate

      // Step 3: Convert half days → leaves
      const leaveFromHalf = Math.floor(totalHalfDays / 2)

      // Step 4: Total leaves
      const totalLeaves = absent + leaveFromHalf

      // Step 5: Apply paid leaves
      const effectiveLeaves = Math.max(totalLeaves - paidLeaves, 0)

      // Step 6: Deduction
      const deduction = effectiveLeaves * leaveDeduction

      const calculatedSalary = Math.max(baseSalary - deduction, 0)

      const finalSalary = salaryOverrides[row.teacherId] ?? calculatedSalary

      return {
        ...row,
        baseSalary,
        totalLeaves,
        effectiveLeaves,
        deduction,
        finalSalary,
      }
    })
  }, [tableData, leaveDeduction, paidLeaves, salaryOverrides])

  const handleSalaryChange = (teacherId, value) => {
    setSalaryOverrides((prev) => ({
      ...prev,
      [teacherId]: Number(value),
    }))
  }

  const handleCreateSalaries = () => {
    const payload = calculatedRows.map((row) => ({
      teacherId: row.teacherId,
      month,
      baseSalary: row.baseSalary,
      totalLeaves: row.totalLeaves,
      effectiveLeaves: row.effectiveLeaves,
      deduction: row.deduction,
      finalSalary: row.finalSalary,
      paidLeaves,
      leaveDeduction,
    }))

    console.log('Salary Payload:', payload)
  }

  const CountCell = ({ value, className = '' }) => {
    const isZero = value === 0

    return (
      <span className={isZero ? 'text-muted-foreground' : `font-semibold ${className}`}>
        {value}
      </span>
    )
  }

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
        header: 'Teacher Name',
        accessorFn: (row) => row.teacher?.fullName ?? '-',
      },
      {
        header: 'Base Salary',
        accessorFn: (row) => row.baseSalary,
        cell: ({ getValue }) => (
          <span className="font-semibold">₹ {Number(getValue()).toLocaleString()}</span>
        ),
      },

      // ===== 4 Attendance Entities (Styled) =====

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

      // ===== Salary Computation Columns =====

      {
        header: 'Total Leaves',
        accessorFn: (row) => row.totalLeaves,
        cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span>,
      },
      {
        header: 'Effective Leaves',
        accessorFn: (row) => row.effectiveLeaves,
        cell: ({ getValue }) => (
          <span className="font-semibold text-red-500">{getValue()}</span>
        ),
      },
      {
        header: 'Deduction',
        accessorFn: (row) => row.deduction,
        cell: ({ getValue }) => (
          <span className="font-semibold text-destructive">
            ₹ {Number(getValue()).toLocaleString()}
          </span>
        ),
      },
      {
        header: 'Final Salary',
        cell: ({ row }) => (
          <Input
            type="number"
            value={row.original.finalSalary}
            onChange={(e) => handleSalaryChange(row.original.teacherId, e.target.value)}
            className="w-32 font-semibold"
          />
        ),
      },
    ],
    [handleSalaryChange]
  )

  if (isLoading) return <CircleLoader />
  if (error) return <div className="text-destructive">Error loading teacher summary</div>

  return (
    <section className="p-6 space-y-6">
      <TeacherSalaryHeader
        month={data?.month ?? month}
        onMonthChange={setMonth}
        totalTeachers={data?.totalTeachers}
      />

      {/* Controls */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Leave Deduction */}
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="leaveDeduction">Leave Deduction Amount (₹ per Leave)</Label>
          <Input
            id="leaveDeduction"
            type="number"
            min="0"
            value={leaveDeduction}
            onChange={(e) => setLeaveDeduction(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Paid Leaves */}
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="paidLeaves">Paid Leaves (Allowed per Month)</Label>
          <Input
            id="paidLeaves"
            type="number"
            min="0"
            value={paidLeaves}
            onChange={(e) => setPaidLeaves(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="p-4 text-sm space-y-1">
          <p>
            <strong>Salary Policy:</strong>
          </p>
          <p>• 1 Absent = 1 Leave</p>
          <p>• 2 Half Days = 1 Leave</p>
          <p>• 2 Late = 1 Half Day</p>
          <p>• 3 Late = 1 Leave</p>
          <p>• Paid Leaves are deducted from total leaves</p>
          <p>• Remaining Leaves × Leave Deduction = Salary Deduction</p>
        </CardContent>
      </Card>

      <TableLayout columns={columns} data={calculatedRows} />

      <div className="flex justify-end">
        <Button onClick={handleCreateSalaries}>Create Salaries</Button>
      </div>
    </section>
  )
}
