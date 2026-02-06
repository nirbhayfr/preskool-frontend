import { useMemo } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'
import { useParams } from 'react-router-dom'
import { useExamResultsByStudent } from '@/hooks/useExamResults'
import { Skeleton } from '../ui/skeleton'

function ExamsResultsCard() {
  const { id } = useParams()
  const { data: result, isLoading, isError } = useExamResultsByStudent(id)

  const data = useMemo(
    () =>
      result?.data?.map((r) => {
        const isPass = r.MarksObtained >= r.MinMarks
        return {
          subject: r.Subject,
          max: r.MaxMarks,
          min: r.MinMarks,
          obtained: r.MarksObtained,
          result: isPass ? 'Pass' : 'Fail',
        }
      }) || [],
    [result]
  )

  const columns = useMemo(
    () => [
      { accessorKey: 'subject', header: 'Subject' },
      { accessorKey: 'max', header: 'Max Marks' },
      { accessorKey: 'min', header: 'Min Marks' },
      { accessorKey: 'obtained', header: 'Marks Obtained' },
      {
        accessorKey: 'result',
        header: 'Result',
        cell: ({ row }) => {
          const res = row.original.result
          return (
            <Badge
              className={
                res === 'Pass'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }
            >
              {res}
            </Badge>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalMarks = result?.data?.reduce((sum, r) => sum + r.MaxMarks, 0) || 0
  const marksObtained = result?.data?.reduce((sum, r) => sum + r.MarksObtained, 0) || 0
  const percentage = totalMarks ? ((marksObtained / totalMarks) * 100).toFixed(2) : '0.00'
  const finalResult = result?.data?.every((r) => r.MarksObtained >= r.MinMarks)
    ? 'Pass'
    : 'Fail'

  return (
    <>
      {isLoading && <ExamsResultsSkeleton />}
      {isError && <p>Failed to load student</p>}
      {!isLoading && !isError && result?.data && (
        <Card className="rounded-sm">
          <CardHeader className="py-3">
            <CardTitle className="text-lg font-semibold">Exam Results</CardTitle>
          </CardHeader>

          <CardContent className="pt-0 space-y-6">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody className="[&>tr>td]:py-3">
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
                      <TableCell colSpan={columns.length} className="text-center text-sm">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 px-2">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-medium">{totalMarks}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Marks Obtained</p>
                <p className="text-sm font-medium">{marksObtained}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Percentage</p>
                <p className="text-sm font-medium">{percentage}%</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Result</p>
                <p
                  className={`text-sm font-medium ${finalResult === 'Pass' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {finalResult}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default ExamsResultsCard

function ExamsResultsSkeleton() {
  return (
    <Card className="rounded-sm">
      {/* Header */}
      <CardHeader className="py-3">
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        {/* Table skeleton */}
        <div className="rounded-md border overflow-x-auto">
          <div className="p-3 space-y-3">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>

            {/* Body rows */}
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((__, colIdx) => (
                  <Skeleton key={colIdx} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Summary section */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 px-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
