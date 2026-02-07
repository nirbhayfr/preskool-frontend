import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStudent } from '@/hooks/useStudents'
import { decryptData } from '@/utils/crypto'
import { Phone, Mail } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

function StudentDetailsTabContent() {
  const { id } = useParams()
  const navigate = useNavigate();
  const { data: student, isLoading, isError } = useStudent(id)
    const encryptedUser = localStorage.getItem("user");
      const user = encryptedUser ? decryptData(encryptedUser) : null;

     useEffect(() => {
        if (user?.Role !== "Teacher" && user?.LinkedID !== Number(id)) {
            toast.error("You are not authorized to view this student's details.");
            // Optionally, navigate to a different page
            navigate(-1)
        }})
 

  if (isLoading) return <StudentDetailsTabSkeleton />
  if (isError) return <p>Failed to load student</p>
  if (!student) return null

  return (
    <div className="space-y-6">
      {/* Parents Information */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="font-semibold text-lg">Parents Information</CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-6">
          {/* Father / Guardian */}
          <div className="flex items-start gap-4">
            <img
              src={
                student.FatherPhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  student.GuardianName || 'Father'
                )}`
              }
              alt="Father"
              className="size-14 rounded-sm object-cover"
            />

            <div className="flex w-full items-start justify-between">
              <div>
                <p className="text-sm font-medium">
                  <ValueOrNA value={student.GuardianName} />
                </p>
                <p className="text-xs text-muted-foreground">
                  <ValueOrNA value={student.GuardianRelation || 'Father'} />
                </p>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground text-right">
                <div className="flex items-center justify-end gap-2">
                  <Phone className="size-3.5" />
                  <ValueOrNA value={student.GuardianContact} />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Mail className="size-3.5" />
                  <ValueOrNA value={student.EmailAddress} />
                </div>
              </div>
            </div>
          </div>

          {/* Mother */}
          <div className="flex items-start gap-4">
            <img
              src={
                student.MotherPhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent('Mother')}`
              }
              alt="Mother"
              className="size-14 rounded-sm object-cover"
            />

            <div className="flex w-full items-start justify-between">
              <div>
                <p className="text-sm font-medium">
                  <ValueOrNA value={student.MotherName} />
                </p>
                <p className="text-xs text-muted-foreground">Mother</p>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground text-right">
                <div className="flex items-center justify-end gap-2">
                  <Phone className="size-3.5" />
                  <ValueOrNA value={student.MotherContact} />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Mail className="size-3.5" />
                  <ValueOrNA value={student.MotherEmail} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Address Card */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Address</CardTitle>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Current Address</p>
              <p className="mt-1 text-sm">
                <ValueOrNA value={student.Address} />
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Permanent Address</p>
              <p className="mt-1 text-sm">
                <ValueOrNA value={student.GuardianAddress} />
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Previous School Card */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Previous School Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Previous School Name</p>
              <p className="mt-1 text-sm">
                <ValueOrNA value={student.PreviousAcademicRecord} />
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">School Address</p>
              <p className="mt-1 text-sm">
                <ValueOrNA value={student.PreviousSchoolAddress} />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Info */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="font-semibold">Other Info</CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-2">
          <InfoLine label="Academic Status" value={student.AcademicStatus} />
          <InfoLine label="Attendance" value={student.AttendancePercentage} />
          <InfoLine label="GPA / Marks" value={student.GPAOrMarks} />
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDetailsTabContent

function ValueOrNA({ value }) {
  if (!value) {
    return (
      <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        Not Available
      </span>
    )
  }
  return <span className="font-medium text-foreground">{value}</span>
}

function InfoLine({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <ValueOrNA value={value} />
    </div>
  )
}

function StudentDetailsTabSkeleton() {
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
