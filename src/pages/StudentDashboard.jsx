import { EventsList } from '@/components/student-dashboard/EventsList'
import { FeesReminder } from '@/components/student-dashboard/FeesReminder'
import { LeaveStatus } from '@/components/student-dashboard/LeaveStatus'
import { NoticeBoard } from '@/components/student-dashboard/NoticeBoard'
import { StatisticsCard } from '@/components/student-dashboard/StatisticsCard'
import { StudentActions } from '@/components/student-dashboard/StudentActions'
import StudentProfileCard from '@/components/student-dashboard/StudentProfileCard'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

function StudentDashboard() {
  const [activeModal, setActiveModal] = useState(null)
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [activeModal])
  return (
    <section>
      <div>
        {/* <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1> */}
      </div>
      <div className="mt-1 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StudentProfileCard />
        </div>
        <div className="px-4 -mt-20 relative z-10">
          <StudentActions openModal={setActiveModal} />{' '}
        </div>
        {/* <FeesReminder /> */}
        <div className="lg:col-span-2">
          <StatisticsCard />
        </div>

        {/* <EventsList /> */}
        {/* <LeaveStatus /> */}
        {/* <NoticeBoard /> */}
      </div>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            className="
      bg-background
      rounded-2xl
      shadow-2xl
      w-full
      max-w-md
      h-[65vh]
      flex flex-col
      overflow-hidden
      border border-white/10
      animate-in fade-in zoom-in-95 duration-300
      "
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b
      bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
            >
              <h2 className="text-lg font-semibold capitalize">{activeModal}</h2>

              <button
                onClick={() => setActiveModal(null)}
                className="
          w-8 h-8
          flex items-center justify-center
          rounded-lg
          hover:bg-muted
          transition
          "
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeModal === 'events' && <EventsList />}

              {activeModal === 'fees' && <FeesReminder />}

              {activeModal === 'notice' && <NoticeBoard />}

              {activeModal === 'leave' && <LeaveStatus />}

              {['attendance', 'marks', 'transport', 'lms', 'timetable'].includes(
                activeModal
              ) && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    🚀
                  </div>

                  <p className="text-sm">Feature coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudentDashboard
