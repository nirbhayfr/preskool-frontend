import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

function UpdateResultPage() {
  const { id } = useParams()

  const [student, setStudent] = React.useState(null)

  React.useEffect(() => {
    setStudent({
      studentId: id,
      fullName: 'Aarav Sharma',
      class: '10',
      section: 'A',
    })
  }, [id])

  const [examType, setExamType] = React.useState('')
  const [maxMarks, setMaxMarks] = React.useState('')
  const [minMarks, setMinMarks] = React.useState('')

  const [rows, setRows] = React.useState([{ subject: '', marksObtained: '' }])

  const addRow = () => {
    setRows((prev) => [...prev, { subject: '', marksObtained: '' }])
  }

  const updateRow = (index, key, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const payload = {
      studentId: student.studentId,
      class: student.class,
      section: student.section,
      examType,
      maxMarks: Number(maxMarks),
      minMarks: Number(minMarks),
      results: rows.map((r) => ({
        subject: r.subject,
        marksObtained: Number(r.marksObtained),
      })),
    }

    console.log('Payload →', payload)
  }

  if (!student) return null

  return (
    <section className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Update Result</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Student ID" value={student.studentId} />
            <Field label="Full Name" value={student.fullName} />
            <Field label="Class" value={student.class} />
            <Field label="Section" value={student.section} />
          </div>

          {/* Exam Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger>
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Midterm">Midterm</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Max Marks"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Min Marks"
              value={minMarks}
              onChange={(e) => setMinMarks(e.target.value)}
            />
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
              >
                <Input
                  className="sm:col-span-2"
                  placeholder="Subject"
                  value={row.subject}
                  onChange={(e) => updateRow(index, 'subject', e.target.value)}
                />

                <Input
                  type="number"
                  className="sm:col-span-2"
                  placeholder="Marks Obtained"
                  value={row.marksObtained}
                  onChange={(e) => updateRow(index, 'marksObtained', e.target.value)}
                />

                <div className="flex justify-end sm:justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeRow(index)}
                    disabled={rows.length === 1}
                    className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="secondary" onClick={addRow} className="w-full sm:w-auto">
            + Add Subject
          </Button>

          {/* Submit */}
          <div className="flex justify-end">
            <Button className="w-full sm:w-auto" onClick={handleSubmit}>
              Save Result
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default UpdateResultPage

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input value={value} disabled className="bg-muted/40" />
    </div>
  )
}
