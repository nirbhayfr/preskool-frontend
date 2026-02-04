import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTeacher } from '@/hooks/useTeacher'
import { useParams } from 'react-router-dom'

function TeacherDetailsTabContent() {
  const { id } = useParams()
  const { data: teacher, isLoading, isError } = useTeacher(id)

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load teacher</p>
  if (!teacher) return null

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '—')

  const formatValue = (value) =>
    value !== null && value !== undefined && value !== '' ? value : '—'

  return (
    <div className="space-y-6">
      {/* Profile Details */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="font-semibold text-lg">Profile Details</CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 text-sm">
              <Info label="Full Name" value={formatValue(teacher.FullName)} />
              <Info label="Gender" value={formatValue(teacher.Gender)} />
              <Info label="DOB" value={formatDate(teacher.DateOfBirth)} />
              <Info label="Marital Status" value={formatValue(teacher.MaritalStatus)} />
              <Info label="Qualification" value={formatValue(teacher.Qualification)} />
              <Info
                label="Experience"
                value={
                  teacher.ExperienceYears != null
                    ? `${teacher.ExperienceYears} Years`
                    : '—'
                }
              />
              <Info label="Nationality" value={formatValue(teacher.Nationality)} />
              <Info label="Blood Group" value={formatValue(teacher.BloodGroup)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address + Work Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Address</CardTitle>
          </CardHeader>

          <CardContent className="pt-0 space-y-4 text-sm">
            <AddressBlock label="Current Address" address={teacher} />
            <AddressBlock label="Permanent Address" address={teacher} />
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Work Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="rounded-md border p-4 space-y-4 text-sm">
              <Info label="Teacher ID" value={formatValue(teacher.TeacherID)} />
              <Info label="Subject" value={formatValue(teacher.Subject)} />
              <Info
                label="Class & Section"
                value={
                  teacher.Class && teacher.Section
                    ? `${teacher.Class}, ${teacher.Section}`
                    : '—'
                }
              />
              <Info label="Date of Joining" value={formatDate(teacher.DateOfJoining)} />
              <Info
                label="Salary"
                value={
                  teacher.Salary != null ? `₹ ${teacher.Salary.toLocaleString()}` : '—'
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Info */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="font-semibold">Other Info</CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="rounded-md border p-4 space-y-3 text-sm">
            <Info
              label="Emergency Contact"
              value={
                teacher.EmergencyContactName && teacher.EmergencyContactNumber
                  ? `${teacher.EmergencyContactName} (${teacher.EmergencyContactNumber})`
                  : '—'
              }
            />
            <Info label="Vehicle Number" value={formatValue(teacher.VehicleNumber)} />
            <Info label="Transport Number" value={formatValue(teacher.TransportNumber)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherDetailsTabContent

/* ---------- Helpers ---------- */

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  )
}

function AddressBlock({ label, address }) {
  const parts = [address.Address, address.City, address.State, address.PostalCode].filter(
    Boolean
  )

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1">{parts.length ? parts.join(', ') : '—'}</p>
    </div>
  )
}
