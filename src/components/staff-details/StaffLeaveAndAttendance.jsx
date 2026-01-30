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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'

/* ------------------ Columns ------------------ */

const staffLeaveColumns = [
  { accessorKey: 'type', header: 'Leave Type' },
  { accessorKey: 'date', header: 'Leave Date' },
  { accessorKey: 'days', header: 'No of Days' },
  { accessorKey: 'appliedOn', header: 'Applied On' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={status === 'Approved' ? 'default' : 'secondary'}>{status}</Badge>
      )
    },
  },
]

/* ------------------ Data ------------------ */

const staffLeaveData = [
  {
    type: 'Casual Leave',
    date: '07 May 2024 - 07 May 2024',
    days: 1,
    appliedOn: '07 May 2024',
    status: 'Approved',
  },
  {
    type: 'Casual Leave',
    date: '08 May 2024 - 08 May 2024',
    days: 1,
    appliedOn: '04 May 2024',
    status: 'Approved',
  },
  {
    type: 'Casual Leave',
    date: '20 May 2024 - 20 May 2024',
    days: 1,
    appliedOn: '19 May 2024',
    status: 'Pending',
  },
  {
    type: 'Medical Leave',
    date: '05 May 2024 - 09 May 2024',
    days: 5,
    appliedOn: '05 May 2024',
    status: 'Approved',
  },
  {
    type: 'Medical Leave',
    date: '08 May 2024 - 11 May 2024',
    days: 4,
    appliedOn: '08 May 2024',
    status: 'Pending',
  },
  {
    type: 'Special Leave',
    date: '09 May 2024 - 09 May 2024',
    days: 1,
    appliedOn: '09 May 2024',
    status: 'Pending',
  },
]

/* ------------------ Component ------------------ */

function StaffLeaveAndAttendance() {
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data: staffLeaveData,
    columns: staffLeaveColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-6">
      {/* Staff Leaves */}
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Staff Leaves</CardTitle>

          <Button size="sm">Apply for Leave</Button>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Controls */}
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
              placeholder="Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="border-b last:border-b-0">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 px-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={staffLeaveColumns.length}
                      className="py-6 text-center text-sm"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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

      {/* Staff Attendance */}
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3 space-y-0">
          <CardTitle className="text-lg font-semibold">Staff Attendance</CardTitle>

          <p className="text-xs text-muted-foreground">Last Updated on : 25 May 2024</p>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-sm border p-3">
              <CheckCircle2 className="size-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Present</p>
                <p className="text-lg font-semibold">265</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-sm border p-3">
              <XCircle className="size-5 text-red-600" />
              <div>
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-lg font-semibold">05</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-sm border p-3">
              <AlertCircle className="size-5 text-yellow-600" />
              <div>
                <p className="text-xs text-muted-foreground">Half Day</p>
                <p className="text-lg font-semibold">01</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-sm border p-3">
              <Clock className="size-5 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Late</p>
                <p className="text-lg font-semibold">12</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StaffLeaveAndAttendance
