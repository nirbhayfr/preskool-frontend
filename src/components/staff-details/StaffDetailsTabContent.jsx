import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function StaffDetailsTabContent() {
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
              <Info label="Father’s Name" value="Francis Saviour" />
              <Info label="Mother Name" value="Stella Bruce" />
              <Info label="DOB" value="25 Jan 1992" />
              <Info label="Marital Status" value="Single" />
              <Info label="Qualification" value="MBA" />
              <Info label="Experience" value="2 Years" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address + Bank Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Address</CardTitle>
          </CardHeader>

          <CardContent className="pt-0 space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Current Address</p>
              <p className="mt-1">3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Permanent Address</p>
              <p className="mt-1">3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="font-semibold">Bank Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="rounded-md border p-4">
              <div className="space-y-4 text-sm">
                <Info label="Account Name" value="Bank of America" />
                <Info label="Account Number" value="178849035684" />
                <Info label="Bank Name" value="Bank of America" />
                <Info label="Branch" value="Cincinnati" />
                <Info label="IFSC" value="BOA83209832" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Info - Full Width */}
      <Card className="rounded-sm md:col-span-2">
        <CardHeader>
          <CardTitle className="font-semibold">Other Info</CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="rounded-md border p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Depending on the specific needs of your organization or system, additional
              information may be collected or tracked. It's important to ensure that any
              data collected complies with privacy regulations and policies to protect
              staff members' sensitive information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StaffDetailsTabContent

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  )
}
