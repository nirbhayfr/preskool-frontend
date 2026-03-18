import ClassSlider from '@/components/teacher-dashboard/ClassSlider'
import { StudentMarksTable } from '@/components/teacher-dashboard/StudentMarksTableTD'
import SyllabusCard from '@/components/teacher-dashboard/SyllabusCard'
import SyllabusSlider from '@/components/teacher-dashboard/SyllabusSlider'
import TeacherProfilecard from '@/components/teacher-dashboard/TeacherProfilecard'
import { UpcomingEvents } from '@/components/teacher-dashboard/UpcomingEventsTD'
import TeacherMobileActions from '@/components/teacher-dashboard/TeacherMobileActions'
import { useTeacher } from '@/hooks/useTeacher'
import { decryptData } from '@/utils/crypto'
import { useMemo } from 'react'

function TeacherDashboard() {
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  const linkedId = user?.LinkedID ?? null
  const { data: teacher, isLoading } = useTeacher(linkedId, !!linkedId)

  // ✅ Memoize so ClassSlider never gets a new reference on re-render

  return (
    <section className="p-6 space-y-6">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[4fr_2fr_4fr]">
        <TeacherProfilecard />
        <SyllabusCard />
        {teacher && teacher.TeacherID && <ClassSlider teacherId={teacher.TeacherID} />}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block space-y-6">
        <div className="md:col-span-2">
          <SyllabusSlider />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
          <StudentMarksTable />
          <UpcomingEvents />
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <TeacherMobileActions />
      </div>
    </section>
  )
}

export default TeacherDashboard
