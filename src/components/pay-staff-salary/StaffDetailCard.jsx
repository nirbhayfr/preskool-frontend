// components/staff-salary/StaffDetailCard.jsx

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Briefcase, Calendar, IndianRupee, GraduationCap } from 'lucide-react'
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

function StaffDetailCard({ staff }) {
  const initials = staff.FullName?.split(' ')
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
              src={staff.ProfilePhoto || staff.ProfilePictureUrl}
              alt={staff.FullName}
            />
            <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="pb-1 space-y-1">
            <h2 className="text-xl font-semibold leading-none">{staff.FullName}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{staff.Role}</Badge>
              {staff.City && <Badge variant="outline">{staff.City}</Badge>}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <InfoRow icon={User} label="Staff ID" value={`STF-${staff.StaffID}`} />
          <InfoRow
            icon={GraduationCap}
            label="Qualification"
            value={staff.Qualification}
          />
          <InfoRow
            icon={Briefcase}
            label="Experience"
            value={staff.ExperienceYears ? `${staff.ExperienceYears} years` : null}
          />
          <InfoRow
            icon={Calendar}
            label="Date of Joining"
            value={
              staff.DateOfJoining
                ? format(new Date(staff.DateOfJoining), 'dd MMM yyyy')
                : null
            }
          />
          <InfoRow
            icon={IndianRupee}
            label="Base Salary"
            value={staff.Salary ? `₹${staff.Salary.toLocaleString('en-IN')}` : null}
          />
        </div>
      </div>
    </div>
  )
}

export default StaffDetailCard
