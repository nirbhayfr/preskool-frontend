import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Megaphone,
  BookOpen,
  FileText,
  Bus,
  GraduationCap,
  Clock,
} from 'lucide-react'

const actions = [
  {
    label: 'Attendance',
    icon: ClipboardList,
    key: 'attendance',
    color: 'text-blue-500 bg-blue-50',
  },
  { label: 'Fees', icon: CreditCard, key: 'fees', color: 'text-green-500 bg-green-50' },
  {
    label: 'Notice',
    icon: Megaphone,
    key: 'notice',
    color: 'text-purple-500 bg-purple-50',
  },
  {
    label: 'Marks',
    icon: GraduationCap,
    key: 'marks',
    color: 'text-indigo-500 bg-indigo-50',
  },
  {
    label: 'Events',
    icon: CalendarDays,
    key: 'events',
    color: 'text-pink-500 bg-pink-50',
  },
  { label: 'Leave', icon: FileText, key: 'leave', color: 'text-orange-500 bg-orange-50' },
  {
    label: 'Transport',
    icon: Bus,
    key: 'transport',
    color: 'text-yellow-600 bg-yellow-50',
  },
  { label: 'LMS', icon: BookOpen, key: 'lms', color: 'text-teal-500 bg-teal-50' },
  {
    label: 'Time Table',
    icon: Clock,
    key: 'timetable',
    color: 'text-cyan-500 bg-cyan-50',
  },
]

export function StudentActions({ openModal }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
      {actions.map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.label}
            onClick={() => openModal(item.key)}
            className="
              cursor-pointer
              group
              flex flex-col items-center justify-center
              bg-white dark:bg-muted
              rounded-xl
              shadow-md
              border
              h-24
              transition-all
              active:scale-95
            "
          >
            <div
              className={`
                flex items-center justify-center
                rounded-full
                w-10 h-10
                mb-1
                ${item.color}
              `}
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
  )
}
