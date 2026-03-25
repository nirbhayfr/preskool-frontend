// components/salary/PaySalarySection.jsx

import { useCallback, useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  useTeacherSalaryByTeacherId,
  useUpdateTeacherSalary,
} from '@/hooks/useTeacherSalary'
import {
  useBulkMarkTeacherSalaryPaid,
  useDeleteTeacherSalary,
} from '@/hooks/useTeacherSalary'
import { usePaymentsByPerson, useUpdatePayment } from '@/hooks/usePayment'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { IndianRupee } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import SalarySlipPDF from '../pdfs/SalarySlip'

function SalaryCell({ label, value, valueClass = '' }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2 space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
    </div>
  )
}

const statusConfig = {
  Pending: {
    label: 'Pending',
    className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40',
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

function PaySalarySection({ teacherId, teacher }) {
  const [selectedAdvanceIds, setSelectedAdvanceIds] = useState({})

  const { data, isLoading, isError } = useTeacherSalaryByTeacherId(teacherId)
  const { mutate: bulkPay, isPending: isPaying } = useBulkMarkTeacherSalaryPaid()
  const { mutate: deleteSalary, isPending: isDeleting } = useDeleteTeacherSalary()
  const { mutate: updatePayment } = useUpdatePayment()

  const { data: paymentsData } = usePaymentsByPerson({
    personType: 'teacher',
    personId: teacherId,
  })

  const records = data?.data ?? []
  const pendingRecords = records.filter((r) => !r.IsPaid)

  const activeSalary = pendingRecords[0] || null
  const hasPendingSalary = pendingRecords.length > 0

  const advances = (paymentsData?.data ?? paymentsData ?? []).filter(
    (p) => p.PaymentCategory === 'Advance'
  )
  const pendingAdvances = advances.filter((p) => p.PaymentStatus === 'Pending')

  const toggleAdvance = (salaryId, paymentId) => {
    setSelectedAdvanceIds((prev) => {
      const current = prev[salaryId] || []

      return {
        ...prev,
        [salaryId]: current.includes(paymentId)
          ? current.filter((id) => id !== paymentId)
          : [...current, paymentId],
      }
    })
  }
  const getSelectedAdvanceTotal = (salaryId) => {
    const ids = selectedAdvanceIds[salaryId] || []

    return pendingAdvances
      .filter((p) => ids.includes(p.PaymentID))
      .reduce((sum, p) => sum + Number(p.TotalAmount ?? 0), 0)
  }

  const { mutate: updateSalary } = useUpdateTeacherSalary()
  const handlePay = useCallback(
    (salary, teacher) => {
      const salaryId = salary.SalaryID

      const ids = selectedAdvanceIds[salaryId] || []
      const selectedTotal = getSelectedAdvanceTotal(salaryId)

      const updatedDeductions = Number(salary.Deductions ?? 0) + selectedTotal

      updateSalary(
        {
          id: salaryId,
          payload: {
            basicSalary: Number(salary.BasicSalary),
            allowances: Number(salary.Allowances ?? 0),
            deductions: updatedDeductions,
            paymentDate: new Date().toISOString().slice(0, 10),
            isPaid: true,
          },
        },
        {
          onSuccess: () => {
            bulkPay([salary.TeacherID], {
              onSuccess: async () => {
                toast.success('Salary marked as paid')

                // Auto-print salary slip
                try {
                  const updatedSalary = {
                    ...salary,
                    Deductions: updatedDeductions,
                    NetSalary:
                      Number(salary.BasicSalary) +
                      Number(salary.Allowances ?? 0) -
                      updatedDeductions,
                    IsPaid: true,
                    PaymentDate: new Date().toISOString().slice(0, 10),
                  }

                  const blob = await pdf(
                    <SalarySlipPDF teacher={teacher} salary={updatedSalary} />
                  ).toBlob()

                  const url = URL.createObjectURL(blob)
                  window.open(url)
                } catch (err) {
                  console.error('Failed to print salary slip', err)
                }

                // ✅ Settle ONLY selected advances for this salary
                if (ids.length > 0) {
                  ids.forEach((id) => {
                    updatePayment({
                      id,
                      data: { paymentStatus: 'Settled' },
                    })
                  })

                  toast.success(`${ids.length} advance(s) marked as settled`)

                  // ✅ Clear only this salary's selection
                  setSelectedAdvanceIds((prev) => ({
                    ...prev,
                    [salaryId]: [],
                  }))
                }
              },
              onError: () => toast.error('Failed to mark salary as paid'),
            })
          },
          onError: () => toast.error('Failed to update salary'),
        }
      )
    },
    [bulkPay, updatePayment, updateSalary, selectedAdvanceIds, getSelectedAdvanceTotal]
  )
  const handleDelete = useCallback(
    (salary) => {
      deleteSalary(salary.SalaryID, {
        onSuccess: () => {
          toast.success('Salary record deleted')

          const remarks = salary.Remarks ?? ''
          const match = remarks.match(/settled_advances:([\d,]+)/)
          if (match) {
            const ids = match[1].split(',').map(Number)
            ids.forEach((id) => {
              updatePayment({ id, data: { paymentStatus: 'Pending' } })
            })
            toast.info(`${ids.length} advance(s) reverted to Pending`)
          }
        },
        onError: () => toast.error('Failed to delete salary record'),
      })
    },
    [deleteSalary, updatePayment]
  )

  if (isLoading) return <PaySalarySkeleton />
  if (isError)
    return <p className="text-sm text-destructive">Failed to load salary records</p>

  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">Pay Salary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Salary records */}
        {!activeSalary ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No pending salary records. Create a salary first.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {activeSalary &&
              (() => {
                const record = activeSalary
                const selectedAdvanceTotal = getSelectedAdvanceTotal(record.SalaryID)

                const netAfterAdvance = Math.max(
                  Number(record.NetSalary) - selectedAdvanceTotal,
                  0
                )

                return (
                  <div key={record.SalaryID} className="py-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">
                          {format(new Date(`${record.SalaryMonth}-01`), 'MMMM yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: #{record.SalaryID} · Created{' '}
                          {format(new Date(record.CreatedAt), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40"
                      >
                        Pending
                      </Badge>
                    </div>

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

                    {/* Advance selection — only shown if pending salary exists */}
                    {pendingAdvances.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Deduct Advances
                          </p>
                          {selectedAdvanceTotal > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-orange-600 bg-orange-50 dark:bg-orange-950/40"
                            >
                              − ₹{' '}
                              {selectedAdvanceTotal.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                              })}
                            </Badge>
                          )}
                        </div>

                        {advances.map((payment) => {
                          const isPending = payment.PaymentStatus === 'Pending'
                          return (
                            <div
                              key={payment.PaymentID}
                              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                                isPending
                                  ? 'cursor-pointer hover:bg-muted/40'
                                  : 'opacity-60 cursor-not-allowed'
                              }`}
                              onClick={() =>
                                isPending &&
                                toggleAdvance(record.SalaryID, payment.PaymentID)
                              }
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={(
                                    selectedAdvanceIds[record.SalaryID] || []
                                  ).includes(payment.PaymentID)}
                                  disabled={!isPending}
                                  onCheckedChange={() =>
                                    isPending &&
                                    toggleAdvance(record.SalaryID, payment.PaymentID)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="space-y-0.5">
                                  <p className="text-sm font-medium">
                                    {format(new Date(payment.PaymentDate), 'dd MMM yyyy')}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {payment.ReferenceNo ?? '—'} · {payment.PaymentMethod}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-0.5 text-sm font-semibold text-orange-600">
                                  <IndianRupee className="size-3.5" />
                                  {Number(payment.TotalAmount).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                  })}
                                </div>
                                <StatusBadge status={payment.PaymentStatus} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Net after advance */}
                    {selectedAdvanceTotal > 0 && (
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                        <p className="text-sm text-muted-foreground">
                          Net Payable After Advance
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          ₹{' '}
                          {netAfterAdvance.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Payment date will be set to today
                    </p>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        disabled={isPaying}
                        onClick={() => handlePay(record, teacher)}
                      >
                        {isPaying ? <Spinner /> : 'Mark as Paid'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => handleDelete(record)}
                      >
                        {isDeleting ? <Spinner /> : 'Delete'}
                      </Button>
                    </div>
                  </div>
                )
              })()}
          </div>
        )}

        {/* Show all advances read-only if no pending salary */}
        {!hasPendingSalary && advances.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Advance Payments
              </p>
              <div className="divide-y divide-border">
                {advances.map((payment) => (
                  <div
                    key={payment.PaymentID}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium">
                        {format(new Date(payment.PaymentDate), 'dd MMM yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {payment.ReferenceNo ?? '—'} · {payment.PaymentMethod}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-0.5 text-sm font-semibold">
                        <IndianRupee className="size-3.5" />
                        {Number(payment.TotalAmount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <StatusBadge status={payment.PaymentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default PaySalarySection

function PaySalarySkeleton() {
  return (
    <Card className="rounded-xl border-muted/60">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
