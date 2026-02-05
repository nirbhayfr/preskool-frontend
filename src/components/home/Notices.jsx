import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Trash2 } from 'lucide-react'
import { useDeleteNotice, useNotices } from '@/hooks/useNoticeBoard'
import { useMemo, useState } from 'react'
import moment from 'moment'

export function Notices({ title = 'Notices' }) {
  const { data, isLoading } = useNotices()
  const { mutate: deleteNotice } = useDeleteNotice()
  const [deletingId, setDeletingId] = useState(null)

  const items = useMemo(() => {
    if (!data?.data) return []
    return data.data.slice().sort((a, b) => moment(a.StartDate).diff(moment(b.StartDate)))
  }, [data?.data])

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>
  }

  return (
    <Card className="h-full rounded-sm text-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="ghost" size="sm">
          + Add Notice
        </Button>
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
                {/* Fallback icon (since API has no level/type) */}
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="space-y-2 max-w-[calc(100%-3rem)]">
                  {/* Description FIRST */}
                  <p className="text-sm font-medium leading-snug break-words">
                    {item.Description}
                  </p>

                  {/* Classes SECOND */}
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
