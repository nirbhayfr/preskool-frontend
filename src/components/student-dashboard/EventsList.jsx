import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import { useMemo } from 'react'
import { useEvents } from '@/hooks/useEvent'
import moment from 'moment'
import { Skeleton } from '@/components/ui/skeleton'

const BORDER_COLORS = [
  'border-blue-500',
  'border-red-500',
  'border-cyan-500',
  'border-emerald-500',
  'border-amber-500',
  'border-purple-500',
]

function EventSkeleton() {
  return (
    <Card className="h-full rounded-sm">
      <CardHeader>
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>

      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border-l-4 border-muted p-4 bg-muted/40 space-y-2"
          >
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function EventsList({ title = 'Events List' }) {
  const { data, isLoading, isError } = useEvents()

  const items = useMemo(() => {
    if (!data?.data) return []
    return data.data.slice().sort((a, b) => moment(a.StartDate).diff(moment(b.StartDate)))
  }, [data?.data])

  const colorMap = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      map[item.EventID] = BORDER_COLORS[item.EventID % BORDER_COLORS.length]
    })
    return map
  }, [items])

  if (isLoading) {
    return <EventSkeleton />
  }

  if (isError) {
    return (
      <Card className="h-full rounded-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">Failed to load events.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full rounded-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 max-h-100 overflow-y-auto">
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
              <div className="space-y-1 min-w-0">
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
                  <span>
                    {item.PublishedDate
                      ? moment(item.PublishedDate).format('DD-MM-YYYY')
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
