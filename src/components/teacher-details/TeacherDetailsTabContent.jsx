import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTeacher } from '@/hooks/useTeacher'
import { useNavigate, useParams } from 'react-router-dom'
import { Skeleton } from '../ui/skeleton'
import { decryptData } from '@/utils/crypto'
import {  useEffect } from 'react'
import { toast } from 'sonner'

function TeacherDetailsTabContent() {
  const { id } = useParams()
  const navigate = useNavigate();
  const encryptedUser = localStorage.getItem("user");
    const user = encryptedUser ? decryptData(encryptedUser) : null;

    useEffect(() => {
        if (user?.LinkedID !== Number(id) && user?.Role !== "Admin") {
            toast.error("You are not authorized to view this teacher's details.");
            // Optionally, navigate to a different page
            navigate(-1)
        }})

  const { data: teacher, isLoading, isError } = useTeacher(id)

  if (isLoading) return <TeacherDetailsTabSkeleton />
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

function TeacherDetailsTabSkeleton() {
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
