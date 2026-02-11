import { useMemo, useState } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { classes, sections } from '@/data/basicData'
import { useAttendanceMatrixByClass } from '@/hooks/useAttendance'
import StudentMarksTable from '@/components/exam-result/StudentMarksTable'
import { toast } from 'sonner'

export default function ExamResultPage() {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')

  const [examType, setExamType] = useState('')
  const [subject, setSubject] = useState('')
  const [maxMarks, setMaxMarks] = useState('')
  const [minMarks, setMinMarks] = useState('')

  const { data: studentData, isLoading } = useAttendanceMatrixByClass(
    selectedClass,
    selectedSection
  )

  const students = useMemo(() => {
    if (!studentData?.Data) return []
    return studentData.Data
  }, [studentData])

  const handleFinalSubmit = (marksPayload) => {
    if (!selectedClass) {
      toast.warning('Class is required')
      return
    }

    if (!selectedSection) {
      toast.warning('Section is required')
      return
    }

    if (!examType.trim()) {
      toast.warning('Exam Type is required')
      return
    }

    if (!subject.trim()) {
      toast.warning('Subject is required')
      return
    }

    if (maxMarks === '' || isNaN(Number(maxMarks))) {
      toast.warning('Max Marks is required')
      return
    }

    if (minMarks === '' || isNaN(Number(minMarks))) {
      toast.warning('Min Marks is required')
      return
    }

    if (Number(minMarks) > Number(maxMarks)) {
      toast.warning('Min Marks cannot be greater than Max Marks')
      return
    }

    const finalPayload = marksPayload.map((item) => ({
      ...item,
      Class: selectedClass,
      Section: selectedSection,
      ExamType: examType.trim(),
      Subject: subject.trim(),
      MaxMarks: Number(maxMarks),
      MinMarks: Number(minMarks),
    }))

    console.log('Final Exam Payload:', finalPayload)
    toast.success('Console Logged The Data')
  }

  if (isLoading) return <CircleLoader />

  return (
    <section className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={selectedClass || 'none'}
          onValueChange={(v) => setSelectedClass(v === 'none' ? '' : v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedSection || 'none'}
          onValueChange={(v) => setSelectedSection(v === 'none' ? '' : v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {sections.map((sec) => (
              <SelectItem key={sec} value={sec}>
                {sec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exam Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          placeholder="Exam Type"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
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

      {!selectedClass ? (
        <div className="text-center text-muted-foreground py-10">
          No students, please select a valid class and section
        </div>
      ) : (
        <StudentMarksTable
          students={students}
          maxMarks={maxMarks}
          onSubmit={handleFinalSubmit}
        />
      )}
    </section>
  )
}
