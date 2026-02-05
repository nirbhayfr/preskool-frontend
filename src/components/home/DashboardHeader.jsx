import { Plus, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { TakeAttendanceDropdown } from './TakeAttendanceDropdown'
import { useMemo } from 'react'
import { decryptData } from '@/utils/crypto'

export default function DashboardHeader() {
  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])
  return (
    <div className="relative overflow-hidden rounded-xs bg-[#202C4B] px-6 py-6">
      {/* Decorative Shapes */}
      <img
        src="/img/bg/blue-polygon.png"
        className="absolute bottom-4 left-10 w-12 opacity-60"
      />
      <img
        src="/img/bg/circle-shape.png"
        className="absolute top-0 left-24 w-16 opacity-20"
      />
      <img
        src="/img/bg/shape-01.png"
        className="absolute top-10 right-40 w-10 opacity-55"
      />
      <img
        src="/img/bg/shape-02.png"
        className="absolute top-0 right-42 w-14 opacity-100"
      />
      <img
        src="/img/bg/shape-03.png"
        className="absolute bottom-0 left-1/2 w-20 -translate-x-1/2 opacity-100"
      />
      <img
        src="/img/bg/shape-04.png"
        className="absolute bottom-2 right-1/3 w-6 opacity-40"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Welcome Text */}
        <div className="text-white">
          <p className="text-sm opacity-90">Welcome Back, Mr. / Mrs.</p>
          <h1 className="text-2xl font-semibold capitalize">{user?.Username}</h1>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/add-student">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>

          <TakeAttendanceDropdown />
        </div>
      </div>
    </div>
  )
}
