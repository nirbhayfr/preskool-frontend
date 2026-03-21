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

const monthLabelMap = {
  jan: 'Jan',
  feb: 'Feb',
  mar: 'Mar',
  apr: 'Apr',
  may: 'May',
  jun: 'Jun',
  jul: 'Jul',
  aug: 'Aug',
  sep: 'Sep',
  oct: 'Oct',
  nov: 'Nov',
  dec: 'Dec',
}

const normalizeFeeKey = (key) => {
  if (!key) return ''

  const monthMap = {
    january: 'jan',
    february: 'feb',
    march: 'mar',
    april: 'apr',
    may: 'may',
    june: 'jun',
    july: 'jul',
    august: 'aug',
    september: 'sep',
    october: 'oct',
    november: 'nov',
    december: 'dec',
  }

  return key
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace('tution', 'tuition')
    .replace('_fee', '')
    .replace(
      /(january|february|march|april|june|july|august|september|october|november|december)/,
      (m) => monthMap[m]
    )
}

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth()

function isMonthPassed(monthAbbr) {
  const monthIndexMap = {
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
    jan: 0,
    feb: 1,
    mar: 2,
  }
  const idx = monthIndexMap[monthAbbr]
  if (idx === undefined) return false

  const academicStartYear = currentMonth >= 3 ? currentYear : currentYear - 1

  const calYear = idx >= 3 ? academicStartYear : academicStartYear + 1
  const monthDate = new Date(calYear, idx, 1)

  return monthDate < new Date(currentYear, currentMonth, 1)
}

export default function FeeStructureSection({
  structure,
  feesData,
  transportFee,
  transportHistory,
}) {
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

  /* ---------------- PAID FEES ---------------- */

  const paidFees = feesData?.data?.map((f) => normalizeFeeKey(f.FeeType)) || []

  /* ---------------- TUITION FEES ---------------- */

  const tuitionFees = Object.entries(structure)
    .filter(([key]) => key.includes('tuition_fee') || key.includes('tution_fee'))
    .sort(
      ([a], [b]) =>
        monthOrder.indexOf(a.split('_')[0].slice(0, 3)) -
        monthOrder.indexOf(b.split('_')[0].slice(0, 3))
    )

  const tuitionTotal = tuitionFees.reduce((sum, [, value]) => sum + Number(value), 0)

  /* ---------------- OTHER FEES ---------------- */

  const otherFees = Object.entries(structure).filter(
    ([key]) =>
      !key.includes('tuition_fee') &&
      !key.includes('tution_fee') &&
      !['structure_id', 'class', 'academic_year'].includes(key)
  )

  /* ---------------- TRANSPORT MONTHLY ---------------- */

  const transportMonths = monthOrder.map((month) => {
    const record = transportHistory?.months?.find((m) =>
      m.MonthName?.toLowerCase().startsWith(month)
    )

    const hasTransport = record?.TransportStatus === 'Yes'

    const feeKey = `transport_${month}`

    const isPaid = paidFees.includes(feeKey)

    return {
      month,
      amount: hasTransport ? transportFee : 0,
      isPaid,
    }
  })

  // console.log(paidFees)

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
              const rawMonth = key.split('_')[0]
              const month = monthLabelMap[rawMonth] || rawMonth.slice(0, 3)

              const feeKey = `${rawMonth}_tuition`

              const isPaid = paidFees.includes(feeKey)

              const isPassed = isMonthPassed(rawMonth)

              return (
                <div
                  key={key}
                  className={`border rounded-md p-3 text-center transition
      ${
        isPaid
          ? 'bg-green-100 border-green-400 dark:bg-green-950/20'
          : isPassed
            ? 'bg-red-50 border-red-300 dark:bg-red-950/20'
            : 'bg-muted/20'
      }`}
                >
                  <p className="text-xs uppercase text-muted-foreground">{month}</p>
                  <p
                    className={`font-semibold mt-1 ${isPaid ? 'text-green-700' : isPassed ? 'text-red-500' : ''}`}
                  >
                    ₹{Number(value).toLocaleString()}
                  </p>
                  {isPaid && <p className="text-[10px] text-green-600 mt-1">PAID</p>}
                  {!isPaid && isPassed && (
                    <p className="text-[10px] text-red-500 mt-1">PENDING</p>
                  )}
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

      {/* Transport Fee Card */}

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Transport Fee (Monthly)</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {transportMonths.map(({ month, amount, isPaid }) => {
              const label = monthLabelMap[month]

              const isPassed = isMonthPassed(month)

              return (
                <div
                  key={month}
                  className={`border rounded-md p-3 text-center transition
      ${
        isPaid
          ? 'bg-green-100 border-green-400 dark:bg-green-950/20'
          : isPassed && amount > 0
            ? 'bg-red-50 border-red-300 dark:bg-red-950/20'
            : 'bg-muted/20'
      }`}
                >
                  <p className="text-xs uppercase text-muted-foreground">{label}</p>
                  <p
                    className={`font-semibold mt-1 ${isPaid ? 'text-green-700' : isPassed && amount > 0 ? 'text-red-500' : ''}`}
                  >
                    ₹{Number(amount).toLocaleString()}
                  </p>
                  {isPaid && <p className="text-[10px] text-green-600 mt-1">PAID</p>}
                  {!isPaid && isPassed && amount > 0 && (
                    <p className="text-[10px] text-red-500 mt-1">PENDING</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Other Fees Card */}

      <Card className="rounded-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Other Fees</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {otherFees.map(([key, value]) => {
              const feeKey = key.replace('_fee', '')

              const isPaid = paidFees.some((f) => f.includes(feeKey))

              return (
                <div
                  key={key}
                  className={`border rounded-md p-3 transition
    ${
      isPaid
        ? 'bg-green-100 border-green-400 dark:bg-green-950/20'
        : 'bg-red-50 border-red-300 dark:bg-red-950/20'
    }`}
                >
                  <p className="text-xs text-muted-foreground">{formatLabel(key)}</p>
                  <p
                    className={`font-semibold mt-1 ${isPaid ? 'text-green-700' : 'text-red-500'}`}
                  >
                    ₹{Number(value).toLocaleString()}
                  </p>
                  {isPaid && <p className="text-[10px] text-green-600 mt-1">PAID</p>}
                  {!isPaid && <p className="text-[10px] text-red-500 mt-1">PENDING</p>}
                </div>
              )
            })}
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
