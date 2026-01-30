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

import { Wallet, TrendingUp, TrendingDown, Eye } from 'lucide-react'

/* ------------------ Columns ------------------ */

const staffSalaryColumns = [
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

/* ------------------ Data ------------------ */

const staffSalaryData = [
  {
    id: 8198,
    salaryFor: 'Apr - 2024',
    date: '04 May 2024',
    paymentMethod: 'Cash',
    netSalary: '$20,000',
  },
  {
    id: 8197,
    salaryFor: 'Mar - 2024',
    date: '05 Apr 2024',
    paymentMethod: 'Cheque',
    netSalary: '$19,000',
  },
  {
    id: 8196,
    salaryFor: 'Feb - 2024',
    date: '05 Mar 2024',
    paymentMethod: 'Cash',
    netSalary: '$19,500',
  },
  {
    id: 8198,
    salaryFor: 'Jan - 2024',
    date: '06 Feb 2024',
    paymentMethod: 'Cash',
    netSalary: '$20,000',
  },
  {
    id: 8194,
    salaryFor: 'Dec - 2023',
    date: '03 Jan 2024',
    paymentMethod: 'Cheque',
    netSalary: '$19,480',
  },
  {
    id: 8193,
    salaryFor: 'Nov - 2023',
    date: '05 Dec 2023',
    paymentMethod: 'Cheque',
    netSalary: '$19,480',
  },
  {
    id: 8192,
    salaryFor: 'Oct - 2023',
    date: '03 Nov 2023',
    paymentMethod: 'Cheque',
    netSalary: '$19,480',
  },
  {
    id: 8191,
    salaryFor: 'Sep - 2023',
    date: '04 Oct 2023',
    paymentMethod: 'Cheque',
    netSalary: '$18,000',
  },
  {
    id: 8190,
    salaryFor: 'Aug - 2023',
    date: '06 Sep 2023',
    paymentMethod: 'Cheque',
    netSalary: '$20,000',
  },
  {
    id: 8189,
    salaryFor: 'Jul - 2023',
    date: '05 Aug 2023',
    paymentMethod: 'Cheque',
    netSalary: '$20,000',
  },
  {
    id: 8188,
    salaryFor: 'Jun - 2023',
    date: '06 Sep 2023',
    paymentMethod: 'Cheque',
    netSalary: '$20,000',
  },
  {
    id: 8187,
    salaryFor: 'May - 2023',
    date: '05 Aug 2023',
    paymentMethod: 'Cheque',
    netSalary: '$20,000',
  },
]

/* ------------------ Component ------------------ */

function StaffSalary() {
  const table = useReactTable({
    data: staffSalaryData,
    columns: staffSalaryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-6">
      {/* Totals */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Wallet className="size-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Net Salary</p>
              <p className="text-lg font-semibold">$5,55,410</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="size-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Gross Salary</p>
              <p className="text-lg font-semibold">$5,58,380</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingDown className="size-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Deduction</p>
              <p className="text-lg font-semibold">$2,500</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Salary Table */}
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Staff Salary</CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Controls */}
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
            <span className="text-muted-foreground">Entries</span>
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
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
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
    </div>
  )
}

export default StaffSalary
