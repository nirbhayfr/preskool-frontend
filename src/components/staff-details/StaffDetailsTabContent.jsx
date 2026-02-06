import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useStaffById } from '@/hooks/useStaff'
import { useParams } from 'react-router-dom'
import { Skeleton } from '../ui/skeleton'

function StaffDetailsTabContent() {
  const { id } = useParams()
  const { data: staff, isLoading, isError } = useStaffById(id)

  if (isLoading) return <StaffDetailsTabSkeleton />
  if (isError) return <p>Failed to load staff</p>
  if (!staff) return null

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '—')

  const valueOrDash = (value) =>
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
              <Info label="Full Name" value={valueOrDash(staff.FullName)} />
              <Info label="Gender" value={valueOrDash(staff.Gender)} />
              <Info label="DOB" value={formatDate(staff.DateOfBirth)} />
              <Info label="Marital Status" value={valueOrDash(staff.MaritalStatus)} />
              <Info label="Qualification" value={valueOrDash(staff.Qualification)} />
              <Info
                label="Experience"
                value={
                  staff.ExperienceYears != null ? `${staff.ExperienceYears} Years` : '—'
                }
              />
              <Info label="Role" value={valueOrDash(staff.Role)} />
              <Info label="Nationality" value={valueOrDash(staff.Nationality)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address + Salary Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Address</CardTitle>
          </CardHeader>

          <CardContent className="pt-0 space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Current Address</p>
              <p className="mt-1">
                {valueOrDash(staff.Address)}, {valueOrDash(staff.City)},{' '}
                {valueOrDash(staff.State)} – {valueOrDash(staff.PostalCode)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Permanent Address</p>
              <p className="mt-1">
                {valueOrDash(staff.Address)}, {valueOrDash(staff.City)},{' '}
                {valueOrDash(staff.State)} – {valueOrDash(staff.PostalCode)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Work / Salary Details */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Work Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="rounded-md border p-4">
              <div className="space-y-4 text-sm">
                <Info label="Staff ID" value={valueOrDash(staff.StaffID)} />
                <Info label="Role" value={valueOrDash(staff.Role)} />
                <Info label="Date of Joining" value={formatDate(staff.DateOfJoining)} />
                <Info
                  label="Salary"
                  value={
                    staff.Salary != null ? `₹ ${staff.Salary.toLocaleString()}` : '—'
                  }
                />
              </div>
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
                staff.EmergencyContactName || staff.EmergencyContactNumber
                  ? `${valueOrDash(staff.EmergencyContactName)} (${valueOrDash(
                      staff.EmergencyContactNumber
                    )})`
                  : '—'
              }
            />
            <Info label="Vehicle Number" value={valueOrDash(staff.VehicleNumber)} />
            <Info label="Transport Number" value={valueOrDash(staff.TransportNumber)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StaffDetailsTabContent

/* ---------- Helper ---------- */

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  )
}
function StaffDetailsTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Parents Information */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="size-14 rounded-sm" />

              <div className="flex w-full justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>

                <div className="space-y-2 text-right">
                  <Skeleton className="h-3 w-28 ml-auto" />
                  <Skeleton className="h-3 w-36 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Address + Previous School */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="rounded-sm">
            <CardHeader>
              <Skeleton className="h-4 w-40" />
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Other Info */}
      <Card className="rounded-sm">
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
