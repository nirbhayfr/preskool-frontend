import { useMemo, useState } from 'react'
import { useOwnerTransportReport } from '@/hooks/useTransportHistory'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bus,
  Search,
  Filter,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Download,
  RefreshCw,
  Route,
  Car,
  Wallet,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Layers3,
  MapPin,
  ShieldCheck,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function n(value) {
  const num = Number(value)
  return Number.isNaN(num) ? 0 : num
}

function fmt(value) {
  return n(value).toLocaleString('en-IN')
}

function money(value) {
  return `₹${fmt(value)}`
}

function clampPct(a, b) {
  if (!b || n(b) <= 0) return 0
  const p = Math.round((n(a) / n(b)) * 100)
  if (p < 0) return 0
  if (p > 100) return 100
  return p
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function downloadCsv(filename, rows) {
  if (!rows?.length) return

  const headers = Object.keys(rows[0])

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const cell = row[header] ?? ''
          const escaped = String(cell).replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function getPendingStatus(pendingAmount) {
  const pending = n(pendingAmount)

  if (pending < 0) return 'excess'
  if (pending === 0) return 'cleared'
  return 'pending'
}

function getCollectionBand(collected, estimated) {
  const pct = clampPct(collected, estimated)
  if (pct >= 90) return 'excellent'
  if (pct >= 70) return 'good'
  if (pct >= 40) return 'average'
  return 'low'
}

function getBandClasses(band) {
  switch (band) {
    case 'excellent':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'
    case 'good':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900'
    case 'average':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900'
    default:
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900'
  }
}

function getStatusClasses(status) {
  switch (status) {
    case 'cleared':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'
    case 'excess':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900'
    default:
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900'
  }
}

function getStatusLabel(status) {
  if (status === 'cleared') return 'Cleared'
  if (status === 'excess') return 'Excess'
  return 'Pending'
}

function sortValue(row, key) {
  switch (key) {
    case 'driverName':
      return row.driverName
    case 'vehicleNo':
      return row.vehicleNo
    case 'route':
      return row.route
    case 'totalStudents':
      return n(row.totalStudents)
    case 'paidStudents':
      return n(row.paidStudents)
    case 'unpaidStudents':
      return n(row.unpaidStudents)
    case 'estimatedAmount':
      return n(row.estimatedAmount)
    case 'discountAmount':
      return n(row.discountAmount)
    case 'collectedAmount':
      return n(row.collectedAmount)
    case 'pendingAmount':
      return n(row.pendingAmount)
    case 'collectionPct':
      return n(row.collectionPct)
    case 'classSummary':
      return row.classSummary
    default:
      return row[key]
  }
}

function buildGroupedClassSummary(routes) {
  const grouped = {}

  routes.forEach((route) => {
    const className = route?.class ?? 'N/A'
    const sectionName = route?.section ?? ''
    const key = sectionName ? `${className}-${sectionName}` : `${className}`

    if (!grouped[key]) {
      grouped[key] = {
        students: 0,
        paidStudents: 0,
        unpaidStudents: 0,
      }
    }

    grouped[key].students += n(route?.totalStudents)
    grouped[key].paidStudents += n(route?.studentsPaid)
    grouped[key].unpaidStudents += n(route?.studentsNotPaid)
  })

  return grouped
}

function buildClassSummaryText(grouped) {
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cls, obj]) => `${cls}: ${obj.students}`)
    .join(', ')
}

function progressColorClass(pct) {
  if (pct >= 90) return 'bg-emerald-500'
  if (pct >= 70) return 'bg-sky-500'
  if (pct >= 40) return 'bg-amber-500'
  return 'bg-red-500'
}

