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
import EditExamResultDialog from './EditExamResultDialog'
import { decryptData } from '@/utils/crypto'

function ExamTypeTable({ examType, examData }) {
  const encryptedUser = localStorage.getItem('user')
  const user = encryptedUser ? decryptData(encryptedUser) : null
  const columns = useMemo(
    () => [
      { accessorKey: 'Subject', header: 'Subject' },
      { accessorKey: 'MaxMarks', header: 'Max Marks' },
      { accessorKey: 'MinMarks', header: 'Min Marks' },
      { accessorKey: 'MarksObtained', header: 'Marks Obtained' },
      {
        id: 'result',
        header: 'Result',
        cell: ({ row }) => {
          const isPass = row.original.MarksObtained >= row.original.MinMarks

          return (
            <Badge
              variant="outline"
              className={
                isPass
                  ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
                  : 'text-destructive border-destructive/20 bg-destructive/10'
              }
            >
              {isPass ? 'Pass' : 'Fail'}
            </Badge>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          if (user?.Role !== 'Admin' && user?.Role !== 'Teacher') {
            return null
          }

          return <EditExamResultDialog examData={row.original} />
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: examData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalMarks = examData.reduce((s, r) => s + r.MaxMarks, 0)
  const marksObtained = examData.reduce((s, r) => s + r.MarksObtained, 0)
  const percentage = totalMarks ? ((marksObtained / totalMarks) * 100).toFixed(2) : '0.00'

  const finalResult = examData.every((r) => r.MarksObtained >= r.MinMarks)
    ? 'Pass'
    : 'Fail'

  return (
    <Card className="rounded-sm">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-semibold">{examType} Examination</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Total</p>
            <p className="font-medium">{totalMarks}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Marks Obtained</p>
            <p className="font-medium">{marksObtained}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Percentage</p>
            <p className="font-medium">{percentage}%</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Result</p>
            <p
              className={
                finalResult === 'Pass'
                  ? 'text-emerald-600 font-medium'
                  : 'text-destructive font-medium'
              }
            >
              {finalResult}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExamTypeTable
