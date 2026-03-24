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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PDFDownloadLink } from '@react-pdf/renderer'
import FeeReceiptPDF from '@/components/pdfs/FeeReceiptPDF'
import { ChevronDown, ChevronRight } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return ''

  const d = new Date(dateStr)

  return d.toLocaleDateString('en-IN', {
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

function PreviousFeesRecords({ feesData, isLoading, isError, student }) {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [expandedRows, setExpandedRows] = React.useState({})

  const toggleRow = (key) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
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

      if (item.SubmittedDate && new Date(item.SubmittedDate) > new Date(group.submittedDateRaw)) {
        group.submittedDateRaw = item.SubmittedDate
        group.datePaid = formatDate(item.SubmittedDate)
      }

      if (!group.mode || group.mode === '-') group.mode = item.PaymentMode || '-'
      if ((!group.remarks || group.remarks === '-') && item.Remarks) group.remarks = item.Remarks
    })

    return Array.from(map.values())
      .map((group) => ({
        ...group,
        status: normalizeStatus(group.statuses),
      }))
      .sort((a, b) => new Date(b.submittedDateRaw || 0) - new Date(a.submittedDateRaw || 0))
  }, [feesData])

  const tableData = React.useMemo(() => {
    return groupedData.map((group) => ({
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
    }))
  }, [groupedData])

  const feeColumns = React.useMemo(
    () => [
      {
        id: 'expand',
        header: '',
        cell: ({ row }) => {
          const receiptGroup = row.original.original
          const groupKey = receiptGroup.receiptGroupId
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
      { accessorKey: 'amount', header: 'Original Amount (₹)' },
      { accessorKey: 'discount', header: 'Discount (₹)' },
      { accessorKey: 'paidAmount', header: 'Paid Amount (₹)' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = String(row.original.status || '').toUpperCase()

          const className =
            status === 'SUCCESS' || status === 'PAID'
              ? 'bg-green-100 text-green-700'
              : status === 'PARTIAL'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-slate-100 text-slate-700'

          return <Badge className={className}>{row.original.status}</Badge>
        },
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
                  {loading ? 'Generating...' : 'Download'}
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
                          <TableCell colSpan={feeColumns.length} className="bg-muted/30">
                            <div className="p-3 rounded-lg space-y-2">
                              <p className="text-sm font-semibold">Included Fee Rows</p>

                              <div className="rounded-md border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-center">Fee Type</TableHead>
                                      <TableHead className="text-center">Original</TableHead>
                                      <TableHead className="text-center">Discount</TableHead>
                                      <TableHead className="text-center">Paid</TableHead>
                                      <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>

                                  <TableBody>
                                    {receiptGroup.submissions.map((item, idx) => (
                                      <TableRow key={`${groupKey}-${idx}`}>
                                        <TableCell className="text-center">
                                          {item.FeeType || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          ₹{Number(item.OriginalAmount || 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          ₹{Number(item.DiscountAmount || 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          ₹{Number(item.PaidAmount || 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <Badge
                                            className={
                                              String(item.PaymentStatus || '').toUpperCase() === 'PARTIAL'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-green-100 text-green-700'
                                            }
                                          >
                                            {item.PaymentStatus || '-'}
                                          </Badge>
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
    </Card>
  )
}

export default PreviousFeesRecords

function FeesTableSkeleton() {
  return (
    <Card className="rounded-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-5 w-24" />
        </CardTitle>
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