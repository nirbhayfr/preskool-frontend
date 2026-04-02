import { useState, useEffect } from 'react'
import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  IndianRupee,
  X,
  Bell,
} from 'lucide-react'
import SyllabusSlider from './SyllabusSlider'
import StudentMarksTable from './StudentMarksTableTD'
import UpcomingEvents from './UpcomingEventsTD'
import AttendanceTD from './AttendanceTD'
import { NoticesTD } from './NoticesTD'
const actions = [
  {
    label: 'Syllabus',
    key: 'syllabus',
    icon: BookOpen,
    color: 'text-blue-500 bg-blue-50',
  },
  {
    label: 'Marks',
    key: 'marks',
    icon: GraduationCap,
    color: 'text-indigo-500 bg-indigo-50',
  },
  {
    label: 'Events',
    key: 'events',
    icon: CalendarDays,
    color: 'text-pink-500 bg-pink-50',
  },
  {
    label: 'Attendance',
    key: 'attendance',
    icon: ClipboardList,
    color: 'text-green-500 bg-green-50',
  },
  {
    label: 'Salary',
    key: 'salary',
    icon: IndianRupee,
    color: 'text-yellow-600 bg-yellow-50',
  },
  {
    label: 'Notices',
    key: 'notices',
    icon: Bell,
    color: 'text-rose-600 bg-rose-50',
  },
]

export default function TeacherMobileActions() {
  const [active, setActive] = useState(null)

  // 🔥 same scroll lock as student dashboard
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : 'auto'
    return () => (document.body.style.overflow = 'auto')
  }, [active])

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        {actions.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.key}
              onClick={() => setActive(item.key)}
              className="
                cursor-pointer group
                flex flex-col items-center justify-center
                bg-white dark:bg-muted
                rounded-xl shadow-md border
                h-24
                transition-all active:scale-95
              "
            >
              <div
                className={`flex items-center justify-center rounded-full w-10 h-10 mb-1 ${item.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          {/* Modal Card */}
          <div
            className="
        bg-background
        rounded-3xl
        shadow-2xl
        w-full max-w-md
        h-[70vh]
        flex flex-col
        overflow-hidden
        border border-white/10
        animate-in fade-in zoom-in-95 duration-300
      "
          >
            {/* Header */}
            <div
              className="
          flex items-center justify-between
          px-5 py-4 border-b
          bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10
        "
            >
              <div>
                <h2 className="text-lg font-semibold capitalize">{active}</h2>
                <p className="text-xs text-muted-foreground">View details and manage</p>
              </div>

              <button
                onClick={() => setActive(null)}
                className="
            w-9 h-9 flex items-center justify-center
            rounded-xl hover:bg-muted transition
          "
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {active === 'syllabus' && <SyllabusSlider />}
              {active === 'marks' && <StudentMarksTable />}
              {active === 'events' && <UpcomingEvents />}
              {active === 'attendance' && <AttendanceTD />}
              {active === 'notices' && <NoticesTD />}

              {['salary'].includes(active) && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg">
                    🚀
                  </div>

                  <p className="text-sm font-medium">Coming soon</p>
                  <p className="text-xs text-muted-foreground text-center">
                    This feature will be available shortly
                  </p>
                </div>
              )}
            </div>

            {/* Footer (optional but premium feel) */}
            <div className="p-3 border-t flex justify-end">
              <button
                onClick={() => setActive(null)}
                className="
            px-4 py-2 text-sm rounded-lg
            bg-primary text-white
            hover:opacity-90 transition
          "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
