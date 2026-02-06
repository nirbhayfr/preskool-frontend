import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { useNotices } from '@/hooks/useNoticeBoard'
import { SkeletonCard } from '../extra/SkeletonCardList'

export function NoticeBoard({ title = 'Notices' }) {
  const { data: notice, isLoading, isError } = useNotices()

  if (isLoading) {
    return <SkeletonCard rows={4} />
  }

  if (isError) {
    return (
      <Card className="h-full rounded-sm w-full">
        <CardHeader className="flex justify-between items-center px-4">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="px-4 py-6">
          <p className="text-sm text-red-500">Failed to load notices.</p>
        </CardContent>
      </Card>
    )
  }

  if (!notice?.data || notice.data.length === 0) {
    return (
      <Card className="h-full rounded-sm w-full">
        <CardHeader className="flex justify-between items-center px-4">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="px-4 py-6">
          <p className="text-sm text-muted-foreground">No notices available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full rounded-sm w-full">
      <CardHeader className="flex justify-between items-center px-4">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 px-4 py-2 max-h-96 overflow-y-auto">
        {notice.data.map((item) => (
          <div
            key={item.NoticeID}
            className="flex gap-2 items-start p-3 bg-muted/60 dark:bg-muted/40 rounded-md shadow"
          >
            <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-500">
              <FileText className="h-4 w-4" />
            </div>

            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium truncate">{item.Description || '—'}</p>
              <p className="text-xs text-muted-foreground truncate">
                Classes: {item.Classes || 'All'}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
