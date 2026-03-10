import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const monthOrder = [
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
  'jan',
  'feb',
  'mar',
]

export default function FeeStructureSection({ structure }) {
  if (!structure) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Fee Structure</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          Fee structure not available for this class.
        </CardContent>
      </Card>
    )
  }

  const tuitionFees = Object.entries(structure)
    .filter(([key]) => key.includes('tuition_fee'))
    .sort(
      ([a], [b]) =>
        monthOrder.indexOf(a.split('_')[0]) - monthOrder.indexOf(b.split('_')[0])
    )

  const otherFees = Object.entries(structure).filter(
    ([key]) =>
      !key.includes('tuition_fee') &&
      !['structure_id', 'class', 'academic_year'].includes(key)
  )

  const tuitionTotal = tuitionFees.reduce((sum, [, value]) => sum + Number(value), 0)

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Tuition Fee Card */}

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Tuition Fee (Monthly)</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {tuitionFees.map(([key, value]) => {
              const month = key.split('_')[0]

              return (
                <div key={key} className="border rounded-md p-3 text-center bg-muted/20">
                  <p className="text-xs uppercase text-muted-foreground">{month}</p>

                  <p className="font-semibold mt-1">₹{Number(value).toLocaleString()}</p>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end border-t pt-3">
            <p className="text-sm">
              Total Tuition:
              <span className="ml-2 font-semibold">₹{tuitionTotal.toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Other Fees Card */}

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Other Fees</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {otherFees.map(([key, value]) => (
              <div key={key} className="border rounded-md p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground">{formatLabel(key)}</p>

                <p className="font-semibold mt-1">₹{Number(value).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatLabel(key) {
  return key
    .replace('_fee', '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}
