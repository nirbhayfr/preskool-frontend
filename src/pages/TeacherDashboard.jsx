import { BestPerformersCard } from '@/components/teacher-dashboard/BestPerformers'
import { ClassSlider } from '@/components/teacher-dashboard/ClassSlider'
import { StudentMarksTable } from '@/components/teacher-dashboard/StudentMarksTableTD'
import SyllabusCard from '@/components/teacher-dashboard/SyllabusCard'
import SyllabusSlider from '@/components/teacher-dashboard/SyllabusSlider'
import TeacherProfilecard from '@/components/teacher-dashboard/TeacherProfilecard'
import { UpcomingEvents } from '@/components/teacher-dashboard/UpcomingEventsTD'
import TeacherMobileActions from '@/components/teacher-dashboard/TeacherMobileActions'
function TeacherDashboard() {
  return (
    <section className="p-6 space-y-6">
      {/* ✅ ALWAYS visible (mobile + desktop) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[4fr_2fr_4fr]">
        <TeacherProfilecard />
        <SyllabusCard />
        <ClassSlider />
      </div>

      {/* ✅ Desktop only */}
      <div className="hidden lg:block space-y-6">
        <div className="md:col-span-2">
          <SyllabusSlider />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
          <StudentMarksTable />
          <UpcomingEvents />
        </div>
      </div>

      {/* ✅ Mobile only */}
      <div className="lg:hidden">
        <TeacherMobileActions />
      </div>
    </section>
  )
}

export default TeacherDashboard
