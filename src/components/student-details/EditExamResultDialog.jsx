import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'

import { toast } from 'sonner'
import { useUpdateExamResult } from '@/hooks/useExamResults'

function EditExamResultDialog({ examData }) {
  const [open, setOpen] = useState(false)

  const [marksObtained, setMarksObtained] = useState(examData.MarksObtained)
  const [maxMarks, setMaxMarks] = useState(examData.MaxMarks)
  const [minMarks, setMinMarks] = useState(examData.MinMarks)

  const { mutate: updateExamResult, isPending } = useUpdateExamResult()

  const handleUpdate = () => {
    if (Number(minMarks) > Number(maxMarks)) {
      toast.warning('Min Marks cannot be greater than Max Marks')
      return
    }

    if (Number(marksObtained) > Number(maxMarks)) {
      toast.warning('Marks cannot exceed Max Marks')
      return
    }

    updateExamResult(
      {
        id: examData.ResultId,
        payload: {
          studentId: examData.StudentID,
          class: examData.Class,
          section: examData.Section,
          examType: examData.ExamType,
          subject: examData.Subject,
          maxMarks: Number(maxMarks),
          minMarks: Number(minMarks),
          marksObtained: Number(marksObtained),
        },
      },
      {
        onSuccess: () => {
          toast.success('Result updated successfully')
          setOpen(false)
        },
        onError: () => {
          toast.error('Failed to update result')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exam Result</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={examData.Subject} disabled />
          <Input value={examData.ExamType} disabled />

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

          <Input
            type="number"
            placeholder="Marks Obtained"
            value={marksObtained}
            onChange={(e) => setMarksObtained(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} disabled={isPending}>
            {isPending ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditExamResultDialog
