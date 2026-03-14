import { useStudent } from '@/hooks/useStudents'
import { decryptData } from '@/utils/crypto'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import './StudentProfileCard.css'

function StudentProfileSkeleton() {
  return (
    <div className="spc-skeleton-card">
      <div className="spc-skeleton-inner">
        <div className="spc-skeleton-avatar shrink-0">
          <Skeleton className="size-20 rounded-sm bg-white/20" />
        </div>
        <div className="spc-skeleton-row">
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
    <div className="spc-card">
      <div className="spc-bg-aurora" aria-hidden="true" />

      <div className="spc-orb spc-orb-1" aria-hidden="true" />
      <div className="spc-orb spc-orb-2" aria-hidden="true" />
      <div className="spc-orb spc-orb-3" aria-hidden="true" />

      <div className="spc-particles" aria-hidden="true">
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
        <span className="spc-p" />
      </div>

      <div className="spc-grid" aria-hidden="true" />

      <div className="spc-border-glow" aria-hidden="true" />

      <img
        src="/img/bg/blue-polygon.png"
        className="spc-deco"
        style={{ bottom: '8px', left: '24px', width: '40px', opacity: 0.4 }}
        aria-hidden="true"
      />
      <img
        src="/img/bg/circle-shape.png"
        className="spc-deco"
        style={{ top: '0', left: '64px', width: '48px', opacity: 0.12 }}
        aria-hidden="true"
      />
      <img
        src="/img/bg/shape-01.png"
        className="spc-deco"
        style={{ top: '40px', right: '160px', width: '40px', opacity: 0.45 }}
        aria-hidden="true"
      />
      <img
        src="/img/bg/shape-02.png"
        className="spc-deco"
        style={{ top: '0', right: '0', width: '56px', opacity: 0.9 }}
        aria-hidden="true"
      />
      <img
        src="/img/bg/shape-03.png"
        className="spc-deco"
        style={{
          bottom: '0',
          left: '50%',
          width: '80px',
          transform: 'translateX(-50%)',
          opacity: 0.9,
        }}
        aria-hidden="true"
      />
      <img
        src="/img/bg/shape-04.png"
        className="spc-deco"
        style={{ bottom: '8px', right: '12px', width: '24px', opacity: 0.3 }}
        aria-hidden="true"
      />

      <div className="spc-inner">
        <div className="spc-avatar-ring">
          <div className="spc-avatar-border">
            <img
              src={student.PhotoUrl || '/img/students/student-01.jpg'}
              alt="Student Profile"
              className="spc-avatar-img"
            />
          </div>
        </div>

        <div className="spc-info">
          <div className="spc-name-block">
            <p className="spc-student-id">{student.StudentID}</p>
            <h2 className="spc-student-name">{student.FullName}</h2>
          </div>

          <div className="spc-meta-block">
            <p className="spc-meta-row">
              <span className="spc-meta-label">Class</span>
              <span className="spc-meta-value">{student.ClassID}</span>
            </p>
            <p className="spc-meta-row">
              <span className="spc-meta-label">Roll No</span>
              <span className="spc-meta-value">{student.RollNo}</span>
            </p>
          </div>

          <div className="spc-status-block">
            <span className="spc-exam-label">1st Quarterly</span>
            <span className="spc-badge spc-badge-pass">
              <span className="spc-badge-dot" />
              Pass
            </span>
          </div>

          <Link to={`/student-details/${student.StudentID}`} className="spc-btn">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StudentProfileCard
