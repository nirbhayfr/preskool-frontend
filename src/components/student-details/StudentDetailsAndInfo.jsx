import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { Bus, Mail, MapPin, Phone, Route } from 'lucide-react'
import { useStudent } from '@/hooks/useStudents'

export default function StudentDetailsAndInfoCard() {
  const { id } = useParams()
  const { data: student, isLoading, isError } = useStudent(id)

  if (isLoading) return <StudentDetailsSkeleton />
  if (isError) return <p className="text-sm text-destructive">Failed to load student</p>
  if (!student) return null

  return (
    <>
      {/* Profile Card */}
      <Card className="rounded-sm py-4">
        <CardContent className="px-3 py-0 space-y-6">
          <div className="flex items-center gap-5">
            <div className="rounded-md border-2 border-white p-1">
              <img
                src={
                  student.PhotoUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    student.FullName || 'Student'
                  )}`
                }
                alt="Student"
                className="size-20 rounded-sm object-cover"
              />
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <Badge
                className={`rounded-sm w-fit ${
                  student.Status === 'Active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {student.Status || 'N/A'}
              </Badge>

              <p className="text-[10px] opacity-80">
                #{student.AdmissionNo || student.EnrollmentNumber}
              </p>

              <h2 className="text-lg font-semibold truncate">{student.FullName}</h2>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>

            <div className="space-y-3 text-sm">
              <InfoRow label="Roll No" value={student.RollNo} />
              <InfoRow label="Gender" value={student.Gender} />
              <InfoRow label="Date of Birth" value={formatDate(student.DOB)} />
              <InfoRow label="Class" value={student.ClassID} />
              <InfoRow label="Section" value={student.SectionID} />
              <InfoRow label="Nationality" value={student.Nationality} />
              <InfoRow label="Guardian Name" value={student.GuardianName} />
              <InfoRow label="Guardian Relation" value={student.GuardianRelation} />
            </div>
          </div>

          {/* <Button className="w-full">Add Fees</Button> */}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="rounded-sm">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold">Primary Contact Info</h3>

          <ContactRow
            icon={<Phone className="size-4 text-blue-500" />}
            label="Phone Number"
            value={student.ContactNumber}
          />

          <ContactRow
            icon={<Mail className="size-4 text-blue-500" />}
            label="Email Address"
            value={student.EmailAddress}
          />
        </div>
      </Card>

      {/* Address */}
      <Card className="rounded-sm">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold">Address</h3>

          <TransportRow
            icon={<MapPin className="size-4 text-blue-500" />}
            label="Address"
            value={student.Address}
          />

          <TransportRow
            icon={<Route className="size-4 text-blue-500" />}
            label="Guardian Address"
            value={student.GuardianAddress}
          />

          <TransportRow
            icon={<Bus className="size-4 text-blue-500" />}
            label="Guardian Contact"
            value={student.GuardianContact}
          />
        </div>
      </Card>
    </>
  )
}

/* ---------------- Skeleton ---------------- */

function StudentDetailsSkeleton() {
  return (
    <>
      <Card className="rounded-sm py-4">
        <CardContent className="px-3 space-y-6">
          <div className="flex gap-5 items-center">
            <Skeleton className="size-20 rounded-sm" />

            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />

            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>

          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>

      {[...Array(2)].map((_, i) => (
        <Card key={i} className="rounded-sm">
          <div className="p-4 space-y-4">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-3">
              <Skeleton className="size-4 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}

/* ---------------- Helpers ---------------- */

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="font-medium text-muted-foreground">{value || 'N/A'}</span>
    </div>
  )
}

function ContactRow({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      {icon}
      <div>
        <span className="text-xs">{label}</span>
        <p className="text-sm font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  )
}

function TransportRow({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      {icon}
      <div>
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className="text-sm font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  )
}
