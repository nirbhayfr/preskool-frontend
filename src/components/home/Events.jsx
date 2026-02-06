/* eslint-disable react-hooks/preserve-manual-memoization */
import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Trash2, Clock, FileText } from 'lucide-react'
import { useDeleteEvent, useEvents, useCreateEvents } from '@/hooks/useEvent'
import moment from 'moment'
import { useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const BORDER_COLORS = [
  'border-blue-500',
  'border-red-500',
  'border-cyan-500',
  'border-emerald-500',
  'border-amber-500',
  'border-purple-500',
]

export function Schedules({ title = 'Events' }) {
  const { data, isLoading } = useEvents()
  const { mutate: deleteEvent } = useDeleteEvent()
  const { mutate: createEvent, isLoading: creating } = useCreateEvents()
  const [deletingId, setDeletingId] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    EventName: '',
    StartDate: '',
    EndDate: '',
    Description: '',
  })

  const items = useMemo(() => {
    if (!data?.data) return []

    return data.data
      .slice()
      .sort((a, b) => moment(b.PublishedDate).diff(moment(a.PublishedDate)))
  }, [data?.data])

  const colorMap = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      map[item.EventID] = BORDER_COLORS[item.EventID % BORDER_COLORS.length]
    })
    return map
  }, [items])

  const handleSubmit = (e) => {
    e.preventDefault()
    createEvent(form, {
      onSuccess: () => {
        setIsModalOpen(false)
        setForm({ EventName: '', StartDate: '', EndDate: '', Description: '' })
      },
    })
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <>
      <Card className="h-full rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>

          {/* Add New Button triggers modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                + Add New
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    value={form.EventName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, EventName: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={form.StartDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, StartDate: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={form.EndDate}
                    onChange={(e) => setForm((f) => ({ ...f, EndDate: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.Description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Description: e.target.value }))
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-4 max-h-130 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">No upcoming events.</p>
          )}

          {items.map((item) => (
            <div
              key={item.EventID}
              className={`relative rounded-lg border-l-4 p-4 shadow-sm
                bg-muted/40 dark:bg-muted/30
                ${colorMap[item.EventID]}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium truncate">{item.EventName}</h4>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {moment(item.StartDate).format('DD-MM-YYYY')}
                      {item.EndDate && ` - ${moment(item.EndDate).format('DD-MM-YYYY')}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{moment(item.PublishedDate).format('DD-MM-YYYY')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{item.Description}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deletingId === item.EventID}
                  onClick={() => {
                    setDeletingId(item.EventID)
                    deleteEvent(item.EventID, {
                      onSettled: () => setDeletingId(null),
                    })
                  }}
                >
                  {deletingId === item.EventID ? (
                    '...'
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
