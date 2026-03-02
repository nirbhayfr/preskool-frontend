/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import moment from 'moment'

const EditTimeTableModal = ({ open, onClose, data, onSave, isLoading }) => {
  const [form, setForm] = useState({
    subjectId: '',
    startTime: '',
    endTime: '',
    classId: '',
    roomId: '',
    sectionId: '',
  })

  /* =========================
     LOAD DATA INTO FORM
  ========================== */
  useEffect(() => {
    if (data && open) {
      setForm({
        subjectId: data.SubjectID || '',
        startTime: data.StartTime ? moment.utc(data.StartTime).format('HH:mm') : '',
        endTime: data.EndTime ? moment.utc(data.EndTime).format('HH:mm') : '',
        classId: data.ClassID || '',
        roomId: data.RoomID || '',
        sectionId: data.SectionID || '',
      })
    }
  }, [data, open])

  /* =========================
     HANDLE INPUT CHANGE
  ========================== */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = () => {
    const payload = {
      subjectID: form.subjectId,
      classID: form.classId,
      sectionID: form.sectionId,
      roomID: form.roomId,
      startTime: form.startTime,
      endTime: form.endTime,
    }

    onSave(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Time Table</DialogTitle>
          <DialogDescription>Edit Time Table</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Subject</Label>
            <Input name="subjectId" value={form.subjectId} onChange={handleChange} />
          </div>

          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Class</Label>
            <Input name="classId" value={form.classId} onChange={handleChange} />
          </div>

          <div>
            <Label>Section</Label>
            <Input name="sectionId" value={form.sectionId} onChange={handleChange} />
          </div>

          <div>
            <Label>Room No</Label>
            <Input name="roomId" value={form.roomId} onChange={handleChange} />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditTimeTableModal
