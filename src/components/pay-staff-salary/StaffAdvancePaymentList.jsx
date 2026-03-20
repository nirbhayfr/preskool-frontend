// components/staff-salary/StaffAdvancePaymentList.jsx

import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePaymentsByPerson } from '@/hooks/usePayment'
import { IndianRupee, Download } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import AdvanceSlipPDF from '@/components/pdfs/AdvanceSlipPDF'

const statusConfig = {
  Pending: {
    label: 'Pending',
    className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40',
  },
  Adjusted: {
    label: 'Adjusted',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40',
  },
  Settled: {
    label: 'Settled',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40',
  },
  Paid: {
    label: 'Paid',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40',
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-700 dark:bg-red-950/40',
  },
}

function StatusBadge({ status }) {
  const config = statusConfig[status] ?? { label: status, className: '' }
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}

const handleDownloadAdvanceSlip = async (payment, staff) => {
  // Map staff to the shape AdvanceSlipPDF expects
  const staffAsTeacher = {
    FullName: staff?.FullName,
    TeacherID: staff?.StaffID,
    Subject: staff?.Role,
    Salary: staff?.Salary,
    ProfilePhoto: staff?.ProfilePhoto || staff?.ProfilePictureUrl,
  }

  const blob = await pdf(
    <AdvanceSlipPDF teacher={staffAsTeacher} payment={payment} />
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `advance-slip-${staff?.FullName ?? 'staff'}-${payment.ReferenceNo ?? payment.PaymentID}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

function StaffAdvancePaymentList({ staffId, staff }) {
  const {
    data: paymentsData,
    isLoading,
    isError,
  } = usePaymentsByPerson({
    personType: 'staff',
    personId: staffId,
  })

  const advances = (paymentsData?.data ?? paymentsData ?? []).filter(
    (p) => p.PaymentCategory === 'Advance'
  )

  if (isLoading) return <StaffAdvancePaymentListSkeleton />
  if (isError) return <p className="text-sm text-destructive">Failed to load payments</p>

  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Advance Payments
        </CardTitle>
      </CardHeader>

      <CardContent>
        {advances.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No advance payments found
          </p>
        ) : (
          <div className="divide-y divide-border">
            {advances.map((payment) => (
              <div
                key={payment.PaymentID}
                className="flex items-center justify-between gap-4 py-3"
              >
                {/* Left — date + ref */}
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium">
                    {format(new Date(payment.PaymentDate), 'dd MMM yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {payment.ReferenceNo ?? '—'}
                  </p>
                </div>

                {/* Middle — method + remarks */}
                <div className="hidden sm:block min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm">{payment.PaymentMethod}</p>
                  {payment.Remarks && (
                    <p className="text-xs text-muted-foreground truncate">
                      {payment.Remarks}
                    </p>
                  )}
                </div>

                {/* Right — amount + status + download */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-0.5 text-sm font-semibold">
                    <IndianRupee className="size-3.5" />
                    {Number(payment.TotalAmount)?.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <StatusBadge status={payment.PaymentStatus} />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleDownloadAdvanceSlip(payment, staff)}
                  >
                    <Download className="size-3 mr-1" />
                    Slip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StaffAdvancePaymentList

function StaffAdvancePaymentListSkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-20 hidden sm:block" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-7 w-14 rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
