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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { CheckCheck, X, Clock, Calendar } from 'lucide-react'

import { useAttendanceMatrixByStudentId } from '@/hooks/useAttendance'
import { useParams } from 'react-router-dom'

import { getAttendanceColumns } from '../student-attendance/StudentAttendanceColumns'

function StudentAttendance() {
  const { id } = useParams()

  const [selectedMonth, setSelectedMonth] = React.useState('2026-01')

  const { data: attendanceData, isLoading, isError } = useAttendanceMatrixByStudentId(id)

  const tableData = attendanceData?.Data || []

  const columns = React.useMemo(
    () => getAttendanceColumns(selectedMonth),
    [selectedMonth]
  )

  const { presentCount, absentCount } = React.useMemo(() => {
    let present = 0
    let absent = 0

    tableData.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (!key.startsWith(selectedMonth)) return

        if (value === 'P') present++
        if (value === 'A') absent++
      })
    })

    return { presentCount: present, absentCount: absent }
  }, [tableData, selectedMonth])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) return <p>Loading attendance...</p>
  if (isError) return <p>Failed to load attendance</p>
  if (!attendanceData) return null

  return (
    <div className="space-y-6">
      <Card className="rounded-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">Attendance</CardTitle>

          {/* Month Selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Month</span>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-[160px]"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Legend + Monthly Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Status Legend */}
            <div className="flex flex-wrap gap-3">
              <LegendItem
                icon={<CheckCheck className="h-4 w-4" />}
                label="Present"
                bg="bg-emerald-700"
              />
              <LegendItem
                icon={<X className="h-4 w-4" />}
                label="Absent"
                bg="bg-red-700"
              />
              <LegendItem
                icon={<Calendar className="h-4 w-4" />}
                label="Holiday"
                bg="bg-slate-400"
              />
            </div>

            {/* Monthly Summary */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                <span className="font-medium">Present: {presentCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                <span className="font-medium">Absent: {absentCount}</span>
              </div>
            </div>
          </div>

          {/* ✅ TABLE — THIS WILL RENDER */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="text-center"
                      >
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
                        <TableCell key={cell.id} className="p-2 text-center">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="py-6 text-center text-sm"
                    >
                      No attendance data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentAttendance

function LegendItem({ icon, label, bg }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm font-medium">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md text-white ${bg}`}
      >
        {icon}
      </span>
      {label}
    </div>
  )
}
