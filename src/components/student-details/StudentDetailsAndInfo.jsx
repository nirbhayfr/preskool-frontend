import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { Bus, Mail, MapPin, Phone, Route } from 'lucide-react'
import { useStudent } from '@/hooks/useStudents'

export default function StudentDetailsAndInfoCard() {
  const { id } = useParams()

  const { data: student, isLoading, isError } = useStudent(id)

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load student</p>
  if (!student) return null

  return (
    <>
      {/* Profile Card */}
      <Card className="rounded-sm py-4">
        <CardContent className="px-3 py-0 space-y-6 my-0">
          {/* Profile Section */}
          <div className="relative z-10 flex items-center gap-5 min-w-0">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="rounded-md border-2 border-white p-1">
                <img
                  src={
                    student.PhotoUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      student.FullName || 'Student'
                    )}`
                  }
                  alt="Student Profile"
                  className="size-20 rounded-sm object-cover"
                />
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-3">
              <div className="min-w-0">
                <Badge
                  className={`rounded-sm mb-2 ${
                    student.Status === 'Active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {student.Status || 'N/A'}
                </Badge>

                <p className="text-[10px] opacity-80">
                  #{student.AdmissionNo || student.EnrollmentNumber || student.StudentID}
                </p>

                <h2 className="text-lg font-semibold truncate">{student.FullName}</h2>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Basic Information</h3>

            <div className="space-y-4 text-sm">
              <InfoRow label="Roll No" value={student.RollNo || 'N/A'} />
              <InfoRow label="Gender" value={student.Gender || 'N/A'} />
              <InfoRow label="Date of Birth" value={formatDate(student.DOB)} />
              <InfoRow label="Class" value={student.ClassID || 'N/A'} />
              <InfoRow label="Section" value={student.SectionID || 'N/A'} />
              <InfoRow label="Nationality" value={student.Nationality || 'N/A'} />
              <InfoRow label="Guardian Name" value={student.GuardianName || 'N/A'} />
              <InfoRow
                label="Guardian Relation"
                value={student.GuardianRelation || 'N/A'}
              />
            </div>
          </div>

          <Button className="w-full">Add Fees</Button>
        </CardContent>
      </Card>

      {/* Primary Contact Info */}
      <Card className="p-0 rounded-sm">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Primary Contact Info</h3>

          <ContactRow
            icon={<Phone className="size-4 text-blue-500" />}
            label="Phone Number"
            value={student.ContactNumber || 'N/A'}
          />

          <ContactRow
            icon={<Mail className="size-4 text-blue-500" />}
            label="Email Address"
            value={student.EmailAddress || 'N/A'}
          />
        </div>
      </Card>

      {/* Address / Transportation */}
      <Card className="p-0 rounded-sm">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Address</h3>

          <div className="grid grid-cols-1 gap-4">
            <TransportRow
              icon={<MapPin className="size-4 text-blue-500" />}
              label="Address"
              value={student.Address || 'N/A'}
            />

            <TransportRow
              icon={<Route className="size-4 text-blue-500" />}
              label="Guardian Address"
              value={student.GuardianAddress || 'N/A'}
            />

            <TransportRow
              icon={<Bus className="size-4 text-blue-500" />}
              label="Guardian Contact"
              value={student.GuardianContact || 'N/A'}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

/* ------------------ Helpers ------------------ */

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

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
