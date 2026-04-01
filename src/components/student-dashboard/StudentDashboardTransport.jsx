import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useMemo } from 'react'
import { decryptData } from '@/utils/crypto'
import { useTransportHistoryByStudent } from '@/hooks/useTransportHistoryCrud'
import { Bus, MapPin, CheckCircle2, XCircle } from 'lucide-react'
import { SkeletonCard } from '../extra/SkeletonCardList'

// ─────────────────────────────────────────────────────────────────────────────
// "Not A" → "Not Availed", anything else is an active status
// ─────────────────────────────────────────────────────────────────────────────

function isActive(status) {
  return status && status !== 'N/A' && status !== 'Not A' && status !== 'Not Availed'
}

function statusLabel(status) {
  if (!status || status === 'N/A' || status === 'Not A') return 'Not Availed'
  return status
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TransportReminder() {
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  const { data: raw, isLoading, isError } = useTransportHistoryByStudent(user?.LinkedID)

  if (isLoading) return <SkeletonCard />
  if (isError) return <p>Failed to load transport history</p>
  if (!raw?.data?.length) return null

  return (
    <Card className="w-full min-w-0 rounded-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <Bus className="h-3.5 w-3.5 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Transport History</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-3 max-h-[420px] overflow-y-auto">
        {raw.data.map((yearGroup) => (
          <YearGroup key={yearGroup.academicYear} yearGroup={yearGroup} />
        ))}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// One academic year block
// ─────────────────────────────────────────────────────────────────────────────

function YearGroup({ yearGroup }) {
  const activeCount = yearGroup.months.filter((m) => isActive(m.transportStatus)).length

  return (
    <>
      {/* Year header */}
      <div className="px-4 pb-1 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {yearGroup.academicYear}
        </p>
        <p className="text-[10px] text-muted-foreground tabular-nums">
          {activeCount} / {yearGroup.months.length} availed
        </p>
      </div>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-border/60">
            <th className="pl-4 pr-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground w-20">
              Month
            </th>
            <th className="px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground">
              Route
            </th>
            <th className="px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground hidden sm:table-cell">
              Vehicle
            </th>
            <th className="pl-2 pr-4 py-1.5 text-right text-[10px] font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {yearGroup.months.map((month) => {
            const active = isActive(month.transportStatus)
            return (
              <tr
                key={month.id}
                className={`border-b border-border/40 last:border-0 transition-colors ${
                  active ? 'hover:bg-muted/30' : 'opacity-50'
                }`}
              >
                {/* Month */}
                <td className="pl-4 pr-2 py-2.5 align-middle font-medium text-foreground whitespace-nowrap">
                  {month.monthName}
                </td>

                {/* Route */}
                <td className="px-2 py-2.5 align-middle">
                  {active ? (
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      {month.route}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>

                {/* Vehicle */}
                <td className="px-2 py-2.5 align-middle text-muted-foreground hidden sm:table-cell">
                  {active ? (
                    <span className="inline-flex items-center gap-1">
                      <Bus className="h-3 w-3 shrink-0" />
                      {month.vehicleNo}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Status */}
                <td className="pl-2 pr-4 py-2.5 text-right align-middle">
                  {active ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {statusLabel(month.transportStatus)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                      <XCircle className="h-2.5 w-2.5" />
                      Not Availed
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Spacer between year groups */}
      <div className="border-b border-border/60 my-2 last:hidden" />
    </>
  )
}
