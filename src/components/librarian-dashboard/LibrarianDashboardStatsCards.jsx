import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowUpRight,
  ArrowDownRight,
  Book,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react'

const dashboardStats = [
  {
    title: 'Borrowed Books',
    value: 125,
    subtitle: 'Books Borrowed',
    icon: <Book className="w-6 h-6 text-primary" />,
    growth: 12,
    positive: true,
  },
  {
    title: 'Overdue Returns',
    value: 25,
    subtitle: 'Books Overdue',
    icon: <Clock className="w-6 h-6 text-primary" />,
    growth: 5,
    positive: false,
  },
  {
    title: 'Total Visitors',
    value: 540,
    subtitle: 'Visitors Today',
    icon: <Users className="w-6 h-6 text-primary" />,
    growth: 8,
    positive: true,
  },
  {
    title: 'Total Books',
    value: 1250,
    subtitle: 'Books in Library',
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    growth: 2,
    positive: true,
  },
]

export default function DashboardStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {dashboardStats.map((stat) => (
        <Card key={stat.title} className="p-4 rounded-sm">
          {/* Top row: Icon + Title */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              {stat.icon}
            </div>
            <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
          </div>

          {/* Bottom 2-col grid */}
          <div className="grid grid-cols-2 items-center">
            {/* Left column: Number + subtitle */}
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </div>

            {/* Right column: growth arrow */}
            <div className="flex justify-end">
              <div
                className={`flex items-center px-2 py-1 rounded-full ${
                  stat.positive ? 'bg-emerald-100' : 'bg-destructive/10'
                }`}
              >
                {stat.positive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-destructive mr-1" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.positive ? 'text-emerald-600' : 'text-destructive'
                  }`}
                >
                  {stat.growth}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