// ─────────────────────────────────────────────────────────────────────────────
// UI bits
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconWrapClass = '',
  valueClass = '',
}) {
  return (
    <div className="rounded-2xl border bg-card shadow-sm px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <p className={`mt-1 text-2xl font-bold tracking-tight ${valueClass}`}>{value}</p>
          {subtitle ? (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconWrapClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function TableHeaderSort({ label, column, sortKey, sortDir, onSort, align = 'left' }) {
  const active = sortKey === column
  const icon = !active ? (
    <ArrowUpDown className="h-3.5 w-3.5" />
  ) : sortDir === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  )

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`inline-flex items-center gap-1 font-semibold hover:text-foreground ${
        align === 'center' ? 'justify-center w-full' : ''
      }`}
    >
      <span>{label}</span>
      <span className={`${active ? 'text-foreground' : 'text-muted-foreground'}`}>{icon}</span>
    </button>
  )
}

function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs">
      {label}
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground"
        onClick={onClear}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function EmptyState({ hasFilters }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card py-16 text-center">
      <Bus className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm font-medium">No transport records found</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {hasFilters ? 'Try clearing some filters.' : 'No transport data available.'}
      </p>
    </div>
  )
}

function ExpandedClassBreakdown({ row }) {
  const entries = Object.entries(row.groupedClasses || {}).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="bg-muted/20 px-4 py-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-background p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-violet-500" />
            Class Breakdown
          </h4>
          <div className="space-y-2">
            {entries.length === 0 ? (
              <p className="text-xs text-muted-foreground">No class data</p>
            ) : (
              entries.map(([cls, obj]) => (
                <div
                  key={cls}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{cls}</p>
                    <p className="text-xs text-muted-foreground">
                      Paid: {obj.paidStudents} · Unpaid: {obj.unpaidStudents}
                    </p>
                  </div>
                  <Badge variant="secondary">{obj.students} students</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-emerald-500" />
            Financial Overview
          </h4>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Estimated</p>
              <p className="text-base font-bold mt-1">{money(row.estimatedAmount)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-base font-bold mt-1 text-emerald-600">
                {money(row.collectedAmount)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Discount</p>
              <p className="text-base font-bold mt-1 text-sky-600">
                {money(row.discountAmount)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">
                {row.status === 'excess' ? 'Excess' : 'Pending'}
              </p>
              <p
                className={`text-base font-bold mt-1 ${
                  row.status === 'excess'
                    ? 'text-amber-600'
                    : row.status === 'pending'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                }`}
              >
                {money(Math.abs(row.pendingAmount))}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-sky-500" />
            Collection Progress
          </h4>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Collection Rate</span>
              <span className="text-xs font-semibold">{row.collectionPct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progressColorClass(
                  row.collectionPct
                )}`}
                style={{ width: `${row.collectionPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Students</span>
              <span className="font-semibold">{row.totalStudents}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Paid Students</span>
              <span className="font-semibold text-emerald-600">{row.paidStudents}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Unpaid Students</span>
              <span className="font-semibold text-red-600">{row.unpaidStudents}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-muted-foreground">Vehicle Fee / Student</span>
              <span className="font-semibold">{money(row.feePerStudent)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function OwnerTransportReportPage() {
  const { data: raw, isLoading, isError, error, refetch, isFetching } =
    useOwnerTransportReport()

  const [search, setSearch] = useState('')
  const [driverFilter, setDriverFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [routeFilter, setRouteFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [collectionBandFilter, setCollectionBandFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [minStudents, setMinStudents] = useState('')
  const [maxStudents, setMaxStudents] = useState('')
  const [showOnlyUnpaid, setShowOnlyUnpaid] = useState(false)

  const [sortKey, setSortKey] = useState('driverName')
  const [sortDir, setSortDir] = useState('asc')

  const [page, setPage] = useState(1)
  const pageSize = 12

  const [expandedRows, setExpandedRows] = useState({})

  const owners = raw?.data || []

  const flattenedRows = useMemo(() => {
    const rows = []

    owners.forEach((owner, ownerIdx) => {
      const driverName = owner?.ownerName || 'N/A'
      const vehicles = owner?.vehicles || []

      vehicles.forEach((vehicle, vehicleIdx) => {
        const vehicleNo = vehicle?.transportNumber || 'N/A'
        const feePerStudent = n(vehicle?.feePerStudent)
        const routeList = vehicle?.routes || []

        const groupedByRoute = {}

        routeList.forEach((route) => {
          const routeName = route?.route || 'N/A'
          if (!groupedByRoute[routeName]) groupedByRoute[routeName] = []
          groupedByRoute[routeName].push(route)
        })

        Object.entries(groupedByRoute).forEach(([routeName, routes], routeIdx) => {
          const totalStudents = routes.reduce((sum, r) => sum + n(r?.totalStudents), 0)
          const paidStudents = routes.reduce((sum, r) => sum + n(r?.studentsPaid), 0)
          const unpaidStudents = routes.reduce((sum, r) => sum + n(r?.studentsNotPaid), 0)
          const estimatedAmount = routes.reduce(
            (sum, r) => sum + n(r?.estimatedTotalFee),
            0
          )
          const discountAmount = routes.reduce((sum, r) => sum + n(r?.totalDiscount), 0)
          const collectedAmount = routes.reduce(
            (sum, r) => sum + n(r?.totalPaidByStudents),
            0
          )
          const pendingAmount = routes.reduce((sum, r) => sum + n(r?.pendingAmount), 0)

          const groupedClasses = buildGroupedClassSummary(routes)
          const classSummary = buildClassSummaryText(groupedClasses)
          const status = getPendingStatus(pendingAmount)
          const collectionPct = clampPct(collectedAmount, estimatedAmount)
          const collectionBand = getCollectionBand(collectedAmount, estimatedAmount)
          const classNames = Object.keys(groupedClasses)

          rows.push({
            id: `${ownerIdx}-${vehicleIdx}-${routeIdx}-${driverName}-${vehicleNo}-${routeName}`,
            driverName,
            vehicleNo,
            route: routeName,
            feePerStudent,
            totalStudents,
            paidStudents,
            unpaidStudents,
            estimatedAmount,
            discountAmount,
            collectedAmount,
            pendingAmount,
            status,
            collectionPct,
            collectionBand,
            groupedClasses,
            classSummary,
            classNames,
          })
        })
      })
    })

    return rows
  }, [owners])

  const drivers = useMemo(() => {
    return Array.from(new Set(flattenedRows.map((r) => r.driverName))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [flattenedRows])

  const vehicles = useMemo(() => {
    return Array.from(new Set(flattenedRows.map((r) => r.vehicleNo))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [flattenedRows])

  const routes = useMemo(() => {
    return Array.from(new Set(flattenedRows.map((r) => r.route))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [flattenedRows])

  const classes = useMemo(() => {
    const set = new Set()
    flattenedRows.forEach((row) => {
      row.classNames.forEach((c) => set.add(c))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [flattenedRows])

  const filteredRows = useMemo(() => {
    let rows = [...flattenedRows]

    const q = normalizeText(search)
    const min = minStudents === '' ? null : n(minStudents)
    const max = maxStudents === '' ? null : n(maxStudents)

    if (q) {
      rows = rows.filter((row) => {
        return (
          normalizeText(row.driverName).includes(q) ||
          normalizeText(row.vehicleNo).includes(q) ||
          normalizeText(row.route).includes(q) ||
          normalizeText(row.classSummary).includes(q) ||
          normalizeText(row.status).includes(q)
        )
      })
    }

    if (driverFilter !== 'all') {
      rows = rows.filter((row) => row.driverName === driverFilter)
    }

    if (vehicleFilter !== 'all') {
      rows = rows.filter((row) => row.vehicleNo === vehicleFilter)
    }

    if (routeFilter !== 'all') {
      rows = rows.filter((row) => row.route === routeFilter)
    }

    if (statusFilter !== 'all') {
      rows = rows.filter((row) => row.status === statusFilter)
    }

    if (collectionBandFilter !== 'all') {
      rows = rows.filter((row) => row.collectionBand === collectionBandFilter)
    }

    if (classFilter !== 'all') {
      rows = rows.filter((row) => row.classNames.includes(classFilter))
    }

    if (min !== null) {
      rows = rows.filter((row) => row.totalStudents >= min)
    }

    if (max !== null) {
      rows = rows.filter((row) => row.totalStudents <= max)
    }

    if (showOnlyUnpaid) {
      rows = rows.filter((row) => row.unpaidStudents > 0 || row.pendingAmount > 0)
    }

    rows.sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)

      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }

      const result = String(av ?? '').localeCompare(String(bv ?? ''), undefined, {
        numeric: true,
        sensitivity: 'base',
      })
      return sortDir === 'asc' ? result : -result
    })

    return rows
  }, [
    flattenedRows,
    search,
    driverFilter,
    vehicleFilter,
    routeFilter,
    statusFilter,
    collectionBandFilter,
    classFilter,
    minStudents,
    maxStudents,
    showOnlyUnpaid,
    sortKey,
    sortDir,
  ])

  const summary = useMemo(() => {
    const totalRoutes = filteredRows.length
    const totalStudents = filteredRows.reduce((sum, row) => sum + n(row.totalStudents), 0)
    const paidStudents = filteredRows.reduce((sum, row) => sum + n(row.paidStudents), 0)
    const unpaidStudents = filteredRows.reduce((sum, row) => sum + n(row.unpaidStudents), 0)
    const estimatedAmount = filteredRows.reduce(
      (sum, row) => sum + n(row.estimatedAmount),
      0
    )
    const discountAmount = filteredRows.reduce((sum, row) => sum + n(row.discountAmount), 0)
    const collectedAmount = filteredRows.reduce(
      (sum, row) => sum + n(row.collectedAmount),
      0
    )
    const positivePending = filteredRows.reduce(
      (sum, row) => sum + Math.max(0, n(row.pendingAmount)),
      0
    )
    const excess = filteredRows.reduce(
      (sum, row) => sum + Math.abs(Math.min(0, n(row.pendingAmount))),
      0
    )

    const driversCount = new Set(filteredRows.map((row) => row.driverName)).size
    const vehiclesCount = new Set(filteredRows.map((row) => row.vehicleNo)).size
    const overallCollectionPct = clampPct(collectedAmount, estimatedAmount)

    return {
      totalRoutes,
      totalStudents,
      paidStudents,
      unpaidStudents,
      estimatedAmount,
      discountAmount,
      collectedAmount,
      positivePending,
      excess,
      driversCount,
      vehiclesCount,
      overallCollectionPct,
    }
  }, [filteredRows])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, page])

  const hasFilters =
    !!search ||
    driverFilter !== 'all' ||
    vehicleFilter !== 'all' ||
    routeFilter !== 'all' ||
    statusFilter !== 'all' ||
    collectionBandFilter !== 'all' ||
    classFilter !== 'all' ||
    minStudents !== '' ||
    maxStudents !== '' ||
    showOnlyUnpaid

  function clearFilters() {
    setSearch('')
    setDriverFilter('all')
    setVehicleFilter('all')
    setRouteFilter('all')
    setStatusFilter('all')
    setCollectionBandFilter('all')
    setClassFilter('all')
    setMinStudents('')
    setMaxStudents('')
    setShowOnlyUnpaid(false)
    setPage(1)
  }

  function handleSort(column) {
    setPage(1)
    if (sortKey === column) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(column)
      setSortDir('asc')
    }
  }

  function toggleExpanded(id) {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  function exportCurrentRows() {
    const rows = filteredRows.map((row) => ({
      driver_name: row.driverName,
      vehicle_no: row.vehicleNo,
      route: row.route,
      class_summary: row.classSummary,
      total_students: row.totalStudents,
      paid_students: row.paidStudents,
      unpaid_students: row.unpaidStudents,
      estimated_amount: row.estimatedAmount,
      discount_amount: row.discountAmount,
      collected_amount: row.collectedAmount,
      pending_amount: row.pendingAmount,
      collection_pct: row.collectionPct,
      status: row.status,
      collection_band: row.collectionBand,
      fee_per_student: row.feePerStudent,
    }))

    downloadCsv('transport-report.csv', rows)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircleLoader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load transport report. {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (page > totalPages) {
    setPage(totalPages)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center shadow">
              <Bus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Transport Report</h2>
              <p className="text-sm text-muted-foreground">
                Driver, vehicle, route and transport fee performance dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => refetch?.()}
            className="gap-2"
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" onClick={exportCurrentRows} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
        <SummaryCard
          title="Drivers"
          value={summary.driversCount}
          subtitle="Unique drivers shown"
          icon={ShieldCheck}
          iconWrapClass="bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
        />

        <SummaryCard
          title="Vehicles"
          value={summary.vehiclesCount}
          subtitle="Unique vehicles shown"
          icon={Car}
          iconWrapClass="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
        />

        <SummaryCard
          title="Routes"
          value={summary.totalRoutes}
          subtitle="Filtered route entries"
          icon={Route}
          iconWrapClass="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
        />

        <SummaryCard
          title="Students"
          value={summary.totalStudents}
          subtitle={`${summary.paidStudents} paid · ${summary.unpaidStudents} unpaid`}
          icon={Users}
          iconWrapClass="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
        />

        <SummaryCard
          title="Estimated"
          value={money(summary.estimatedAmount)}
          subtitle="Expected transport total"
          icon={Wallet}
          iconWrapClass="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
        />

        <SummaryCard
          title="Collected"
          value={money(summary.collectedAmount)}
          subtitle={`${summary.overallCollectionPct}% collection rate`}
          icon={TrendingUp}
          iconWrapClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          valueClass="text-emerald-600"
        />

        <SummaryCard
          title="Pending"
          value={money(summary.positivePending)}
          subtitle="Outstanding pending amount"
          icon={TrendingDown}
          iconWrapClass="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          valueClass="text-red-600"
        />

        <SummaryCard
          title="Excess"
          value={money(summary.excess)}
          subtitle="Over-collected amount"
          icon={IndianRupee}
          iconWrapClass="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          valueClass="text-amber-600"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-violet-500" />
            <h3 className="font-semibold">Filters & Search</h3>
          </div>

          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          ) : null}
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-6 gap-3">
            <div className="relative lg:col-span-3 2xl:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search driver, vehicle, route, class, status..."
                className="pl-9"
              />
            </div>

            <Select
              value={driverFilter}
              onValueChange={(v) => {
                setDriverFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver} value={driver}>
                    {driver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={vehicleFilter}
              onValueChange={(v) => {
                setVehicleFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={routeFilter}
              onValueChange={(v) => {
                setRouteFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map((route) => (
                  <SelectItem key={route} value={route}>
                    {route}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={classFilter}
              onValueChange={(v) => {
                setClassFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-6 gap-3">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="excess">Excess</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={collectionBandFilter}
              onValueChange={(v) => {
                setCollectionBandFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Collection Band" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bands</SelectItem>
                <SelectItem value="excellent">Excellent (90%+)</SelectItem>
                <SelectItem value="good">Good (70%+)</SelectItem>
                <SelectItem value="average">Average (40%+)</SelectItem>
                <SelectItem value="low">Low (&lt; 40%)</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Min students"
              value={minStudents}
              onChange={(e) => {
                setMinStudents(e.target.value)
                setPage(1)
              }}
            />

            <Input
              type="number"
              placeholder="Max students"
              value={maxStudents}
              onChange={(e) => {
                setMaxStudents(e.target.value)
                setPage(1)
              }}
            />

            <button
              type="button"
              onClick={() => {
                setShowOnlyUnpaid((prev) => !prev)
                setPage(1)
              }}
              className={`rounded-md border px-3 text-sm font-medium transition ${
                showOnlyUnpaid
                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              Show only unpaid / pending
            </button>

            <div className="rounded-md border px-3 py-2 text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Sort</span>
              <span className="font-medium capitalize">
                {sortKey} · {sortDir}
              </span>
            </div>
          </div>

          {/* active chips */}
          {hasFilters ? (
            <div className="flex flex-wrap gap-2">
              {search ? <FilterChip label={`Search: ${search}`} onClear={() => setSearch('')} /> : null}
              {driverFilter !== 'all' ? (
                <FilterChip label={`Driver: ${driverFilter}`} onClear={() => setDriverFilter('all')} />
              ) : null}
              {vehicleFilter !== 'all' ? (
                <FilterChip label={`Vehicle: ${vehicleFilter}`} onClear={() => setVehicleFilter('all')} />
              ) : null}
              {routeFilter !== 'all' ? (
                <FilterChip label={`Route: ${routeFilter}`} onClear={() => setRouteFilter('all')} />
              ) : null}
              {classFilter !== 'all' ? (
                <FilterChip label={`Class: ${classFilter}`} onClear={() => setClassFilter('all')} />
              ) : null}
              {statusFilter !== 'all' ? (
                <FilterChip label={`Status: ${statusFilter}`} onClear={() => setStatusFilter('all')} />
              ) : null}
              {collectionBandFilter !== 'all' ? (
                <FilterChip
                  label={`Band: ${collectionBandFilter}`}
                  onClear={() => setCollectionBandFilter('all')}
                />
              ) : null}
              {minStudents !== '' ? (
                <FilterChip label={`Min Students: ${minStudents}`} onClear={() => setMinStudents('')} />
              ) : null}
              {maxStudents !== '' ? (
                <FilterChip label={`Max Students: ${maxStudents}`} onClear={() => setMaxStudents('')} />
              ) : null}
              {showOnlyUnpaid ? (
                <FilterChip label="Only unpaid/pending" onClear={() => setShowOnlyUnpaid(false)} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Table toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredRows.length}</span>{' '}
          records · Page <span className="font-semibold text-foreground">{page}</span> of{' '}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Cleared
          </span>
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            Pending
          </span>
          <span className="inline-flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            Excess
          </span>
        </div>
      </div>

      {/* Table */}
      {pagedRows.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1700px] text-sm">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr className="border-b">
                  <th className="px-4 py-3 w-[56px]"></th>
                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Driver"
                      column="driverName"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Vehicle"
                      column="vehicleNo"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Route"
                      column="route"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-left px-4 py-3 min-w-[260px]">
                    <TableHeaderSort
                      label="Classes"
                      column="classSummary"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-center px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Students"
                      column="totalStudents"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      align="center"
                    />
                  </th>
                  <th className="text-center px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Paid"
                      column="paidStudents"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      align="center"
                    />
                  </th>
                  <th className="text-center px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Unpaid"
                      column="unpaidStudents"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      align="center"
                    />
                  </th>
                  <th className="text-right px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Estimated"
                      column="estimatedAmount"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-right px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Discount"
                      column="discountAmount"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-right px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Collected"
                      column="collectedAmount"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-right px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Pending"
                      column="pendingAmount"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="text-center px-4 py-3 whitespace-nowrap">
                    <TableHeaderSort
                      label="Collection %"
                      column="collectionPct"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                      align="center"
                    />
                  </th>
                  <th className="text-center px-4 py-3 whitespace-nowrap">Band</th>
                  <th className="text-center px-4 py-3 whitespace-nowrap">Status</th>
                </tr>
              </thead>

              <tbody>
                {pagedRows.map((row) => {
                  const expanded = !!expandedRows[row.id]

                  return (
                    <FragmentRow
                      key={row.id}
                      row={row}
                      expanded={expanded}
                      onToggle={() => toggleExpanded(row.id)}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredRows.length > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {(page - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-foreground">
              {Math.min(page * pageSize, filteredRows.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-foreground">{filteredRows.length}</span>{' '}
            records
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="px-3 py-1.5 text-sm rounded-md border bg-background">
              {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Fragment row component
// ─────────────────────────────────────────────────────────────────────────────

function FragmentRow({ row, expanded, onToggle }) {
  const statusClass = getStatusClasses(row.status)
  const bandClass = getBandClasses(row.collectionBand)

  return (
    <>
      <tr className="border-b hover:bg-muted/25 transition-colors">
        <td className="px-4 py-3 align-middle">
          <button
            type="button"
            onClick={onToggle}
            className="h-8 w-8 rounded-lg border bg-background hover:bg-muted inline-flex items-center justify-center"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </td>

        <td className="px-4 py-3 align-middle">
          <div className="flex items-center gap-2 min-w-[180px]">
            <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold leading-tight">{row.driverName}</p>
              <p className="text-xs text-muted-foreground">Transport Driver</p>
            </div>
          </div>
        </td>

        <td className="px-4 py-3 align-middle">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Car className="h-4 w-4 text-sky-500" />
            <span className="font-medium">{row.vehicleNo}</span>
          </div>
        </td>

        <td className="px-4 py-3 align-middle">
          <div className="flex items-center gap-2 min-w-[180px]">
            <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="font-medium">{row.route}</span>
          </div>
        </td>

        <td className="px-4 py-3 align-middle min-w-[260px]">
          <div className="max-w-[280px]">
            <p className="line-clamp-2 text-sm">{row.classSummary || '-'}</p>
          </div>
        </td>

        <td className="px-4 py-3 text-center align-middle font-semibold">
          {row.totalStudents}
        </td>

        <td className="px-4 py-3 text-center align-middle">
          <span className="font-semibold text-emerald-600">{row.paidStudents}</span>
        </td>

        <td className="px-4 py-3 text-center align-middle">
          <span className="font-semibold text-red-600">{row.unpaidStudents}</span>
        </td>

        <td className="px-4 py-3 text-right align-middle whitespace-nowrap font-medium">
          {money(row.estimatedAmount)}
        </td>

        <td className="px-4 py-3 text-right align-middle whitespace-nowrap font-medium text-sky-600">
          {money(row.discountAmount)}
        </td>

        <td className="px-4 py-3 text-right align-middle whitespace-nowrap font-semibold text-emerald-600">
          {money(row.collectedAmount)}
        </td>

        <td className="px-4 py-3 text-right align-middle whitespace-nowrap font-semibold">
          <span
            className={
              row.status === 'excess'
                ? 'text-amber-600'
                : row.status === 'pending'
                  ? 'text-red-600'
                  : 'text-muted-foreground'
            }
          >
            {money(Math.abs(row.pendingAmount))}
          </span>
        </td>

        <td className="px-4 py-3 text-center align-middle">
          <div className="min-w-[120px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Rate</span>
              <span className="text-xs font-semibold">{row.collectionPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${progressColorClass(row.collectionPct)}`}
                style={{ width: `${row.collectionPct}%` }}
              />
            </div>
          </div>
        </td>

        <td className="px-4 py-3 text-center align-middle">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${bandClass}`}>
            {row.collectionBand}
          </span>
        </td>

        <td className="px-4 py-3 text-center align-middle">
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass}`}
          >
            {getStatusLabel(row.status)}
          </span>
        </td>
      </tr>

      {expanded ? (
        <tr className="border-b">
          <td colSpan={15} className="p-0">
            <ExpandedClassBreakdown row={row} />
          </td>
        </tr>
      ) : null}
    </>
  )
}