// components/salary/SalaryCalculationCard.jsx

import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeacherMonthlySummaryById } from '@/hooks/useTeacherAttendance'

const getCurrentMonth = () => new Date().toISOString().slice(0, 7)

function CalcRow({ label, value, color = '', isTotal = false }) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        isTotal ? 'font-semibold text-base' : 'text-sm'
      }`}
    >
      <span className={isTotal ? '' : 'text-muted-foreground'}>{label}</span>
      <span className={color}>{value}</span>
    </div>
  )
}

function SalaryCalculationCard({ teacherId, baseSalary }) {
  const [month, setMonth] = useState(getCurrentMonth)
  const [allowance, setAllowance] = useState(0)
  const [extraDeduction, setExtraDeduction] = useState(0)
  const [paidLeaves, setPaidLeaves] = useState(0)

  const { data, isLoading, isError } = useTeacherMonthlySummaryById(teacherId, month)

  const summary = data?.summary ?? {}
  const absent = summary.AbsentDays ?? 0
  const halfDays = summary.HalfDays ?? 0
  const lateDays = summary.LeaveDays ?? 0

  const calc = useMemo(() => {
    const [year, monthStr] = month.split('-')
    const daysInMonth = new Date(Number(year), Number(monthStr), 0).getDate()
    const perDay = baseSalary / daysInMonth

    const halfFromLate = Math.floor(lateDays / 2)
    const totalHalfDays = halfDays + halfFromLate
    const leaveFromHalf = Math.floor(totalHalfDays / 2)
    const totalLeaves = absent + leaveFromHalf
    const effectiveLeaves = Math.max(totalLeaves - paidLeaves, 0)

    const halfDayDeduction = perDay * 0.5 * totalHalfDays
    const leaveDeduction = perDay * effectiveLeaves
    const totalDeductions = leaveDeduction + extraDeduction
    const netSalary = Math.max(baseSalary + allowance - totalDeductions, 0)

    return {
      daysInMonth,
      perDay,
      halfFromLate,
      totalHalfDays,
      effectiveLeaves,
      halfDayDeduction,
      leaveDeduction,
      netSalary,
    }
  }, [
    baseSalary,
    month,
    absent,
    halfDays,
    lateDays,
    paidLeaves,
    allowance,
    extraDeduction,
  ])

  if (isLoading) return <SalaryCalculationSkeleton />
  if (isError)
    return <p className="text-sm text-destructive">Failed to load attendance summary</p>

  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Salary Calculation
        </CardTitle>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">Month</Label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-40"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Adjustments */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Paid Leaves Allowed</Label>
            <Input
              type="number"
              min="0"
              value={paidLeaves}
              onChange={(e) => setPaidLeaves(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Allowance (₹)</Label>
            <Input
              type="number"
              min="0"
              step="100"
              value={allowance}
              onChange={(e) => setAllowance(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Extra Deduction (₹)</Label>
            <Input
              type="number"
              min="0"
              step="100"
              value={extraDeduction}
              onChange={(e) => setExtraDeduction(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <Separator />

        {/* Breakdown */}
        <div className="space-y-1">
          <CalcRow
            label="Base Salary"
            value={`₹ ${baseSalary.toLocaleString('en-IN')}`}
          />
          <CalcRow
            label={`Per Day (÷ ${calc.daysInMonth} days)`}
            value={`₹ ${calc.perDay.toFixed(2)}`}
          />
          {allowance > 0 && (
            <CalcRow
              label="Allowance"
              value={`+ ₹ ${allowance.toLocaleString('en-IN')}`}
              color="text-emerald-600"
            />
          )}

          <Separator className="my-1" />

          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground pt-1">
            Deductions
          </p>

          <CalcRow
            label={`Absent (${absent} days)`}
            value={absent > 0 ? `− ₹ ${(calc.perDay * absent).toFixed(2)}` : '—'}
            color="text-red-500"
          />
          <CalcRow
            label={`Half Days (${halfDays} + ${calc.halfFromLate} from late)`}
            value={
              calc.totalHalfDays > 0 ? `− ₹ ${calc.halfDayDeduction.toFixed(2)}` : '—'
            }
            color="text-orange-500"
          />
          <CalcRow
            label={`Effective Leaves (${calc.effectiveLeaves} after ${paidLeaves} paid)`}
            value={
              calc.effectiveLeaves > 0 ? `− ₹ ${calc.leaveDeduction.toFixed(2)}` : '—'
            }
            color="text-red-500"
          />
          {extraDeduction > 0 && (
            <CalcRow
              label="Extra Deduction"
              value={`− ₹ ${extraDeduction.toLocaleString('en-IN')}`}
              color="text-red-500"
            />
          )}

          <Separator className="my-1" />

          <CalcRow
            label="Net Payable Salary"
            value={`₹ ${calc.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            color="text-primary"
            isTotal
          />
        </div>

        {/* Policy note */}
        <div className="rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-0.5">
          <p>• 2 Late marks = 1 Half Day</p>
          <p>• 2 Half Days = 1 Leave</p>
          <p>• Paid leaves are excluded from deductions</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalaryCalculationCard

function SalaryCalculationSkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-9 w-40" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
