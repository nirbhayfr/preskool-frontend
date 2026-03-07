import { useRef } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TableLayout({ columns, data }) {
  const scrollRef = useRef(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })
  }

  return (
    <div className="mt-12 w-full">
      {/* Scroll buttons */}
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={scrollLeft} className="border rounded-md p-1">
          <ChevronLeft size={18} />
        </button>

        <button onClick={scrollRight} className="border rounded-md p-1">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Scroll container */}
      <div ref={scrollRef} className="relative w-full overflow-x-auto rounded-md border">
        <table className="w-full caption-bottom text-sm min-w-max">
          <TableHeader className="bg-gray-100 dark:bg-stone-700">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-3 text-left whitespace-nowrap"
                  >
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
                  <TableCell key={cell.id} className="px-6 py-2 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
