import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Schedules } from './Schedules'
import { Notices } from './Notices'
import AddNewCard from './AddNewCard'
import DashboardChartsSection from './DashboardCharts'
import DashboardChartsTwoSection from './DashboardChartsTwo'
import AttendanceSummaryCards from './AttendanceSummaryCards'

export default function DashboardMain() {
  return (
    <>
      <AttendanceSummaryCards />
      <DashboardChartsSection />
      <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-3 mt-6">
        <Schedules />
        <Notices />
        <AddNewCard />
      </div>
      <DashboardChartsTwoSection />
    </>
  )
}
