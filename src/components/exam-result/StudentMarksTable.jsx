import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function StudentMarksTable({ students = [], maxMarks, onSubmit }) {
  const [marksMap, setMarksMap] = useState({})

  const handleMarkChange = useCallback((studentId, value) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: value,
    }))
  }, [])

  const handleSubmit = () => {
    const payload = Object.entries(marksMap)
      .filter(([_, marks]) => marks !== '')
      .map(([studentId, marks]) => ({
        StudentId: Number(studentId),
        MarksObtained: Number(marks),
      }))
    if (onSubmit) onSubmit(payload)
  }

  return (
    <>
      <div className="rounded-md border overflow-auto mt-12">
        <Table>
          {/* Match header styling */}
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-6 py-3 text-left">Student ID</TableHead>
              <TableHead className="px-6 py-3 text-left">Student Name</TableHead>
              <TableHead className="px-6 py-3 text-left">Class</TableHead>
              <TableHead className="px-6 py-3 text-left">Section</TableHead>
              <TableHead className="px-6 py-3 text-left">Marks Obtained</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => {
              const studentId = student.StudentID

              return (
                <TableRow key={studentId}>
                  <TableCell className="px-6 py-2">{student.StudentID}</TableCell>

                  <TableCell className="px-6 py-2">{student.Name}</TableCell>

                  <TableCell className="px-6 py-2">{student.Class}</TableCell>

                  <TableCell className="px-6 py-2">{student.Section}</TableCell>

                  <TableCell className="px-6 py-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={marksMap[studentId] ?? ''}
                      onChange={(e) => {
                        const value = e.target.value

                        if (!/^\d*$/.test(value)) return

                        if (maxMarks && value !== '' && Number(value) > Number(maxMarks))
                          return

                        handleMarkChange(studentId, value)
                      }}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end p-4">
        <Button onClick={handleSubmit}>Submit Results</Button>
      </div>
    </>
  )
}
