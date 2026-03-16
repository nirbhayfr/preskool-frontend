// components/TeacherDetailCard.jsx

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, BookOpen, Calendar, Briefcase, IndianRupee } from 'lucide-react'
import { format } from 'date-fns'

function InfoRow({ icon, label, value }) {
  const Icon = icon
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  )
}

function TeacherDetailCard({ teacher }) {
  const initials = teacher.FullName?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="h-20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent" />

      <div className="px-6 pb-5 -mt-10 space-y-4">
        {/* Avatar + Name */}
        <div className="flex items-end gap-4">
          <Avatar className="size-20 border-4 border-background shadow-md">
            <AvatarImage
              src={teacher.ProfilePictureUrl || teacher.ProfilePhoto}
              alt={teacher.FullName}
            />
            <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="pb-1 space-y-1">
            <h2 className="text-xl font-semibold leading-none">{teacher.FullName}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{teacher.Subject}</Badge>
              {teacher.Class && (
                <Badge variant="outline">
                  Class {teacher.Class}
                  {teacher.Section ? ` - ${teacher.Section}` : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <InfoRow icon={User} label="Employee ID" value={`TCH-${teacher.TeacherID}`} />
          <InfoRow icon={BookOpen} label="Qualification" value={teacher.Qualification} />
          <InfoRow
            icon={Briefcase}
            label="Experience"
            value={teacher.ExperienceYears ? `${teacher.ExperienceYears} years` : null}
          />
          <InfoRow
            icon={Calendar}
            label="Date of Joining"
            value={
              teacher.DateOfJoining
                ? format(new Date(teacher.DateOfJoining), 'dd MMM yyyy')
                : null
            }
          />
          <InfoRow
            icon={IndianRupee}
            label="Base Salary"
            value={teacher.Salary ? `₹${teacher.Salary.toLocaleString('en-IN')}` : null}
          />
        </div>
      </div>
    </div>
  )
}

export default TeacherDetailCard
