import { useStudent } from '@/hooks/useStudents'
import { decryptData } from '@/utils/crypto'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

/* ---------- Skeleton ---------- */
function StudentProfileSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-sm bg-[#202C4B] p-4 flex items-center w-full min-w-0">
      <div className="relative z-10 flex w-full items-center gap-5 min-w-0">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="rounded-md border-2 border-white p-1">
            <Skeleton className="size-20 rounded-sm bg-white/20" />
          </div>
        </div>

        {/* Info */}
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 min-w-0">
            <Skeleton className="h-3 w-20 bg-white/20" />
            <Skeleton className="h-5 w-40 bg-white/20" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-24 bg-white/20" />
            <Skeleton className="h-3 w-24 bg-white/20" />
          </div>

          <Skeleton className="h-5 w-20 rounded-full bg-white/20" />

          <Skeleton className="h-8 w-28 rounded-md bg-white/20" />
        </div>
      </div>
    </div>
  )
}

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
      <div className="rounded-sm bg-red-500/10 p-4 text-sm text-red-500">
        Failed to load student profile
      </div>
    )
  }

  if (!student) return null

  return (
    <div className="relative overflow-hidden rounded-sm bg-[#202C4B] p-4 flex items-center w-full min-w-0">
      {/* Decorative shapes */}
      <img
        src="/img/bg/blue-polygon.png"
        className="absolute bottom-2 left-6 w-10 opacity-50"
      />
      <img
        src="/img/bg/circle-shape.png"
        className="absolute top-0 left-16 w-12 opacity-20"
      />
      <img
        src="/img/bg/shape-01.png"
        className="absolute top-10 right-40 w-10 opacity-55"
      />
      <img
        src="/img/bg/shape-02.png"
        className="absolute top-0 right-0 w-14 opacity-100"
      />
      <img
        src="/img/bg/shape-03.png"
        className="absolute bottom-0 left-1/2 w-20 -translate-x-1/2 opacity-100"
      />
      <img
        src="/img/bg/shape-04.png"
        className="absolute bottom-2 right-3 w-6 opacity-40"
      />

      <div className="relative z-10 flex w-full items-center gap-5 min-w-0">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="rounded-md border-2 border-white p-1">
            <img
              src={student.PhotoUrl || '/img/students/student-01.jpg'}
              alt="Student Profile"
              className="size-20 rounded-sm object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex w-full min-w-0 flex-col gap-3 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs opacity-80">{student.StudentID}</p>
            <h2 className="text-base sm:text-xl font-semibold truncate">
              {student.FullName}
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-blue-200">
              Class : <span className="font-medium">{student.ClassID}</span>
            </p>
            <p className="text-xs sm:text-sm text-blue-200">
              Roll No : <span className="font-medium">{student.RollNo}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs text-blue-200">1st Quarterly</span>
            <span className="inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
              Pass
            </span>
          </div>

          <Link
            to={`/student-details/${student.StudentID}`}
            className="shrink-0 rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StudentProfileCard
