import { memo } from 'react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const MemoRow = memo(({ row }) => {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="px-6 py-2">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
})

function TableLayout({ columns, data }) {
  const coreRowModel = getCoreRowModel()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: coreRowModel,
  })

  return (
    <div className="rounded-md border overflow-auto mt-12">
      <Table>
        <TableHeader className="bg-gray-100 dark:bg-stone-700">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id} className="px-6 py-3 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <MemoRow key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default memo(TableLayout)
