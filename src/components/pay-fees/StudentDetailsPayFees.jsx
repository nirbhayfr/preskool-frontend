import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, User } from 'lucide-react'

export default function StudentDetailsPayFees({ student }) {
  return (
    <Card className="mb-6 rounded-sm">
      <CardContent className="p-5">
        <div className="grid gap-6 md:grid-cols-[auto_1fr_1fr] items-center">
          {/* Photo + Name */}
          <div className="flex items-center gap-4">
            <img
              src={
                student.PhotoUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  student.FullName || 'Student'
                )}`
              }
              alt="student"
              className="h-20 w-20 rounded-md object-cover border"
            />

            <div className="space-y-1 min-w-0">
              <Badge
                className={`rounded-sm ${
                  student.Status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {student.Status || 'N/A'}
              </Badge>

              <h2 className="text-lg font-semibold truncate">{student.FullName}</h2>

              <p className="text-xs text-muted-foreground">
                #{student.AdmissionNo || 'N/A'}
              </p>
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Info label="Roll No" value={student.RollNo} />
            <Info label="Class" value={`${student.ClassID} - ${student.SectionID}`} />
            <Info label="Program" value={student.Program} />
            <Info label="Gender" value={student.Gender} />
            <Info label="DOB" value={formatDate(student.DOB)} />
            <Info label="Nationality" value={student.Nationality} />
          </div>

          {/* Contact + Guardian */}
          <div className="space-y-3 text-sm">
            <Row
              icon={<Phone className="size-4 text-muted-foreground" />}
              label="Phone"
              value={student.ContactNumber}
            />

            <Row
              icon={<Mail className="size-4 text-muted-foreground" />}
              label="Email"
              value={student.EmailAddress}
            />

            <Row
              icon={<User className="size-4 text-muted-foreground" />}
              label="Guardian"
              value={`${student.GuardianName || 'N/A'} (${student.GuardianRelation || 'N/A'})`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value || 'N/A'}</span>
    </div>
  )
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
