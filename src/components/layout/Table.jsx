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
  const intervalRef = useRef(null)

  const startScroll = (direction) => {
    // fire once immediately so a quick click still works
    scrollRef.current?.scrollBy({ left: direction * 16, behavior: 'auto' })
    intervalRef.current = setInterval(() => {
      scrollRef.current?.scrollBy({ left: direction * 16, behavior: 'auto' })
    }, 16) // ~60fps
  }

  const stopScroll = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="mt-12 w-full">
      {/* Scroll buttons */}
      <div className="flex justify-end gap-2 mb-2">
        <button
          className="border rounded-md p-1 select-none"
          onMouseDown={() => startScroll(-1)}
          onMouseUp={stopScroll}
          onMouseLeave={stopScroll}
          onTouchStart={() => startScroll(-1)}
          onTouchEnd={stopScroll}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="border rounded-md p-1 select-none"
          onMouseDown={() => startScroll(1)}
          onMouseUp={stopScroll}
          onMouseLeave={stopScroll}
          onTouchStart={() => startScroll(1)}
          onTouchEnd={stopScroll}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Scroll container */}
      <div ref={scrollRef} className="relative w-full overflow-x-auto rounded-md border">
        <table className="w-full caption-bottom text-sm min-w-max">
          <TableHeader className="bg-gray-100 dark:bg-stone-700">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const sticky = header.column.columnDef.meta?.sticky
                  const left = header.column.columnDef.meta?.left ?? 0
                  return (
                    <TableHead
                      key={header.id}
                      className={`
                        px-6 py-3 text-left whitespace-nowrap
                        ${sticky ? 'sticky z-20 bg-gray-100 dark:bg-stone-700 after:absolute after:inset-y-0 after:right-0 after:w-px' : ''}
                      `}
                      style={sticky ? { left } : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const sticky = cell.column.columnDef.meta?.sticky
                  const left = cell.column.columnDef.meta?.left ?? 0
                  return (
                    <TableCell
                      key={cell.id}
                      className={`
                        px-6 py-2 whitespace-nowrap
                        ${sticky ? 'sticky z-10 bg-background dark:bg-[#18181B] after:absolute after:inset-y-0 after:right-0 after:w-px' : ''}
                      `}
                      style={sticky ? { left } : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
