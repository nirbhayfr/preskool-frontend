import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'
import { decryptData } from '@/utils/crypto'
import { useFeeSubmissionsByStudent } from '@/hooks/useFeeSubmissions'
import moment from 'moment'

import {
  Wallet,
  BookOpen,
  GraduationCap,
  Monitor,
  Trophy,
  FlaskConical,
} from 'lucide-react'
import { SkeletonCard } from '../extra/SkeletonCardList'

const feeTypeMeta = {
  MISC: {
    title: 'Misc Fees',
    icon: Wallet,
    color: 'slate',
  },
  LIBRARY: {
    title: 'Library Fees',
    icon: BookOpen,
    color: 'indigo',
  },
  EXAM: {
    title: 'Exam Fees',
    icon: GraduationCap,
    color: 'green',
  },
  COMPUTER: {
    title: 'Computer Fees',
    icon: Monitor,
    color: 'blue',
  },
  SPORTS: {
    title: 'Sports Fees',
    icon: Trophy,
    color: 'amber',
  },
  LAB: {
    title: 'Lab Fees',
    icon: FlaskConical,
    color: 'purple',
  },
  ANNUAL: {
    title: 'Annual Fees',
    icon: GraduationCap,
    color: 'emerald',
  },
}

const colorMap = {
  blue: 'bg-blue-500/15 text-blue-500',
  green: 'bg-green-500/15 text-green-500',
  indigo: 'bg-indigo-500/15 text-indigo-500',
  amber: 'bg-amber-500/15 text-amber-500',
  purple: 'bg-purple-500/15 text-purple-500',
  emerald: 'bg-emerald-500/15 text-emerald-500',
  slate: 'bg-slate-500/15 text-slate-500',
}

export function FeesReminder() {
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  const { data: feeData, isLoading, isError } = useFeeSubmissionsByStudent(user?.LinkedID)

  if (isLoading) return <SkeletonCard />
  if (isError) return <p>Failed to load student</p>
  if (!feeData?.data) return null

  const fees = feeData.data.map((item) => {
    const meta = feeTypeMeta[item.FeeType] || feeTypeMeta.ANNUAL

    return {
      title: meta.title,
      amount: `₹${item.PaidAmount}`,
      date: moment(item.SubmittedDate).format('DD MMM YYYY'),
      icon: meta.icon,
      color: meta.color,
      status: item.PaymentStatus !== 'SUCCESS' ? 'Due' : null,
    }
  })

  return (
    <Card className="w-full min-w-0 rounded-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Fees Reminder</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {fees.map((item, index) => {
          const Icon = item.icon

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-md bg-muted/60 dark:bg-muted/40 p-3"
            >
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                    colorMap[item.color]
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Text */}
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>

                  {item.status ? (
                    <span className="inline-flex rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-500">
                      {item.status}
                    </span>
                  ) : (
                    <p className="text-xs text-muted-foreground">Last Date</p>
                  )}

                  {item.date && (
                    <p className="text-xs font-medium text-foreground">{item.date}</p>
                  )}
                </div>
              </div>

              {/* Right */}
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                {item.amount}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
