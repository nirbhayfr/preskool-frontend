import { useMemo, useState, useEffect } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useAllTeachersMonthlySummary } from '@/hooks/useTeacherAttendance'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useCreateTeacherSalary } from '@/hooks/useTeacherSalary'
import { toast } from 'sonner'

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
  const [paidLeaves, setPaidLeaves] = useState(0)
  const { mutate: createSalary } = useCreateTeacherSalary()

  const [salaryOverrides, setSalaryOverrides] = useState({})
  const [deductionOverrides, setDeductionOverrides] = useState({})
  const [allowanceOverrides, setAllowanceOverrides] = useState({})

  const { data, isLoading, error } = useAllTeachersMonthlySummary(month)

  const tableData = useMemo(() => data?.data ?? [], [data])

  const daysInMonth = useMemo(() => {
    const [year, monthStr] = month.split('-')
    return new Date(Number(year), Number(monthStr), 0).getDate()
  }, [month])

  useEffect(() => {
    setSalaryOverrides({})
    setDeductionOverrides({})
    setAllowanceOverrides({})
  }, [month])

  const calculatedRows = useMemo(() => {
    return tableData.map((row) => {
      const baseSalary = row.teacher?.salary ?? 0
      const absent = row.summary?.AbsentDays ?? 0
      const halfDays = row.summary?.HalfDays ?? 0
      const lateDays = row.summary?.LeaveDays ?? 0

      const perDaySalary = baseSalary / daysInMonth

      // Leave conversion
      const halfFromLate = Math.floor(lateDays / 2)
      const totalHalfDays = halfDays + halfFromLate
      const leaveFromHalf = Math.floor(totalHalfDays / 2)
      const totalLeaves = absent + leaveFromHalf

      const effectiveLeaves = Math.max(totalLeaves - paidLeaves, 0)

      const calculatedDeduction = perDaySalary * effectiveLeaves

      const deduction = deductionOverrides[row.teacherId] ?? calculatedDeduction

      const allowance = allowanceOverrides[row.teacherId] ?? 0

      const calculatedFinalSalary = Math.max(baseSalary + allowance - deduction, 0)

      const finalSalary = salaryOverrides[row.teacherId] ?? calculatedFinalSalary

      return {
        ...row,
        baseSalary,
        perDaySalary,
        totalLeaves,
        effectiveLeaves,
        allowance,
        deduction,
        finalSalary,
      }
    })
  }, [
    tableData,
    paidLeaves,
    salaryOverrides,
    deductionOverrides,
    allowanceOverrides,
    daysInMonth,
  ])

  const handleSalaryChange = (teacherId, value) => {
    const teacherRow = calculatedRows.find((r) => r.teacherId === teacherId)
    if (!teacherRow) return

    const base = teacherRow.baseSalary
    const allowance = teacherRow.allowance

    const newFinal = Math.max(0, Number(value) || 0)

    const newDeduction = Math.max(base + allowance - newFinal, 0)

    setSalaryOverrides((prev) => ({
      ...prev,
      [teacherId]: newFinal,
    }))

    setDeductionOverrides((prev) => ({
      ...prev,
      [teacherId]: Number(newDeduction.toFixed(2)),
    }))
  }

  const handleDeductionChange = (teacherId, value) => {
    const teacherRow = calculatedRows.find((r) => r.teacherId === teacherId)
    if (!teacherRow) return

    const base = teacherRow.baseSalary
    const allowance = teacherRow.allowance
    const newDeduction = Math.max(0, Number(value) || 0)

    const newFinal = Math.max(base + allowance - newDeduction, 0)

    setDeductionOverrides((prev) => ({
      ...prev,
      [teacherId]: Number(newDeduction.toFixed(2)),
    }))

    setSalaryOverrides((prev) => ({
      ...prev,
      [teacherId]: Number(newFinal.toFixed(2)),
    }))
  }

  const handleAllowanceChange = (teacherId, value) => {
    const teacherRow = calculatedRows.find((r) => r.teacherId === teacherId)
    if (!teacherRow) return

    const base = teacherRow.baseSalary
    const deduction = teacherRow.deduction
    const newAllowance = Math.max(0, Number(value) || 0)

    const newFinal = Math.max(base + newAllowance - deduction, 0)

    setAllowanceOverrides((prev) => ({
      ...prev,
      [teacherId]: Number(newAllowance.toFixed(2)),
    }))

    setSalaryOverrides((prev) => ({
      ...prev,
      [teacherId]: Number(newFinal.toFixed(2)),
    }))
  }

  const handleCreateSalaries = () => {
    const payload = calculatedRows
      .filter((row) => Number(row.finalSalary) > 0 && !isNaN(Number(row.finalSalary)))
      .map((row) => ({
        teacherId: row.teacherId,
        basicSalary: Number(row.baseSalary.toFixed(2)),
        allowances: Number(row.allowance.toFixed(2)),
        deductions: Number(row.deduction.toFixed(2)),
        salaryMonth: month,
        paymentDate: null,
        isPaid: false,
      }))

    console.log('Salary Payload:', payload)
    createSalary(payload, {
      onSuccess: () => {
        toast.success('Salary Created successfully')
      },
      onError: () => {
        toast.error('Failed to create salary')
      },
    })
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
        header: 'Status',
        cell: () => (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
          >
            Active
          </Badge>
        ),
      },
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
      {
        header: 'Total Leaves',
        accessorFn: (row) => row.totalLeaves,
      },
      {
        header: 'Effective Leaves',
        accessorFn: (row) => row.effectiveLeaves,
        cell: ({ getValue }) => (
          <span className="font-semibold text-red-500">{getValue()}</span>
        ),
      },
      {
        header: 'Allowance',
        cell: ({ row }) => (
          <Input
            type="number"
            step="100"
            min="0"
            value={Number(row.original.allowance ?? 0).toFixed(2)}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0)
              handleAllowanceChange(row.original.teacherId, Number(value.toFixed(2)))
            }}
            className="w-32 font-semibold"
          />
        ),
      },
      {
        header: 'Deduction',
        cell: ({ row }) => (
          <Input
            type="number"
            step="100"
            min="0"
            value={Number(row.original.deduction ?? 0).toFixed(2)}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0)
              handleDeductionChange(row.original.teacherId, Number(value.toFixed(2)))
            }}
            className="w-32 font-semibold"
          />
        ),
      },
      {
        header: 'Final Salary',
        cell: ({ row }) => (
          <Input
            type="number"
            step="100"
            min="0"
            value={Number(row.original.finalSalary ?? 0).toFixed(2)}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0)
              handleSalaryChange(row.original.teacherId, Number(value.toFixed(2)))
            }}
            className="w-32 font-semibold"
          />
        ),
      },
    ],
    []
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

      <div className="max-w-sm">
        <Label>Paid Leaves (Allowed per Month)</Label>
        <Input
          type="number"
          min="0"
          value={paidLeaves}
          onChange={(e) => setPaidLeaves(Number(e.target.value) || 0)}
        />
      </div>

      <Card>
        <CardContent className="p-4 text-sm space-y-1">
          <p>
            <strong>Salary Policy:</strong>
          </p>
          <p>• 1 Absent = 1 Leave</p>
          <p>• 2 Late = 1 Half Day</p>
          <p>• 2 Half Days = 1 Leave</p>
          <p>• Final Salary = Base + Allowance − Deduction</p>
        </CardContent>
      </Card>

      <TableLayout columns={columns} data={calculatedRows} />

      <div className="flex justify-end">
        <Button onClick={handleCreateSalaries}>Create Salaries</Button>
      </div>
    </section>
  )
}
