import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'

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

  const academicStartMonth = 2
  const academicStartYear =
    currentMonth >= academicStartMonth ? currentYear : currentYear - 1

  const calYear = idx >= academicStartMonth ? academicStartYear : academicStartYear + 1
  const monthDate = new Date(calYear, idx, 1)

  return monthDate <= new Date(currentYear, currentMonth, 1)
}

// ─── Cell status helpers ──────────────────────────────────────────────────────

function cellClass(isPaid, isPartial) {
  if (isPartial)
    return 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800'
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
  inventory = [],
  studentClass = '',
  academicYear = '',
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

    return { month, amount: hasTransport ? transportFee : 0, isPaid, isPartial }
  })

  // ── Inventory fees (filtered by class + academic year) ───────────────────
  const normalizedStudentClass = String(studentClass).trim().toLowerCase()

  const applicableInventory = inventory.filter((item) => {
    console.log(inventory)
    const itemClass = String(item.class ?? '')
      .trim()
      .toLowerCase()

    // empty class => visible to all
    const classMatch = !itemClass || itemClass === normalizedStudentClass

    // const yearMatch =
    //   !academicYear || !item.academic_year || item.academic_year === academicYear

    return classMatch
  })

  const inventoryTotal = applicableInventory.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  )

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
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Other Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

      {/* ── Inventory Fees Card ── */}
      <Card className="rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            Inventory Fees
          </CardTitle>
          {applicableInventory.length > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {applicableInventory.length} item{applicableInventory.length > 1 ? 's' : ''}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {applicableInventory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No inventory fees applicable for Class {studentClass}.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {applicableInventory.map((item) => {
                  const normalizedType = normalizeFeeKey(item.fee_type)
                  const isPaid = paidFees.some(
                    (f) =>
                      f.includes(normalizedType) ||
                      f.includes(`inventory_${normalizedType}`)
                  )
                  const isPartial =
                    !isPaid &&
                    partialFees.some(
                      (f) =>
                        f.includes(normalizedType) ||
                        f.includes(`inventory_${normalizedType}`)
                    )
                  const isRed = !isPaid && !isPartial

                  return (
                    <div
                      key={item.fee_id}
                      className={`border rounded-md p-3 transition ${cellClass(isPaid, isPartial, isRed)}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.fee_type}
                        </p>
                        {item.class ? (
                          <span className="text-[10px] font-medium bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded shrink-0">
                            Class {item.class}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                            All
                          </span>
                        )}
                      </div>
                      <p
                        className={`font-semibold mt-1 text-sm ${amountClass(isPaid, isPartial, isRed)}`}
                      >
                        ₹{Number(item.price).toLocaleString()}
                      </p>
                      {item.academic_year && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.academic_year}
                        </p>
                      )}
                      <StatusLabel
                        isPaid={isPaid}
                        isPartial={isPartial}
                        isPending={isRed}
                      />
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end border-t pt-3">
                <p className="text-sm">
                  Total Inventory:
                  <span className="ml-2 font-semibold">
                    ₹{inventoryTotal.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
