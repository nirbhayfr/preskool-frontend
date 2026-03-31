import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PDFDownloadLink } from '@react-pdf/renderer'
import FeeReceiptPDF from '@/components/pdfs/FeeReceiptPDF'
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateFeeSubmission, useDeleteFeeSubmission } from '@/hooks/useFeeSubmissions'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

function getTxnBase(transactionId) {
  if (!transactionId) return null
  const match = String(transactionId).match(/^(TXN\d+)/i)
  return match ? match[1] : null
}

function getReceiptGroupKey(item) {
  return (
    item.ReceiptGroupID ||
    item.ReceiptNo ||
    item.BatchID ||
    item.BatchId ||
    item.GroupID ||
    item.GroupId ||
    getTxnBase(item.TransactionID) ||
    item.TransactionID
  )
}

function getReceiptDisplayNo(group) {
  return (
    group.receiptGroupId ||
    group.submissions?.[0]?.ReceiptNo ||
    group.submissions?.[0]?.ReceiptGroupID ||
    getTxnBase(group.submissions?.[0]?.TransactionID) ||
    group.submissions?.[0]?.TransactionID ||
    'RECEIPT'
  )
}

function normalizeStatus(statuses) {
  const upper = statuses.map((s) => String(s || '').toUpperCase())
  if (upper.includes('PARTIAL')) return 'PARTIAL'
  if (upper.includes('SUCCESS')) return 'SUCCESS'
  if (upper.includes('PAID')) return 'PAID'
  if (upper.includes('PENDING')) return 'PENDING'
  return statuses[0] || '-'
}

const PAYMENT_MODES = ['Cash', 'UPI', 'Cheque', 'Bank Transfer', 'Card']
const PAYMENT_STATUSES = ['SUCCESS', 'PARTIAL', 'PENDING', 'CANCELLED']

function statusBadgeClass(status) {
  const s = String(status || '').toUpperCase()
  if (s === 'SUCCESS' || s === 'PAID') return 'bg-green-100 text-green-700'
  if (s === 'PARTIAL') return 'bg-yellow-100 text-yellow-700'
  if (s === 'CANCELLED') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-700'
}

