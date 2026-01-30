import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail } from 'lucide-react'

export default function StaffDetailsAndInfoCard() {
  return (
    <>
      {/* Profile Card */}
      <Card className="rounded-sm py-4">
        <CardContent className="px-3 py-0 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-5">
            <div className="shrink-0">
              <div className="rounded-md border-2 border-white p-1">
                <img
                  src="/img/profile/avatar-03.jpg"
                  alt="Staff Profile"
                  className="size-20 rounded-sm object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <Badge className="bg-green-100 text-green-600 rounded-sm w-fit">
                Active
              </Badge>

              <h2 className="text-lg font-semibold truncate">Kevin Larry</h2>

              <p className="text-[10px] opacity-80">#AD1256589</p>

              <p className="text-xs text-muted-foreground">
                Joined On :{' '}
                <span className="font-medium text-foreground">10 Mar 2024</span>
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Basic Information</h3>

            <div className="space-y-3 text-sm">
              <InfoRow label="Staff ID" value="35013" />
              <InfoRow label="Gender" value="Male" />
              <InfoRow label="Designation" value="Technical Lead" />
              <InfoRow label="Department" value="Admin" />
              <InfoRow label="Date Of Birth" value="15 Aug 1987" />
              <InfoRow label="Blood Group" value="O+" />
              <InfoRow label="Mother Tongue" value="English" />
              <InfoRow label="Language" value="English, Spanish" />
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
            value="+1 46548 84498"
          />

          <ContactRow
            icon={<Mail className="size-4 text-blue-500" />}
            label="Email Address"
            value="jan@example.com"
          />
        </div>
      </Card>
    </>
  )
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
