import { Plus, User, GraduationCap, School } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function AddNew() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 p-3">
          <p className="mb-3 text-sm font-medium">Add new</p>

          <div className="grid grid-cols-2 gap-2">
            <ActionItem icon={User} label="Student" color="blue" path="/add-student" />
            <ActionItem
              icon={GraduationCap}
              label="Teacher"
              color="purple"
              path="/add-teacher"
            />
            <ActionItem icon={School} label="Staff" color="orange" path="/add-staff" />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default AddNew

export function ActionItem({ icon, label, color, path }) {
  const COLOR_MAP = {
    blue: 'bg-blue-600 text-blue-100',
    green: 'bg-green-600 text-green-100',
    purple: 'bg-purple-600 text-purple-100',
    orange: 'bg-orange-600 text-orange-100',
  }

  const Icon = icon

  return (
    <Link
      type="button"
      to={path}
      className={cn(
        'group perspective:[900px] flex h-20 flex-col items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors dark:text-secondary',
        color === 'blue' && 'bg-blue-50 hover:bg-blue-100',
        color === 'green' && 'bg-green-50 hover:bg-green-100',
        color === 'purple' && 'bg-purple-50 hover:bg-purple-100',
        color === 'orange' && 'bg-orange-50 hover:bg-orange-100'
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full',
          'transform-gpu transition-transform duration-500 ease-out',
          'group-hover:transform-[rotateY(180deg)]',
          COLOR_MAP[color]
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      {label}
    </Link>
  )
}
