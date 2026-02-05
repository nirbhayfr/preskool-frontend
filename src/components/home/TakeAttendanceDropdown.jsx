import { ClipboardCheck, User, GraduationCap, School } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ActionItem } from '../layout/AddNew'

export function TakeAttendanceDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <ClipboardCheck className="h-4 w-4" />
          Take Attendance
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56 p-3">
        <p className="mb-3 text-sm font-medium">Take attendance for</p>

        <div className="grid grid-cols-2 gap-2">
          <ActionItem
            icon={User}
            label="Student"
            color="blue"
            path="/take-student-attendance"
          />
          <ActionItem
            icon={GraduationCap}
            label="Teacher"
            color="purple"
            path="/take-teacher-attendance"
          />
          <ActionItem
            icon={School}
            label="Staff"
            color="orange"
            path="/take-staff-attendance"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
