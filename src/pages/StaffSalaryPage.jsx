import { useMemo, useState, useEffect, useCallback } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { useAllStaffMonthlySummary } from '@/hooks/useStaffAttendance'
import { useCreateStaffSalary } from '@/hooks/useStaffSalary'
import TableLayout from '@/components/layout/Table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

function StaffSalaryHeader({ month, onMonthChange, totalStaff }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
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
        className="w-full sm:w-48"
      />
    </div>
  )
}

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
  const [paidLeaves, setPaidLeaves] = useState(0)

  const [salaryOverrides, setSalaryOverrides] = useState({})
  const [deductionOverrides, setDeductionOverrides] = useState({})
  const [allowanceOverrides, setAllowanceOverrides] = useState({})

  const { mutate: createSalary, isPending } = useCreateStaffSalary()
  const { data, isLoading, error } = useAllStaffMonthlySummary(month)

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

  /* ---------------- Salary Calculation ---------------- */

  const calculatedRows = useMemo(() => {
    return tableData.map((row) => {
      const baseSalary = Number(row.staff?.salary ?? 0)
      const absent = row.summary?.AbsentDays ?? 0
      const halfDays = row.summary?.HalfDays ?? 0
      const lateDays = row.summary?.LeaveDays ?? 0

      const perDaySalary = baseSalary / daysInMonth

      const halfFromLate = Math.floor(lateDays / 2)
      const totalHalfDays = halfDays + halfFromLate
      const leaveFromHalf = Math.floor(totalHalfDays / 2)
      const totalLeaves = absent + leaveFromHalf

      const effectiveLeaves = Math.max(totalLeaves - paidLeaves, 0)
      const calculatedDeduction = perDaySalary * effectiveLeaves

      const allowance = allowanceOverrides[row.staffId] ?? 0
      const deduction = deductionOverrides[row.staffId] ?? calculatedDeduction

      const calculatedFinalSalary = Math.max(baseSalary + allowance - deduction, 0)

      const finalSalary = salaryOverrides[row.staffId] ?? calculatedFinalSalary

      return {
        ...row,
        baseSalary,
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

  /* ---------------- Stable Handlers ---------------- */

  const handleSalaryChange = useCallback((staffId, value, base, allowance) => {
    const newFinal = Math.max(0, Number(value) || 0)
    const newDeduction = Math.max(base + allowance - newFinal, 0)

    setSalaryOverrides((prev) => ({
      ...prev,
      [staffId]: Number(newFinal.toFixed(2)),
    }))

    setDeductionOverrides((prev) => ({
      ...prev,
      [staffId]: Number(newDeduction.toFixed(2)),
    }))
  }, [])

  const handleDeductionChange = useCallback((staffId, value, base, allowance) => {
    const newDeduction = Math.max(0, Number(value) || 0)
    const newFinal = Math.max(base + allowance - newDeduction, 0)

    setDeductionOverrides((prev) => ({
      ...prev,
      [staffId]: Number(newDeduction.toFixed(2)),
    }))

    setSalaryOverrides((prev) => ({
      ...prev,
      [staffId]: Number(newFinal.toFixed(2)),
    }))
  }, [])

  const handleAllowanceChange = useCallback((staffId, value, base, deduction) => {
    const newAllowance = Math.max(0, Number(value) || 0)
    const newFinal = Math.max(base + newAllowance - deduction, 0)

    setAllowanceOverrides((prev) => ({
      ...prev,
      [staffId]: Number(newAllowance.toFixed(2)),
    }))

    setSalaryOverrides((prev) => ({
      ...prev,
      [staffId]: Number(newFinal.toFixed(2)),
    }))
  }, [])

  /* ---------------- Create Salaries ---------------- */

  const handleCreateSalaries = useCallback(() => {
    const payload = calculatedRows
      .filter((row) => {
        const base = Number(row.baseSalary)
        const net = Number(row.finalSalary)
        return base > 0 && net > 0 && !isNaN(base) && !isNaN(net)
      })
      .map((row) => ({
        staffId: row.staffId,
        basicSalary: Number(row.baseSalary.toFixed(2)),
        allowances: Number(row.allowance.toFixed(2)),
        deductions: Number(row.deduction.toFixed(2)),
        salaryMonth: month,
        paymentDate: null,
        isPaid: false,
      }))

    if (!payload.length) {
      toast.error('No valid salaries to create')
      return
    }

    createSalary(payload, {
      onSuccess: () => toast.success('Staff salary created successfully'),
      onError: () => toast.error('Failed to create staff salary'),
    })
  }, [calculatedRows, month, createSalary])

  /* ---------------- Columns ---------------- */

  const columns = useMemo(
    () => [
      {
        header: 'Status',
        cell: () => <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>,
      },
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
        header: 'Role',
        accessorFn: (row) => row.staff?.role ?? '—',
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
        cell: ({ getValue }) => (
          <span className="font-semibold text-red-500">{getValue()}</span>
        ),
      },
      {
        header: 'Effective Leaves',
        accessorFn: (row) => row.effectiveLeaves,
        cell: ({ getValue }) => (
          <span className="font-semibold text-red-700">{getValue()}</span>
        ),
      },
      {
        header: 'Base Salary',
        accessorFn: (row) => row.baseSalary,
        cell: ({ getValue }) => (
          <span className="font-semibold">₹ {Number(getValue()).toLocaleString()}</span>
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
            onChange={(e) =>
              handleAllowanceChange(
                row.original.staffId,
                e.target.value,
                row.original.baseSalary,
                row.original.deduction
              )
            }
            className="w-28 font-semibold text-emerald-600"
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
            onChange={(e) =>
              handleDeductionChange(
                row.original.staffId,
                e.target.value,
                row.original.baseSalary,
                row.original.allowance
              )
            }
            className="w-28 font-semibold text-destructive"
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
            onChange={(e) =>
              handleSalaryChange(
                row.original.staffId,
                e.target.value,
                row.original.baseSalary,
                row.original.allowance
              )
            }
            className="w-32 font-semibold text-blue-200"
          />
        ),
      },
    ],

    [handleSalaryChange, handleDeductionChange, handleAllowanceChange]
  )

  if (isLoading) return <CircleLoader />
  if (error) return <div className="text-destructive">Error loading staff summary</div>

  return (
    <section className="p-6 space-y-6">
      <StaffSalaryHeader
        month={data?.month ?? month}
        onMonthChange={setMonth}
        totalStaff={data?.totalStaff}
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
        <Button onClick={handleCreateSalaries} disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Salaries'}
        </Button>
      </div>
    </section>
  )
}
