import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { Wallet, Eye } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useTeacherSalaryById } from '@/hooks/useSalary'

/* ------------------ Columns ------------------ */

const salaryColumns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'salaryFor', header: 'Salary For' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'paymentMethod', header: 'Payment Method' },
  { accessorKey: 'netSalary', header: 'Net Salary' },
  {
    id: 'action',
    header: 'Action',
    cell: () => (
      <Button size="sm" variant="outline" className="gap-1">
        <Eye className="size-4" />
        View Payslip
      </Button>
    ),
  },
]

function TeacherSalary() {
  const { id } = useParams()
  const { data: response, isLoading, isError } = useTeacherSalaryById(id)
  const data = []

  const teacher = response?.data

  const table = useReactTable({
    data,
    columns: salaryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load salary</p>
  if (!teacher) return null

  return (
    <div className="space-y-6">
      {/* Salary Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Wallet className="size-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Monthly Salary</p>
              <p className="text-lg font-semibold">
                ₹ {teacher.Salary?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{teacher.FullName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary History */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Salary History</CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Page Size */}
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
              </SelectContent>
            </Select>
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
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={salaryColumns.length}
                      className="text-center py-6"
                    >
                      No salary records
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </Button>

            <span className="text-sm">{table.getState().pagination.pageIndex + 1}</span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherSalary
