import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStaffSalaryByStaffId } from '@/hooks/useStaffSalary'
import { format } from 'date-fns'
import { CheckCircle2, Clock, Minus } from 'lucide-react'

function StaffSalaryMonthGrid({ staffId }) {
  const { data, isLoading, isError } = useStaffSalaryByStaffId(staffId)

  const records = data?.data ?? []

  const recordMap = records.reduce((acc, r) => {
    acc[r.SalaryMonth] = r
    return acc
  }, {})

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (11 - i))

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    return {
      key,
      label: format(d, 'MMM yyyy'),
    }
  })

  const currentMonth = new Date().toISOString().slice(0, 7)

  if (isLoading) return <SalaryMonthGridSkeleton />

  if (isError)
    return <p className="text-sm text-destructive">Failed to load salary records</p>

  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Salary Status — {new Date().getFullYear()}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {months.map(({ key, label }) => {
            const record = recordMap[key]

            const isPaid = record?.IsPaid
            const isPending = record && !record.IsPaid
            const isCurrent = key === currentMonth

            return (
              <div
                key={key}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5
                  rounded-xl border px-2 py-3 text-center transition-colors
                  ${
                    isPaid
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                      : isPending
                        ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-800'
                        : 'bg-muted/40 border-muted'
                  }
                  ${isCurrent ? 'ring-2 ring-green-300 ring-offset-1' : ''}
                `}
              >
                {isPaid ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : isPending ? (
                  <Clock className="size-4 text-yellow-600" />
                ) : (
                  <Minus className="size-4 text-muted-foreground" />
                )}

                <p
                  className={`text-xs font-medium leading-tight ${
                    isPaid
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : isPending
                        ? 'text-yellow-700 dark:text-yellow-400'
                        : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </p>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            Paid
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-yellow-600" />
            Pending
          </div>

          <div className="flex items-center gap-1.5">
            <Minus className="size-3.5 text-muted-foreground" />
            Not Created
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StaffSalaryMonthGrid

function SalaryMonthGridSkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
