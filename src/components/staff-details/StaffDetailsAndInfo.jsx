import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail } from 'lucide-react'
import { useStaffById } from '@/hooks/useStaff'
import { useParams } from 'react-router-dom'

export default function StaffDetailsAndInfoCard() {
  const { id } = useParams()
  const { data: staff, isLoading, isError } = useStaffById(id)

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load staff</p>
  if (!staff) return null

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '—')

  const valueOrDash = (value) =>
    value !== null && value !== undefined && value !== '' ? value : '—'

  return (
    <>
      {/* Profile Card */}
      <Card className="rounded-sm py-4">
        <CardContent className="px-3 py-0 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-5 min-w-0">
            <div className="shrink-0">
              <div className="rounded-md border-2 border-white p-1">
                <img
                  src={
                    staff.ProfilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      staff.FullName || 'Staff'
                    )}`
                  }
                  alt={staff.FullName}
                  className="size-20 rounded-sm object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <Badge className="bg-green-100 text-green-600 rounded-sm w-fit">
                Active
              </Badge>

              <h2 className="text-lg font-semibold truncate">
                {valueOrDash(staff.FullName)}
              </h2>

              <p className="text-[10px] opacity-80">S{staff.StaffID}</p>

              <p className="text-xs text-muted-foreground">
                Joined On:{' '}
                <span className="font-medium text-foreground">
                  {formatDate(staff.DateOfJoining)}
                </span>
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Basic Information</h3>

            <div className="space-y-3 text-sm">
              <InfoRow label="Staff ID" value={valueOrDash(staff.StaffID)} />
              <InfoRow label="Gender" value={valueOrDash(staff.Gender)} />
              <InfoRow label="Role" value={valueOrDash(staff.Role)} />
              <InfoRow label="Qualification" value={valueOrDash(staff.Qualification)} />
              <InfoRow
                label="Experience"
                value={
                  staff.ExperienceYears != null ? `${staff.ExperienceYears} Years` : '—'
                }
              />
              <InfoRow label="Date of Birth" value={formatDate(staff.DateOfBirth)} />
              <InfoRow label="Nationality" value={valueOrDash(staff.Nationality)} />
              <InfoRow label="Marital Status" value={valueOrDash(staff.MaritalStatus)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact Info */}
      <Card className="p-0 rounded-sm">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Primary Contact Info</h3>

          <ContactRow
            icon={<Phone className="size-4 text-blue-500" />}
            label="Phone Number"
            value={valueOrDash(staff.ContactNumber)}
          />

          <ContactRow
            icon={<Mail className="size-4 text-blue-500" />}
            label="Email Address"
            value={valueOrDash(staff.Email)}
          />
        </div>
      </Card>
    </>
  )
}

/* ---------- Helpers ---------- */

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-foreground">{label}</span>
      <span className="font-medium text-muted-foreground text-right">{value}</span>
    </div>
  )
}

function ContactRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 shrink-0 p-2">{icon}</div>

      <div className="flex flex-col">
        <span className="text-xs text-foreground">{label}</span>
        <span className="text-sm font-medium text-muted-foreground">{value}</span>
      </div>
    </div>
  )
}
