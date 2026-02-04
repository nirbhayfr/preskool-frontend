import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Phone, Home } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useTeacher } from '@/hooks/useTeacher'

export default function TeacherDetailsAndInfoCard() {
  const { id } = useParams()
  const { data: teacher, isLoading, isError } = useTeacher(id)

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load teacher</p>
  if (!teacher) return null

  return (
    <>
      {/* Profile + Basic Info */}
      <Card className="rounded-sm py-4">
        <CardContent className="px-3 py-0 space-y-6 my-0">
          {/* Profile Section */}
          <div className="relative z-10 flex items-center gap-5 min-w-0">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="rounded-md border-2 border-white p-1">
                <img
                  src={
                    teacher.ProfilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      teacher.FullName || 'Teacher'
                    )}`
                  }
                  alt={teacher.FullName}
                  className="size-20 rounded-sm object-cover"
                />
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-3">
              <div className="min-w-0">
                <Badge className="bg-green-100 text-green-600 rounded-sm mb-2">
                  Active
                </Badge>

                <p className="text-[10px] opacity-80">T{teacher.TeacherID}</p>

                <h2 className="text-lg font-semibold truncate">{teacher.FullName}</h2>

                <p className="text-xs text-muted-foreground">
                  Joined : {new Date(teacher.DateOfJoining).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Basic Information</h3>

            <div className="space-y-4 text-sm">
              <InfoRow
                label="Class & Section"
                value={
                  teacher.Class && teacher.Section
                    ? `${teacher.Class}, ${teacher.Section}`
                    : '—'
                }
              />
              <InfoRow label="Subject" value={teacher.Subject} />
              <InfoRow label="Gender" value={teacher.Gender} />
              <InfoRow label="Blood Group" value={teacher.BloodGroup} />
              <InfoRow label="Qualification" value={teacher.Qualification} />
              <InfoRow
                label="Experience"
                value={
                  teacher?.ExperienceYears
                    ? `${teacher.ExperienceYears} ${teacher.ExperienceYears === 1 ? 'Year' : 'Years'}`
                    : '—'
                }
              />

              <InfoRow label="Nationality" value={teacher.Nationality} />
              <InfoRow label="Marital Status" value={teacher.MaritalStatus} />
            </div>
          </div>

          <Button className="w-full">Edit Details</Button>
        </CardContent>
      </Card>

      {/* Primary Contact Info */}
      <Card className="p-0 rounded-sm">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Primary Contact Info</h3>

          <ContactRow
            icon={<Phone className="size-4 text-blue-500" />}
            label="Phone Number"
            value={teacher.ContactNumber}
          />

          <ContactRow
            icon={<Mail className="size-4 text-blue-500" />}
            label="Email Address"
            value={teacher.Email}
          />

          <ContactRow
            icon={<MapPin className="size-4 text-blue-500" />}
            label="Emergency Contact"
            value={`${teacher.EmergencyContactName} (${teacher.EmergencyContactNumber})`}
          />
        </div>
      </Card>

      {/* Address / Transportation */}
      <Card className="p-0 rounded-sm">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Address & Transport</h3>

          <TransportRow
            icon={<Home className="size-4 text-blue-500" />}
            label="Address"
            value={`${teacher.Address}, ${teacher.City}, ${teacher.State} - ${teacher.PostalCode}`}
          />

          <TransportRow
            icon={<Home className="size-4 text-blue-500" />}
            label="Vehicle Number"
            value={teacher.VehicleNumber || '—'}
          />

          <TransportRow
            icon={<Home className="size-4 text-blue-500" />}
            label="Transport Number"
            value={teacher.TransportNumber || '—'}
          />
        </div>
      </Card>
    </>
  )
}

/* ---------- Helper Components ---------- */

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

function TransportRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 shrink-0">{icon}</div>

      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  )
}
