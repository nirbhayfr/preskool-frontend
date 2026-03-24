import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// ─── Constants ────────────────────────────────────────────────────────────────

const monthOrder = [
  'mar',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatLabel(key) {
  return key
    .replace('_fee', '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
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

  // Academic year starts in March now (not April)
  const academicStartMonth = 2 // March = 2
  const academicStartYear =
    currentMonth >= academicStartMonth ? currentYear : currentYear - 1

  // Months Mar-Dec belong to academicStartYear, Jan-Feb belong to next year
  const calYear = idx >= academicStartMonth ? academicStartYear : academicStartYear + 1
  const monthDate = new Date(calYear, idx, 1)

  return monthDate <= new Date(currentYear, currentMonth, 1)
}

// ─── Cell status helpers ──────────────────────────────────────────────────────

function cellClass(isPaid, isPartial) {
  // if (isPaid)
  //   return 'bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-800'
  if (isPartial)
    return 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800'
  // if (isRed) return 'bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800'
  return ''
}

function amountClass(isPaid, isPartial, isRed) {
  if (isPaid) return 'text-green-700 dark:text-green-400'
  if (isPartial) return 'text-amber-600 dark:text-amber-400'
  if (isRed) return 'text-red-500 dark:text-red-400'
  return ''
}

function StatusLabel({ isPaid, isPartial, isPending }) {
  if (isPaid) return <p className="text-[10px] text-green-600 mt-1 font-medium">PAID</p>
  if (isPartial)
    return <p className="text-[10px] text-amber-600 mt-1 font-medium">PARTIAL</p>
  if (isPending)
    return <p className="text-[10px] text-red-500 mt-1 font-medium">PENDING</p>
  return null
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ── Paid & partial fee key sets ──────────────────────────────────────────
  const paidFees = (feesData?.data ?? [])
    .filter((f) => (f.PaymentStatus || '').toUpperCase() === 'SUCCESS')
    .map((f) => normalizeFeeKey(f.FeeType))

  const partialFees = (feesData?.data ?? [])
    .filter((f) => (f.PaymentStatus || '').toUpperCase() === 'PARTIAL')
    .map((f) => normalizeFeeKey(f.FeeType))

  // ── Tuition fees ─────────────────────────────────────────────────────────
  const tuitionFees = Object.entries(structure)
    .filter(([key]) => key.includes('tuition_fee') || key.includes('tution_fee'))
    .sort(
      ([a], [b]) =>
        monthOrder.indexOf(a.split('_')[0].slice(0, 3)) -
        monthOrder.indexOf(b.split('_')[0].slice(0, 3))
    )

  const tuitionTotal = tuitionFees.reduce((sum, [, value]) => sum + Number(value), 0)

  // ── Other fees ───────────────────────────────────────────────────────────
  const otherFees = Object.entries(structure).filter(
    ([key]) =>
      !key.includes('tuition_fee') &&
      !key.includes('tution_fee') &&
      !['structure_id', 'class', 'academic_year'].includes(key)
  )

  // ── Transport monthly ────────────────────────────────────────────────────
  const transportMonths = monthOrder.map((month) => {
    const record = transportHistory?.months?.find((m) =>
      m.MonthName?.toLowerCase().startsWith(month)
    )
    const hasTransport = record?.TransportStatus === 'Yes'
    const feeKey = `transport_${month}`
    const isPaid = paidFees.includes(feeKey)
    const isPartial = !isPaid && partialFees.includes(feeKey)

    return {
      month,
      amount: hasTransport ? transportFee : 0,
      isPaid,
      isPartial,
    }
  })

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* ── Tuition Fee Card ── */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Tuition Fee (Monthly)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {tuitionFees.map(([key, value]) => {
              const rawMonth = key.split('_')[0]
              const month = monthLabelMap[rawMonth] || rawMonth.slice(0, 3)
              const feeKey = `${rawMonth}_tuition`
              const isPaid = paidFees.includes(feeKey)
              const isPartial = !isPaid && partialFees.includes(feeKey)
              const isPassed = isMonthPassed(rawMonth)
              const isRed = !isPaid && !isPartial && isPassed

              return (
                <div
                  key={key}
                  className={`border rounded-md p-3 text-center transition ${cellClass(isPaid, isPartial, isRed)}`}
                >
                  <p className="text-xs uppercase text-muted-foreground">{month}</p>
                  <p
                    className={`font-semibold mt-1 text-sm ${amountClass(isPaid, isPartial, isRed)}`}
                  >
                    ₹{Number(value).toLocaleString()}
                  </p>
                  <StatusLabel isPaid={isPaid} isPartial={isPartial} isPending={isRed} />
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

      {/* ── Transport Fee Card ── */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Transport Fee (Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {transportMonths.map(({ month, amount, isPaid, isPartial }) => {
              const label = monthLabelMap[month]
              const isPassed = isMonthPassed(month)
              const isRed = !isPaid && !isPartial && isPassed && amount > 0

              return (
                <div
                  key={month}
                  className={`border rounded-md p-3 text-center transition ${cellClass(isPaid, isPartial, isRed)}`}
                >
                  <p className="text-xs uppercase text-muted-foreground">{label}</p>
                  <p
                    className={`font-semibold mt-1 text-sm ${amountClass(isPaid, isPartial, isRed)}`}
                  >
                    ₹{Number(amount).toLocaleString()}
                  </p>
                  <StatusLabel isPaid={isPaid} isPartial={isPartial} isPending={isRed} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Other Fees Card ── */}
      <Card className="rounded-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Other Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherFees.map(([key, value]) => {
              const feeKey = key.replace('_fee', '')
              const isPaid = paidFees.some((f) => f.includes(feeKey))
              const isPartial = !isPaid && partialFees.some((f) => f.includes(feeKey))
              const isRed = !isPaid && !isPartial

              return (
                <div
                  key={key}
                  className={`border rounded-md p-3 transition ${cellClass(isPaid, isPartial, isRed)}`}
                >
                  <p className="text-xs text-muted-foreground">{formatLabel(key)}</p>
                  <p
                    className={`font-semibold mt-1 text-sm ${amountClass(isPaid, isPartial, isRed)}`}
                  >
                    ₹{Number(value).toLocaleString()}
                  </p>
                  <StatusLabel isPaid={isPaid} isPartial={isPartial} isPending={isRed} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
