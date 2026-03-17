import { useStudent } from '@/hooks/useStudents'
import { decryptData } from '@/utils/crypto'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

/* ---------- Skeleton ---------- */
function StudentProfileSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1a2744] dark:bg-[#1a2744] p-5 shadow-lg w-full animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-12 bg-white/20 rounded" />
          <Skeleton className="h-5 w-40 bg-white/20 rounded" />
          <Skeleton className="h-3 w-52 bg-white/20 rounded" />
        </div>
        <Skeleton className="h-14 w-14 rounded-full bg-white/20" />
      </div>
      <Skeleton className="h-px w-full bg-white/10 my-3" />
      <div className="grid grid-cols-5 gap-2 mt-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-3 w-10 bg-white/10 rounded" />
            <Skeleton className="h-4 w-12 bg-white/20 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Quick-link tile ---------- */
function QuickTile({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-1.5 rounded-xl
        bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20
        text-white py-3 px-2 transition-all duration-200 active:scale-95"
    >
      <span className="text-2xl leading-none">{icon}</span>
      <span className="text-[10px] font-medium tracking-wide opacity-90 text-center leading-tight">
        {label}
      </span>
    </Link>
  )
}

/* ---------- Info cell ---------- */
function InfoCell({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
        {label}
      </span>
      <span className="text-sm font-semibold text-white mt-0.5 truncate">
        {value || 'N/A'}
      </span>
    </div>
  )
}

/* ---------- Main Component ---------- */
function StudentProfileCard() {
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  const { data: student, isLoading, isError } = useStudent(user?.LinkedID)

  if (isLoading) return <StudentProfileSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
        Failed to load student profile
      </div>
    )
  }

  if (!student) return null

  return (
    <div
      className="
  w-full shadow-xl
  bg-[#1a2744]
  dark:bg-[#1a2744]
  text-white
  relative
  pb-12
[clip-path:path('M0,0 H1440 V90 C1100,250 850,-40 600,130 C350,300 150,10 0,120 Z')]"
    >
      {/* ── Top section ── */}
      <div className="px-5 pt-5 pb-1">
        {/* Row: name + avatar */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-3 mt-3">
            <h2 className="text-lg font-bold leading-tight break-words">
              {student.FullName}
            </h2>

            <p className="text-xs text-white/60 mt-1 break-all">
              {student.ContactNumber || 'N/A'}
              {student.EmailAddress && <> &nbsp;|&nbsp; {student.EmailAddress}</>}
            </p>
          </div>

          {/* Avatar (UNCHANGED) */}
          <div className="shrink-0 rounded-full border-2 border-white/30 p-[3px]">
            <img
              src={student.PhotoUrl || '/img/students/student-01.jpg'}
              alt="Student Profile"
              className="h-14 w-14 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 my-4" />

        {/* Info Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <InfoCell label="Class" value={student.ClassID} />
          <InfoCell label="Division" value={student.SectionID} />
          <InfoCell label="Roll No." value={student.RollNo} />

          {/* Result */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
              1st Quarterly
            </span>

            <span className="inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400 w-fit mt-1">
              Pass
            </span>
          </div>
        </div>

        {/* View Details Button */}
        {/* View Details Button */}
        <div className="mt-5 mb-10">
          <Link
            to={`/student-details/${student.StudentID}`}
            className="
      inline-block
      rounded-md
      bg-blue-500 hover:bg-blue-600
      px-4 py-2
      text-sm font-medium
      text-white
      transition
    "
          >
            View Details
          </Link>
        </div>
      </div>

      {/* ── Uneven bottom shape ── */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 120" className="w-full h-12" preserveAspectRatio="none">
          <path
            d="M0,80 C360,120 1080,40 1440,80 L1440,120 L0,120 Z"
            className="fill-background"
          />
        </svg>
      </div> */}
    </div>
  )
}

export default StudentProfileCard
