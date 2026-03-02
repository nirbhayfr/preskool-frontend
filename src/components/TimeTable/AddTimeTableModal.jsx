'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import moment from 'moment'

import { classes, sections } from '@/data/basicData'
import { useTeachers } from '@/hooks/useTeacher'
import { CircleLoader } from '../layout/RouteLoader'
import { useCreateTeacherTimeTable } from '@/hooks/useTeacherTimeTable'
import { toast } from 'sonner'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AddTimeTableModal({ onClose }) {
  const createMutation = useCreateTeacherTimeTable()
  const { data: teachers, isLoading } = useTeachers()
  const teacherList = teachers?.data ?? []

  const [activeDay, setActiveDay] = useState('Monday')

  const [form, setForm] = useState({
    classId: '',
    sectionId: '',
    duration: '45',
  })

  const [timeTable, setTimeTable] = useState(
    days.reduce((acc, day) => {
      acc[day] = [
        {
          teacherId: '',
          subject: '',
          startTime: '',
          endTime: '',
          roomId: '',
        },
      ]
      return acc
    }, {})
  )

  const handleTopChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRowChange = (day, index, field, value) => {
    const updated = [...timeTable[day]]
    updated[index][field] = value
    setTimeTable((prev) => ({ ...prev, [day]: updated }))
  }

  const addRow = (day) => {
    setTimeTable((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        { teacherId: '', subject: '', startTime: '', endTime: '', roomId: '' },
      ],
    }))
  }

  const deleteRow = (day, index) => {
    const updated = timeTable[day].filter((_, i) => i !== index)
    setTimeTable((prev) => ({ ...prev, [day]: updated }))
  }

  const calculateEndTime = (start) => {
    if (!start || !form.duration) return ''
    return moment(start, 'HH:mm').add(parseInt(form.duration), 'minutes').format('HH:mm')
  }

  const handleSubmit = () => {
    const payloads = []

    for (const day of Object.keys(timeTable)) {
      timeTable[day].forEach((row, index) => {
        if (!row.teacherId || !row.subject || !row.startTime) return

        payloads.push({
          teacherId: Number(row.teacherId),
          dayOfWeek: day,
          periodNo: index + 1,
          startTime: row.startTime + ':00',
          endTime: row.endTime + ':00',
          classId: form.classId,
          sectionId: form.sectionId,
          subject: row.subject,
          subjectId: 1, // TO BE EDITED LATER
          roomId: Number(row.roomId),
          isActive: true,
        })
      })
    }

    if (!payloads.length) return

    console.log(payloads)

    Promise.all(payloads.map((payload) => createMutation.mutateAsync(payload)))
      .then(() => {
        toast.success('Time table added successfully')
        onClose()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Failed to add time table')
      })
  }

  if (isLoading) return <CircleLoader />

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[1300px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Time Table</DialogTitle>
        </DialogHeader>

        <div className="space-y-10 py-4">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select onValueChange={(val) => handleTopChange('classId', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section</Label>
              <Select onValueChange={(val) => handleTopChange('sectionId', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      {sec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={form.duration}
                onChange={(e) => handleTopChange('duration', e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="grid grid-cols-6 w-full gap-2 p-1 bg-muted rounded-lg h-full">
              {days.map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="h-10 flex items-center justify-center text-sm font-medium rounded-md"
                >
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day} value={day}>
                <Card className="mt-6">
                  <CardContent className="p-8 space-y-8">
                    {timeTable[day].map((row, index) => (
                      <div key={index} className="space-y-6 border-b pb-6">
                        {/* ✅ Teacher Full Width */}
                        <div className="space-y-2">
                          <Label>Teacher</Label>
                          <Select
                            value={row.teacherId}
                            onValueChange={(val) =>
                              handleRowChange(day, index, 'teacherId', val)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Teacher" />
                            </SelectTrigger>

                            <SelectContent position="popper" className="z-[9999]">
                              {teacherList.map((teacher) => (
                                <SelectItem
                                  key={teacher.TeacherID}
                                  value={String(teacher.TeacherID)}
                                >
                                  {teacher.FullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* ✅ Rest in 2 Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Subject */}
                          <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                              value={row.subject}
                              onChange={(e) =>
                                handleRowChange(day, index, 'subject', e.target.value)
                              }
                            />
                          </div>

                          {/* Room */}
                          <div className="space-y-2">
                            <Label>Room ID</Label>
                            <Input
                              type="number"
                              value={row.roomId}
                              onChange={(e) =>
                                handleRowChange(day, index, 'roomId', e.target.value)
                              }
                            />
                          </div>

                          {/* Time From */}
                          <div className="space-y-2">
                            <Label>Time From</Label>
                            <Input
                              type="time"
                              value={row.startTime}
                              onChange={(e) => {
                                const start = e.target.value
                                const end = calculateEndTime(start)
                                handleRowChange(day, index, 'startTime', start)
                                handleRowChange(day, index, 'endTime', end)
                              }}
                            />
                          </div>

                          {/* Time To */}
                          <div className="space-y-2">
                            <Label>Time To</Label>
                            <Input
                              type="time"
                              value={row.endTime}
                              onChange={(e) =>
                                handleRowChange(day, index, 'endTime', e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteRow(day, index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button onClick={() => addRow(day)}>+ Add New Period</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Time Table</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
