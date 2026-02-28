import { useTeacher } from '@/hooks/useTeacher'
import { decryptData } from '@/utils/crypto'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '../ui/skeleton'

function TeacherProfilecard() {
  const navigate = useNavigate()
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  const { data: teacher, isLoading, isError } = useTeacher(user?.LinkedID)
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-sm bg-[#202C4B] p-4 flex items-center">
        <div className="relative z-10 flex w-full items-center gap-5">
          {/* Profile Image Skeleton */}
          <div className="shrink-0">
            <div className="rounded-md border-2 border-white p-1">
              <Skeleton className="size-20 rounded-sm bg-white/20" />
            </div>
          </div>

          {/* Text Skeleton */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20 bg-white/20" />
            <Skeleton className="h-5 w-40 bg-white/20" />
            <Skeleton className="h-4 w-32 bg-white/20" />
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-9 w-24 rounded-md bg-white/20" />
        </div>
      </div>
    )
  }
  if (isError) return <p>Failed to load teacher</p>
  if (!teacher) return null

  console.log('teacher', teacher)
  return (
    <div className="relative overflow-hidden rounded-sm bg-[#202C4B] p-4 flex items-center">
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

      <div className="relative z-10 flex w-full items-center gap-5">
        <div className="shrink-0">
          <div className="rounded-md border-2 border-white p-1">
            <img
              src={teacher?.ProfilePictureUrl || '/img/default-profile.png'}
              alt="Profile"
              className="size-20 rounded-sm object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-white">
          <p className="text-xs opacity-80">{teacher?.TeacherID}</p>

          <h2 className="text-lg font-semibold leading-snug">{teacher?.FullName}</h2>

          <p className="mt-1 text-sm text-blue-200">
            Classes :{' '}
            <span className="font-medium">
              {teacher?.Class}-{teacher?.Section}
            </span>
          </p>

          {/* <p className="text-sm text-blue-200">
            Subject : <span className="font-medium">{teacher?.Subject}</span>
          </p> */}
        </div>

        <button
          onClick={() => navigate(`/teacher-details/${teacher?.TeacherID}`)}
          className="inline-flex items-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 transition"
        >
          View Profile
        </button>
      </div>
    </div>
  )
}

export default TeacherProfilecard
