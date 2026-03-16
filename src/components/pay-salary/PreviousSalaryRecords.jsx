// components/salary/PreviousSalaryRecords.jsx

import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useTeacherSalaryByTeacherId } from '@/hooks/useTeacherSalary'

function PreviousSalaryRecords({ teacherId }) {
  const { data, isLoading, isError } = useTeacherSalaryByTeacherId(teacherId)

  const records = data?.data ?? []

  if (isLoading) return <PreviousSalaryRecordsSkeleton />
  if (isError)
    return <p className="text-sm text-destructive">Failed to load salary records</p>

  console.log(records)

  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Previous Salary Records
        </CardTitle>
      </CardHeader>

      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No salary records found
          </p>
        ) : (
          <div className="divide-y divide-border max-h-80 overflow-y-auto pr-3">
            {records.map((record) => (
              <div key={record.SalaryID} className="py-4 space-y-3">
                {/* Top row — month + status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{record.SalaryMonth}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: #{record.SalaryID} · Created{' '}
                      {format(new Date(record.CreatedAt), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      record.IsPaid
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40'
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40'
                    }
                  >
                    {record.IsPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>

                {/* Breakdown grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <SalaryCell
                    label="Basic Salary"
                    value={`₹ ${Number(record.BasicSalary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  />
                  <SalaryCell
                    label="Allowances"
                    value={`+ ₹ ${Number(record.Allowances ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                    valueClass="text-emerald-600"
                  />
                  <SalaryCell
                    label="Deductions"
                    value={`− ₹ ${Number(record.Deductions ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                    valueClass="text-red-500"
                  />
                  <SalaryCell
                    label="Net Salary"
                    value={`₹ ${Number(record.NetSalary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                    valueClass="text-primary font-semibold"
                  />
                </div>

                {/* Payment date */}
                <p className="text-xs text-muted-foreground">
                  {record.PaymentDate
                    ? `Paid on ${format(new Date(record.PaymentDate), 'dd MMM yyyy')}`
                    : 'Payment date not set'}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SalaryCell({ label, value, valueClass = '' }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2 space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
    </div>
  )
}

export default PreviousSalaryRecords

function PreviousSalaryRecordsSkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-14 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