// ─── Update Modal ─────────────────────────────────────────────────────────────
function UpdateSubmissionModal({ open, onClose, submission, onSave, isSaving }) {
  const [form, setForm] = React.useState({
    originalAmount: submission?.OriginalAmount ?? 0,
    discountAmount: submission?.DiscountAmount ?? 0,
    paidAmount: submission?.PaidAmount ?? 0,
    paymentMode: submission?.PaymentMode ?? '',
    remarks: submission?.Remarks ?? '',
    paymentStatus: submission?.PaymentStatus ?? '',
  })

  React.useEffect(() => {
    if (open && submission) {
      setForm({
        originalAmount: submission.OriginalAmount ?? 0,
        discountAmount: submission.DiscountAmount ?? 0,
        paidAmount: submission.PaidAmount ?? 0,
        paymentMode: submission.PaymentMode ?? '',
        remarks: submission.Remarks ?? '',
        paymentStatus: submission.PaymentStatus ?? '',
      })
    }
  }, [open, submission])

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleNumberInput = (key, value) => {
    const numVal = value === '' ? 0 : Number(value) || 0
    set(key, Math.max(0, numVal))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Fee Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Fee Type</Label>
            <Input value={submission?.FeeType ?? ''} disabled />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Original Amount (₹)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.originalAmount}
              onChange={(e) => handleNumberInput('originalAmount', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Discount Amount (₹)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.discountAmount}
              onChange={(e) => handleNumberInput('discountAmount', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Paid Amount (₹)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.paidAmount}
              onChange={(e) => handleNumberInput('paidAmount', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Payment Mode</Label>
            <Select value={form.paymentMode} onValueChange={(v) => set('paymentMode', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Payment Status</Label>
            <Select
              value={form.paymentStatus}
              onValueChange={(v) => set('paymentStatus', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Remarks</Label>
            <Input
              value={form.remarks}
              onChange={(e) => set('remarks', e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function PreviousFeesRecords({ feesData, isLoading, isError, student }) {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [expandedRows, setExpandedRows] = React.useState({})

  const [editingSubmission, setEditingSubmission] = React.useState(null)
  const [deletingSubmission, setDeletingSubmission] = React.useState(null)

  const { mutate: updateSubmission, isPending: isUpdating } = useUpdateFeeSubmission()
  const { mutate: deleteSubmission } = useDeleteFeeSubmission()

  const toggleRow = (key) => setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }))

  const handleUpdate = (form) => {
    if (!editingSubmission) return
    updateSubmission(
      {
        id: editingSubmission.SubmissionID,
        originalAmount: form.originalAmount,
        discountAmount: form.discountAmount,
        paidAmount: form.paidAmount,
        paymentMode: form.paymentMode,
        paymentStatus: form.paymentStatus,
        remarks: form.remarks,
      },
      {
        onSuccess: () => {
          toast.success('Submission updated')
          setEditingSubmission(null)
        },
        onError: () => toast.error('Failed to update submission'),
      }
    )
  }

  const handleDelete = () => {
    if (!deletingSubmission) return
    deleteSubmission(deletingSubmission.SubmissionID, {
      onSuccess: () => {
        toast.success('Submission deleted')
        setDeletingSubmission(null)
      },
      onError: () => toast.error('Failed to delete submission'),
    })
  }

  const groupedData = React.useMemo(() => {
    const rows = feesData?.data || []
    const map = new Map()

    rows.forEach((item) => {
      const key = getReceiptGroupKey(item)
      if (!map.has(key)) {
        map.set(key, {
          receiptGroupId: key,
          submittedDateRaw: item.SubmittedDate,
          datePaid: formatDate(item.SubmittedDate),
          mode: item.PaymentMode || '-',
          remarks: item.Remarks || '-',
          submissions: [],
          originalAmount: 0,
          discountAmount: 0,
          paidAmount: 0,
          statuses: [],
        })
      }

      const group = map.get(key)
      group.submissions.push(item)
      group.originalAmount += Number(item.OriginalAmount || 0)
      group.discountAmount += Number(item.DiscountAmount || 0)
      group.paidAmount += Number(item.PaidAmount || 0)
      group.statuses.push(item.PaymentStatus)

      if (
        item.SubmittedDate &&
        new Date(item.SubmittedDate) > new Date(group.submittedDateRaw)
      ) {
        group.submittedDateRaw = item.SubmittedDate
        group.datePaid = formatDate(item.SubmittedDate)
      }

      if (!group.mode || group.mode === '-') group.mode = item.PaymentMode || '-'
      if ((!group.remarks || group.remarks === '-') && item.Remarks)
        group.remarks = item.Remarks
    })

    return Array.from(map.values())
      .map((group) => ({ ...group, status: normalizeStatus(group.statuses) }))
      .sort(
        (a, b) => new Date(b.submittedDateRaw || 0) - new Date(a.submittedDateRaw || 0)
      )
  }, [feesData])

  const tableData = React.useMemo(
    () =>
      groupedData.map((group) => {
        const submissionsText = group.submissions
          .map((s) =>
            [
              s.FeeType,
              s.PaymentStatus,
              s.PaymentMode,
              s.Remarks,
              s.TransactionID,
              s.ReceiptNo,
            ]
              .join(' ')
              .toLowerCase()
          )
          .join(' ')

        return {
          group: `${group.submissions.length} fee row(s)`,
          code: getReceiptDisplayNo(group),
          dueDate: group.datePaid,
          amount: group.originalAmount,
          discount: group.discountAmount,
          paidAmount: group.paidAmount,
          status: group.status,
          mode: group.mode,
          refId: getReceiptDisplayNo(group),
          datePaid: group.datePaid,
          remarks: group.remarks,
          original: group,

          // 🔥 Add this
          searchText: `
          ${group.receiptGroupId}
          ${group.status}
          ${group.mode}
          ${group.remarks}
          ${group.datePaid}
          ${submissionsText}
        `.toLowerCase(),

          // 🔥 numeric fields
          numericValues: [
            Number(group.originalAmount || 0),
            Number(group.discountAmount || 0),
            Number(group.paidAmount || 0),
          ],
        }
      }),
    [groupedData]
  )

  const feeColumns = React.useMemo(
    () => [
      {
        id: 'expand',
        header: '',
        cell: ({ row }) => {
          const groupKey = row.original.original.receiptGroupId
          const expanded = !!expandedRows[groupKey]
          return (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toggleRow(groupKey)}
              className="h-8 w-8 p-0"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )
        },
      },
      { accessorKey: 'group', header: 'Fees Group' },
      { accessorKey: 'code', header: 'Receipt Code' },
      { accessorKey: 'dueDate', header: 'Date' },
      { accessorKey: 'amount', header: 'Original (₹)' },
      { accessorKey: 'discount', header: 'Discount (₹)' },
      { accessorKey: 'paidAmount', header: 'Paid (₹)' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge className={statusBadgeClass(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
      },
      { accessorKey: 'mode', header: 'Mode' },
      { accessorKey: 'refId', header: 'Ref ID' },
      { accessorKey: 'datePaid', header: 'Date Paid' },
      { accessorKey: 'remarks', header: 'Remarks' },
      {
        id: 'receipt',
        header: 'Receipt',
        cell: ({ row }) => {
          const receiptGroup = row.original.original
          const receiptNo = getReceiptDisplayNo(receiptGroup)
          return (
            <PDFDownloadLink
              document={
                <FeeReceiptPDF
                  student={student}
                  submissions={receiptGroup.submissions}
                  receiptNo={receiptNo}
                />
              }
              fileName={`receipt-${receiptNo}.pdf`}
            >
              {({ loading }) => (
                <Button size="sm" variant="outline">
                  {loading ? 'Generating…' : 'Download'}
                </Button>
              )}
            </PDFDownloadLink>
          )
        },
      },
    ],
    [student, expandedRows]
  )

  const table = useReactTable({
    data: tableData,
    columns: feeColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase().trim()
      if (!search) return true

      const group = row.original.original

      // ✅ Parent level fields
      const parentMatch =
        String(row.original.code).toLowerCase().includes(search) ||
        String(row.original.status).toLowerCase().includes(search) ||
        String(row.original.mode).toLowerCase().includes(search) ||
        String(row.original.remarks).toLowerCase().includes(search) ||
        String(row.original.datePaid).toLowerCase().includes(search)

      if (parentMatch) return true

      // ✅ Numeric match (parent totals)
      const searchNumber = Number(search)
      if (!isNaN(searchNumber)) {
        if (
          String(row.original.amount).includes(search) ||
          String(row.original.discount).includes(search) ||
          String(row.original.paidAmount).includes(search)
        ) {
          return true
        }
      }

      // ✅ 🔥 Sub-row match (THIS is the key fix)
      const subMatch = group.submissions.some((s) => {
        return (
          String(s.FeeType || '')
            .toLowerCase()
            .includes(search) ||
          String(s.PaymentStatus || '')
            .toLowerCase()
            .includes(search) ||
          String(s.PaymentMode || '')
            .toLowerCase()
            .includes(search) ||
          String(s.Remarks || '')
            .toLowerCase()
            .includes(search) ||
          String(s.TransactionID || '')
            .toLowerCase()
            .includes(search) ||
          String(s.ReceiptNo || '')
            .toLowerCase()
            .includes(search) ||
          // ✅ numeric fields inside sub rows
          String(s.OriginalAmount || '').includes(search) ||
          String(s.DiscountAmount || '').includes(search) ||
          String(s.PaidAmount || '').includes(search)
        )
      })

      return subMatch
    },
  })

  if (isLoading) return <FeesTableSkeleton />
  if (isError) return <p>Failed to load fee records</p>
  if (!feesData) return null

  return (
    <Card className="rounded-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Previous Fees Records</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span>Rows Per Page</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(val) => table.setPageSize(Number(val))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Search records..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const receiptGroup = row.original.original
                  const groupKey = receiptGroup.receiptGroupId
                  const expanded = !!expandedRows[groupKey]

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>

                      {expanded && (
                        <TableRow>
                          <TableCell
                            colSpan={feeColumns.length}
                            className="bg-muted/30 p-0"
                          >
                            <div className="p-4 space-y-3">
                              <p className="text-sm font-semibold">Included Fee Rows</p>

                              <div className="rounded-md border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-center">
                                        Fee Type
                                      </TableHead>
                                      <TableHead className="text-center">
                                        Original
                                      </TableHead>
                                      <TableHead className="text-center">
                                        Discount
                                      </TableHead>
                                      <TableHead className="text-center">Paid</TableHead>
                                      <TableHead className="text-center">
                                        Status
                                      </TableHead>
                                      <TableHead className="text-center">
                                        Actions
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>

                                  <TableBody>
                                    {receiptGroup.submissions.map((item, idx) => (
                                      <TableRow key={`${groupKey}-${idx}`}>
                                        <TableCell className="text-center">
                                          {item.FeeType || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          ₹
                                          {Number(
                                            item.OriginalAmount || 0
                                          ).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          ₹
                                          {Number(
                                            item.DiscountAmount || 0
                                          ).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          ₹
                                          {Number(item.PaidAmount || 0).toLocaleString(
                                            'en-IN'
                                          )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <Badge
                                            className={statusBadgeClass(
                                              item.PaymentStatus
                                            )}
                                          >
                                            {item.PaymentStatus || '-'}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <div className="flex items-center justify-center gap-1.5">
                                            <button
                                              onClick={() => setEditingSubmission(item)}
                                              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                              <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                              onClick={() => setDeletingSubmission(item)}
                                              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                              <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={feeColumns.length}
                    className="py-6 text-center text-sm"
                  >
                    No previous fee records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <span className="text-sm">{table.getState().pagination.pageIndex + 1}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>

      {/* Update Modal */}
      {editingSubmission && (
        <UpdateSubmissionModal
          open={!!editingSubmission}
          onClose={() => setEditingSubmission(null)}
          submission={editingSubmission}
          onSave={handleUpdate}
          isSaving={isUpdating}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deletingSubmission}
        onOpenChange={() => setDeletingSubmission(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fee Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{deletingSubmission?.FeeType}"
              submission of ₹
              {Number(deletingSubmission?.PaidAmount || 0).toLocaleString('en-IN')}? This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default PreviousFeesRecords

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function FeesTableSkeleton() {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
          <Skeleton className="h-9 w-48 rounded-md" />
        </div>
        <div className="rounded-md border overflow-x-auto">
          <div className="space-y-2 p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                {Array.from({ length: 12 }).map((__, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-5 w-6" />
          <Skeleton className="h-9 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
