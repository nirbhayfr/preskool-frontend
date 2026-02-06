import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard({ rows = 4, showHeader = true, showIcon = true }) {
  return (
    <Card className="w-full min-w-0 rounded-sm">
      {showHeader && (
        <CardHeader className="pb-2 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </CardHeader>
      )}

      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-md bg-muted/40 p-3"
          >
            {/* Left */}
            <div className="flex items-center gap-3 flex-1">
              {showIcon && <Skeleton className="h-9 w-9 rounded-md shrink-0" />}

              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>

            {/* Right value */}
            <Skeleton className="h-4 w-14 shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
