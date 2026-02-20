import LibraryCharts from '@/components/librarian-dashboard/LibrarianDashboardCharts'
import LibrarianDashboardStatsCards from '@/components/librarian-dashboard/LibrarianDashboardStatsCards'
import LibraryDashboardTable from '@/components/librarian-dashboard/LibraryDashboardTable'

export default function LibrarianDashboard() {
  return (
    <section className="p-6 space-y-6">
      <LibrarianDashboardStatsCards />
      <LibraryCharts />
      <LibraryDashboardTable />
    </section>
  )
}
