/* eslint-disable react-hooks/preserve-manual-memoization */
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

import { useDeleteNotice, useNotices, useCreateNotices } from '@/hooks/useNoticeBoard'

import { useMemo, useState } from 'react'
import moment from 'moment'

export function Notices({ title = 'Notices' }) {
  const { data, isLoading } = useNotices()
  const { mutate: deleteNotice } = useDeleteNotice()
  const { mutate: createNotice, isLoading: creating } = useCreateNotices()

  const [deletingId, setDeletingId] = useState(null)
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    Classes: '',
    Description: '',
  })

  const items = useMemo(() => {
    if (!data?.data) return []
    return data.data.slice().sort((a, b) => moment(b.StartDate).diff(moment(a.StartDate)))
  }, [data?.data])

  const handleSubmit = (e) => {
    e.preventDefault()

    createNotice(form, {
      onSuccess: () => {
        setOpen(false)
        setForm({ Classes: '', Description: '' })
      },
    })
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>
  }

  return (
    <Card className="h-full rounded-sm text-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>

        {/* Add Notice Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              + Add Notice
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Notice</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  placeholder="Tomorrow is a holiday due to maintenance work."
                  value={form.Description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, Description: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Classes</Label>
                <Input
                  placeholder="1A,1B,10C"
                  value={form.Classes}
                  onChange={(e) => setForm((f) => ({ ...f, Classes: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Comma separated (e.g. 1A,1B,10C)
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4 max-h-130 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No notices available.</p>
        )}

        {items.map((item) => (
          <div
            key={item.NoticeID}
            className="relative rounded-lg border-l-4 border-blue-500 p-4
                       bg-muted/40 dark:bg-muted/30 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="space-y-2 max-w-[calc(100%-3rem)]">
                  <p className="text-sm font-medium leading-snug break-words">
                    {item.Description}
                  </p>

                  {item.Classes && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Classes:</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.Classes}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                disabled={deletingId === item.NoticeID}
                onClick={() => {
                  setDeletingId(item.NoticeID)
                  deleteNotice(item.NoticeID, {
                    onSettled: () => setDeletingId(null),
                  })
                }}
              >
                {deletingId === item.NoticeID ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
