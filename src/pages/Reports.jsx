import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChevronDown,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Filter,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from 'lucide-react'
import { useFeeSubmissions } from '@/hooks/useFeeSubmissions'
import { useStudents } from '@/hooks/useStudents'
import { classes, sections } from '@/data/basicData'

const getFeeGroup = (feeType = '') => {
  const type = feeType.toUpperCase()
  if (type.includes('TUITION')) return 'tuition_fee'
  if (type.includes('TRANSPORT')) return 'transport_fee'
  if (type === 'PENDING_FEE') return 'pending_fee'
  return 'other'
}

const FEE_GROUP_CONFIG = {
  tuition_fee: {
    label: 'Tuition',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: '📚',
  },
  transport_fee: {
    label: 'Transport',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    textColor: 'text-violet-700 dark:text-violet-300',
    borderColor: 'border-violet-200 dark:border-violet-800',
    icon: '🚌',
  },
  pending_fee: {
    label: 'Pending',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    textColor: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800',
    icon: '⏳',
  },
  other: {
    label: 'Other',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-800',
    icon: '📋',
  },
}

const PAYMENT_STATUS_CONFIG = {
  SUCCESS: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: '✓',
  },
  PARTIAL: {
    label: 'Partial',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    icon: '◐',
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    icon: '○',
  },
}

function StatCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className={`rounded-xl border p-4 ${FEE_GROUP_CONFIG[color]?.bgColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className={`text-2xl font-bold mt-2 ${FEE_GROUP_CONFIG[color]?.textColor}`}>
            ₹{Number(value || 0).toLocaleString('en-IN')}
          </p>
          {trend && (
            <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {trend} from last month
            </p>
          )}
        </div>
        <div
          className={`h-10 w-10 rounded-lg bg-gradient-to-br ${FEE_GROUP_CONFIG[color]?.color} flex items-center justify-center text-white`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove, variant = 'default' }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm">
      <span className="font-medium text-primary">{label}</span>
      <button
        onClick={onRemove}
        className="text-primary/60 hover:text-primary transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function TableHeader() {
  return (
    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Student
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Fee Type
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Original Amount
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Discount
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Collected
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Pending
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Payment Mode
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Date
        </th>
      </tr>
    </thead>
  )
}

function TableRow({ row, feeGroup, statusConfig }) {
  const groupConfig = FEE_GROUP_CONFIG[feeGroup]
  const pending = Math.max(
    Number(row.OriginalAmount || 0) -
      Number(row.DiscountAmount || 0) -
      Number(row.PaidAmount || 0),
    0
  )

  const isPending = pending > 0
  const isPartial = Number(row.PaidAmount || 0) > 0 && isPending

  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-foreground">{row.FullName || '—'}</p>
          <p className="text-xs text-muted-foreground">
            ID: {row.StudentID} • Class {row.ClassID} - {row.SectionID}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${groupConfig.bgColor} border ${groupConfig.borderColor}`}
        >
          <span className="text-lg">{groupConfig.icon}</span>
          <span className={`text-sm font-medium ${groupConfig.textColor}`}>
            {groupConfig.label}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm font-semibold text-foreground text-center">
          ₹{Number(row.OriginalAmount || 0).toLocaleString('en-IN')}
        </p>
      </td>
      <td className="px-6 py-4">
        <p
          className={`text-sm font-medium text-center ${Number(row.DiscountAmount) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
        >
          {Number(row.DiscountAmount || 0) > 0 ? (
            <>−₹{Number(row.DiscountAmount).toLocaleString('en-IN')}</>
          ) : (
            '—'
          )}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1">
          <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            ₹{Number(row.PaidAmount || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div
          className={`flex items-center justify-center gap-1 ${isPending ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}
        >
          {isPending && <ArrowUpRight className="h-3.5 w-3.5" />}
          <p className="text-sm font-semibold">
            {isPending ? `₹${pending.toLocaleString('en-IN')}` : '—'}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <Badge variant="outline" className="text-xs">
          {row.PaymentMode || 'N/A'}
        </Badge>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig?.color}`}
        >
          <span>{statusConfig?.icon}</span>
          {statusConfig?.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(row.SubmittedDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })}
        </p>
      </td>
    </tr>
  )
}

export default function FeeReportsPage() {
  const { data } = useFeeSubmissions()
  console.log(data)

  const [filters, setFilters] = useState({
    feeGroup: null,
    feeType: null,
    paymentStatus: null,
    fromDate: '',
    toDate: '',
    classID: null,
    sectionID: null,
  })
  const [sortBy, setSortBy] = useState('date-desc')

  // ✅ FILTER LOGIC
  const filteredData = useMemo(() => {
    if (!data?.data) return []

    let result = [...data.data]

    result = result.filter((row) => {
      const feeGroup = getFeeGroup(row.FeeType)

      if (filters.feeGroup && feeGroup !== filters.feeGroup) return false
      if (filters.feeType && row.FeeType !== filters.feeType) return false
      if (filters.paymentStatus && row.PaymentStatus !== filters.paymentStatus)
        return false

      // ✅ NEW FILTERS
      if (filters.classID && row.ClassID !== filters.classID) return false
      if (filters.sectionID && row.SectionID !== filters.sectionID) return false

      const date = new Date(row.SubmittedDate)
      if (filters.fromDate && date < new Date(filters.fromDate)) return false
      if (filters.toDate && date > new Date(filters.toDate)) return false

      return true
    })

    // sorting stays same
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.SubmittedDate) - new Date(a.SubmittedDate)
        case 'date-asc':
          return new Date(a.SubmittedDate) - new Date(b.SubmittedDate)
        case 'amount-desc':
          return Number(b.PaidAmount) - Number(a.PaidAmount)
        case 'amount-asc':
          return Number(a.PaidAmount) - Number(b.PaidAmount)
        default:
          return 0
      }
    })

    return result
  }, [data, filters, sortBy])

  // ✅ SUMMARY
  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => {
        acc.total += Number(row.OriginalAmount || 0)
        acc.paid += Number(row.PaidAmount || 0)
        acc.discount += Number(row.DiscountAmount || 0)
        acc.pending +=
          Number(row.OriginalAmount || 0) -
          Number(row.DiscountAmount || 0) -
          Number(row.PaidAmount || 0)
        acc.count += 1
        return acc
      },
      { total: 0, paid: 0, discount: 0, pending: 0, count: 0 }
    )
  }, [filteredData])

  // ✅ UNIQUE DROPDOWNS
  const uniqueFeeTypes = [...new Set(data?.data?.map((d) => d.FeeType))].sort()

  const uniqueClasses = classes

  const uniqueSections = sections

  // ✅ ACTIVE FILTERS
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => value)
    .map(([key, value]) => ({
      key,
      label:
        {
          feeGroup: `Fee Group: ${FEE_GROUP_CONFIG[value]?.label}`,
          feeType: `Type: ${value}`,
          paymentStatus: `Status: ${PAYMENT_STATUS_CONFIG[value]?.label}`,
          fromDate: `From: ${new Date(value).toLocaleDateString('en-IN')}`,
          toDate: `To: ${new Date(value).toLocaleDateString('en-IN')}`,
          classID: `Class: ${value}`,
          sectionID: `Section: ${value}`,
        }[key] || value,
    }))

  const clearAllFilters = () => {
    setFilters({
      feeGroup: null,
      feeType: null,
      paymentStatus: null,
      fromDate: '',
      toDate: '',
    })
  }

  const collectionsPercentage =
    summary.total > 0 ? (summary.paid / summary.total) * 100 : 0

  // ✅ EXPORT FUNCTION
  const handleExport = () => {
    const headers = [
      // 'Student Name',
      'Student ID',
      'Fee Type',
      'Original Amount',
      'Discount',
      'Collected',
      'Pending',
      'Payment Mode',
      'Status',
      'Date',
    ]

    const rows = filteredData.map((row) => {
      const pending = Math.max(
        Number(row.OriginalAmount || 0) -
          Number(row.DiscountAmount || 0) -
          Number(row.PaidAmount || 0),
        0
      )
      return [
        // row.FullName,
        row.StudentID,
        row.FeeType,
        Number(row.OriginalAmount || 0),
        Number(row.DiscountAmount || 0),
        Number(row.PaidAmount || 0),
        pending,
        row.PaymentMode || 'N/A',
        row.PaymentStatus || '-',
        new Date(row.SubmittedDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `fee-reports-${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 p-6">
      {/* 📊 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Fees"
          value={summary.total}
          color="tuition_fee"
        />
        <StatCard
          icon={TrendingUp}
          label="Collected"
          value={summary.paid}
          color="transport_fee"
        />
        <StatCard
          icon={TrendingDown}
          label="Pending"
          value={summary.pending}
          color="pending_fee"
        />
        <div className="rounded-xl border p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Collection Rate
              </p>
              <p className="text-2xl font-bold mt-2 text-emerald-700 dark:text-emerald-300">
                {collectionsPercentage.toFixed(1)}%
              </p>
              <div className="mt-2 h-1.5 w-24 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                  style={{ width: `${collectionsPercentage}%` }}
                />
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 FILTERS CARD */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
            </div>
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Class */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Class
                </label>
                <Select
                  value={filters.classID || 'all-classes'}
                  onValueChange={(v) =>
                    setFilters((p) => ({
                      ...p,
                      classID: v === 'all-classes' ? null : v,
                    }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-classes">All Classes</SelectItem>
                    {uniqueClasses.map((c) => (
                      <SelectItem key={c} value={c}>
                        Class {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Section */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Section
                </label>
                <Select
                  value={filters.sectionID || 'all-sections'}
                  onValueChange={(v) =>
                    setFilters((p) => ({
                      ...p,
                      sectionID: v === 'all-sections' ? null : v,
                    }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-sections">All Sections</SelectItem>
                    {uniqueSections.map((s) => (
                      <SelectItem key={s} value={s}>
                        Section {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Fee Group
              </label>
              <Select
                value={filters.feeGroup || 'all-groups'}
                onValueChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    feeGroup: v === 'all-groups' ? null : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-groups">All Groups</SelectItem>
                  {Object.entries(FEE_GROUP_CONFIG)
                    .filter(([key]) => key !== 'other')
                    .map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Fee Type
              </label>
              <Select
                value={filters.feeType || 'all-types'}
                onValueChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    feeType: v === 'all-types' ? null : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  {uniqueFeeTypes.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Payment Status
              </label>
              <Select
                value={filters.paymentStatus || 'all-status'}
                onValueChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    paymentStatus: v === 'all-status' ? null : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  {Object.entries(PAYMENT_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                From Date
              </label>
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters((p) => ({ ...p, fromDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                To Date
              </label>
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters((p) => ({ ...p, toDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {activeFilters.map(({ key, label }) => (
                <FilterChip
                  key={key}
                  label={label}
                  onRemove={() => {
                    setFilters((p) => ({
                      ...p,
                      [key]: key.includes('Date') ? '' : null,
                    }))
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 📋 TABLE CARD */}
      <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
          <div className="flex items-center justify-between pt-4">
            <div>
              <CardTitle className="text-lg">Fee Records</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredData.length} record{filteredData.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExport}
                disabled={filteredData.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Latest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <TableHeader />
                <tbody className="divide-y">
                  {filteredData.map((row) => {
                    const feeGroup = getFeeGroup(row.FeeType)
                    const statusConfig =
                      PAYMENT_STATUS_CONFIG[row.PaymentStatus] ||
                      PAYMENT_STATUS_CONFIG.PENDING
                    return (
                      <TableRow
                        key={row.SubmissionID}
                        row={row}
                        feeGroup={feeGroup}
                        statusConfig={statusConfig}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground font-medium">No records found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try adjusting your filters to see records
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
