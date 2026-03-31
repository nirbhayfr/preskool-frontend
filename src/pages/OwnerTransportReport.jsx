import { useState, useMemo } from 'react'
import { useOwnerTransportReport } from '@/hooks/useTransportHistory'
import { CircleLoader } from '@/components/layout/RouteLoader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Bus,
  ChevronDown,
  ChevronRight,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Search,
  X,
  MapPin,
  Car,
  Wallet,
  BarChart3,
  Tag,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return Math.abs(Number(n || 0)).toLocaleString('en-IN')
}

function pct(a, b) {
  if (!b || b <= 0) return 0
  return Math.min(100, Math.round((a / b) * 100))
}

// Assign a vivid accent color per owner index
const OWNER_PALETTES = [
  {
    light: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-400',
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400',
    gradient: 'bg-violet-500',
  },
  {
    light: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-600 dark:text-sky-400',
    bar: 'bg-sky-400',
    badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400',
    gradient: 'bg-sky-500',
  },
  {
    light: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-600 dark:text-rose-400',
    bar: 'bg-rose-400',
    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400',
    gradient: 'bg-rose-500',
  },
  {
    light: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
    gradient: 'bg-amber-500',
  },
  {
    light: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
    gradient: 'bg-emerald-500',
  },
]

function palette(idx) {
  return OWNER_PALETTES[idx % OWNER_PALETTES.length]
}

// ─────────────────────────────────────────────────────────────────────────────
// Global Summary Bar
// ─────────────────────────────────────────────────────────────────────────────

function GlobalSummary({ data }) {
  const totalStudents = data.reduce((s, o) => s + o.ownerTotalStudents, 0)
  const totalEstimated = data.reduce((s, o) => s + o.ownerTotalEstimated, 0)
  const totalPaid = data.reduce((s, o) => s + o.ownerTotalPaid, 0)
  const totalPending = data.reduce((s, o) => s + Math.max(0, o.ownerTotalPending), 0)
  const totalOverpaid = data.reduce(
    (s, o) => s + Math.abs(Math.min(0, o.ownerTotalPending)),
    0
  )
  const collectionPct = pct(totalPaid, totalEstimated)

  const stats = [
    {
      label: 'Total Owners',
      value: data.length,
      icon: Car,
      iconBg: 'bg-violet-100 dark:bg-violet-900',
      iconColor: 'text-violet-600 dark:text-violet-400',
      valueColor: 'text-violet-700 dark:text-violet-300',
    },
    {
      label: 'Students on Transport',
      value: totalStudents,
      icon: Users,
      iconBg: 'bg-sky-100 dark:bg-sky-900',
      iconColor: 'text-sky-600 dark:text-sky-400',
      valueColor: 'text-sky-700 dark:text-sky-300',
    },
    {
      label: 'Total Estimated',
      value: `₹${fmt(totalEstimated)}`,
      icon: Wallet,
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-500',
      valueColor: 'text-slate-700 dark:text-slate-300',
    },
    {
      label: 'Total Collected',
      value: `₹${fmt(totalPaid)}`,
      sub: `${collectionPct}% collection rate`,
      icon: TrendingUp,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      label: 'Outstanding Pending',
      value: `₹${fmt(totalPending)}`,
      icon: TrendingDown,
      iconBg: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-500',
      valueColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Excess Collected',
      value: `₹${fmt(totalOverpaid)}`,
      icon: TrendingUp,
      iconBg: 'bg-amber-100 dark:bg-amber-900',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card px-4 py-3.5 flex flex-col gap-2"
          >
            <div
              className={`h-8 w-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}
            >
              <Icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div>
              <p
                className={`text-xl font-bold tabular-nums leading-tight ${stat.valueColor}`}
              >
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Row inside a vehicle
// ─────────────────────────────────────────────────────────────────────────────

function RouteRow({ route, palette: p }) {
  const pending = Number(route.pendingAmount || 0)
  const paid = Number(route.totalPaidByStudents || 0)
  const est = Number(route.estimatedTotalFee || 0)
  const discount = Number(route.totalDiscount || 0)
  const isOverpaid = pending < 0
  const collPct = pct(paid, est)

  return (
    <div className={`rounded-lg border ${p.border} bg-card px-4 py-3`}>
      {/* Route name + class/section */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 min-w-0">
          <MapPin className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${p.text}`} />
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-snug truncate">{route.route}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${p.badge}`}
              >
                Class {route.class} · {route.section}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Users className="h-2.5 w-2.5" /> {route.totalStudents} student
                {route.totalStudents !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        {isOverpaid ? (
          <span className="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800 whitespace-nowrap shrink-0">
            <TrendingUp className="h-2.5 w-2.5" /> Excess
          </span>
        ) : pending === 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
            <CheckCircle2 className="h-2.5 w-2.5" /> Cleared
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 bg-red-50 dark:bg-red-950 text-red-500 border border-red-200 dark:border-red-800 whitespace-nowrap shrink-0">
            <AlertTriangle className="h-2.5 w-2.5" /> Pending
          </span>
        )}
      </div>

      {/* Collection progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">Collection</span>
          <span className={`text-[10px] font-semibold ${p.text}`}>{collPct}%</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${p.bar} transition-all`}
            style={{ width: `${collPct}%` }}
          />
        </div>
      </div>

      {/* Amount grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">Estimated</p>
          <p className="text-[11px] font-semibold tabular-nums">₹{fmt(est)}</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">Discount</p>
          <p className="text-[11px] font-semibold text-blue-500 tabular-nums">
            {discount > 0 ? `-₹${fmt(discount)}` : '—'}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">Collected</p>
          <p className="text-[11px] font-semibold text-emerald-600 tabular-nums">
            ₹{fmt(paid)}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground mb-0.5">
            {isOverpaid ? 'Excess' : 'Pending'}
          </p>
          <p
            className={`text-[11px] font-bold tabular-nums ${
              isOverpaid
                ? 'text-amber-500'
                : pending > 0
                  ? 'text-red-500'
                  : 'text-muted-foreground'
            }`}
          >
            {pending !== 0 ? `₹${fmt(pending)}` : '—'}
          </p>
        </div>
      </div>

      {/* Students paid / not paid */}
      <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-border/50">
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
          <CheckCircle2 className="h-3 w-3" /> {route.studentsPaid} paid
        </span>
        {route.studentsNotPaid > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] text-red-500 font-medium">
            <AlertTriangle className="h-3 w-3" /> {route.studentsNotPaid} unpaid
          </span>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle block
// ─────────────────────────────────────────────────────────────────────────────

function VehicleBlock({ vehicle, palette: p }) {
  const [expanded, setExpanded] = useState(true)

  const totalRoutes = vehicle.routes.length
  const totalPaid = vehicle.routes.reduce(
    (s, r) => s + Number(r.totalPaidByStudents || 0),
    0
  )
  const totalEst = vehicle.routes.reduce(
    (s, r) => s + Number(r.estimatedTotalFee || 0),
    0
  )
  const totalPending = vehicle.routes.reduce(
    (s, r) => s + Math.max(0, Number(r.pendingAmount || 0)),
    0
  )

  return (
    <div className={`rounded-xl border ${p.border} overflow-hidden`}>
      {/* Vehicle header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 ${p.light} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-8 w-8 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-sm`}
          >
            <Bus className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-bold tracking-wide ${p.text}`}>
              {vehicle.transportNumber}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {totalRoutes} route{totalRoutes !== 1 ? 's' : ''} ·{' '}
              <span className="font-medium">₹{fmt(vehicle.feePerStudent)}/student</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-right">
            <div>
              <p className="text-[9px] text-muted-foreground">Collected</p>
              <p className="text-xs font-bold text-emerald-600 tabular-nums">
                ₹{fmt(totalPaid)}
              </p>
            </div>
            {totalPending > 0 && (
              <div>
                <p className="text-[9px] text-muted-foreground">Pending</p>
                <p className="text-xs font-bold text-red-500 tabular-nums">
                  ₹{fmt(totalPending)}
                </p>
              </div>
            )}
          </div>
          <div
            className={`h-6 w-6 rounded-full ${p.light} flex items-center justify-center`}
          >
            {expanded ? (
              <ChevronDown className={`h-3.5 w-3.5 ${p.text}`} />
            ) : (
              <ChevronRight className={`h-3.5 w-3.5 ${p.text}`} />
            )}
          </div>
        </div>
      </button>

      {/* Routes grid */}
      {expanded && (
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 bg-background/60">
          {vehicle.routes.map((route, idx) => (
            <RouteRow key={idx} route={route} palette={p} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Owner Card
// ─────────────────────────────────────────────────────────────────────────────

function OwnerCard({ owner, paletteIdx }) {
  const [expanded, setExpanded] = useState(false)
  const p = palette(paletteIdx)

  const pending = Number(owner.ownerTotalPending || 0)
  const paid = Number(owner.ownerTotalPaid || 0)
  const est = Number(owner.ownerTotalEstimated || 0)
  const isOverpaid = pending < 0
  const collPct = pct(paid, est + Math.abs(Math.min(0, pending)))

  return (
    <div className={`rounded-2xl border-2 ${p.border} overflow-hidden shadow-sm`}>
      {/* Owner header */}
      <div className={`bg-gradient-to-r  p-0.5`}>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-card rounded-t-[14px] hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`h-11 w-11 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-md`}
            >
              <span className="text-white font-bold text-base">
                {owner.ownerName.charAt(0)}
              </span>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">{owner.ownerName}</h3>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.badge}`}
                >
                  {owner.vehicles.length} vehicle{owner.vehicles.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" /> {owner.ownerTotalStudents} students
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${p.text}`}>
                  <BarChart3 className="h-3 w-3" /> {collPct}% collected
                </span>
              </div>
            </div>
          </div>

          {/* Financial summary pills */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-muted-foreground">Estimated</p>
              <p className="text-sm font-bold tabular-nums">₹{fmt(est)}</p>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Collected</p>
              <p className="text-sm font-bold text-emerald-600 tabular-nums">
                ₹{fmt(paid)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">
                {isOverpaid ? 'Excess' : 'Pending'}
              </p>
              <p
                className={`text-sm font-bold tabular-nums ${isOverpaid ? 'text-amber-500' : pending > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                {pending !== 0 ? `₹${fmt(pending)}` : '—'}
              </p>
            </div>
            <div
              className={`h-7 w-7 rounded-full ${p.light} flex items-center justify-center ml-1`}
            >
              {expanded ? (
                <ChevronDown className={`h-4 w-4 ${p.text}`} />
              ) : (
                <ChevronRight className={`h-4 w-4 ${p.text}`} />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Collection bar */}
      <div className={`px-5 py-2 ${p.light} border-b ${p.border}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground font-medium">
            Overall collection rate
          </span>
          <span className={`text-[10px] font-bold ${p.text}`}>{collPct}%</span>
        </div>
        <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${p.gradient} transition-all`}
            style={{ width: `${collPct}%` }}
          />
        </div>
      </div>

      {/* Vehicles */}
      {expanded && (
        <div className="p-4 space-y-3 bg-muted/10">
          {owner.vehicles.map((vehicle, vIdx) => (
            <VehicleBlock key={vIdx} vehicle={vehicle} palette={p} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function OwnerTransportReportPage() {
  const { data: raw, isLoading, isError, error } = useOwnerTransportReport()
  const [search, setSearch] = useState('')

  const owners = raw?.data || []

  const filtered = useMemo(() => {
    if (!search.trim()) return owners
    const q = search.trim().toLowerCase()
    return owners.filter(
      (o) =>
        o.ownerName.toLowerCase().includes(q) ||
        o.vehicles.some(
          (v) =>
            v.transportNumber.toLowerCase().includes(q) ||
            v.routes.some((r) => r.route.toLowerCase().includes(q))
        )
    )
  }, [owners, search])

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircleLoader />
      </div>
    )

  if (isError)
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load transport report. {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    )

  return (
    <div className="p-6 space-y-6 w-full">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center shadow">
              <Bus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Transport Report</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Fee collection overview across all transport owners, vehicles &amp; routes
          </p>
        </div>

        {/* Search */}
        {owners.length > 0 && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search owner, vehicle, route…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-64 h-9 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Global Summary ── */}
      {owners.length > 0 && <GlobalSummary data={owners} />}

      {/* ── Results info ── */}
      {search && (
        <p className="text-xs text-muted-foreground -mt-3">
          {filtered.length} of {owners.length} owner{owners.length !== 1 ? 's' : ''} match
          "{search}"
        </p>
      )}

      {/* ── Owner Cards ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
          <Bus className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p className="text-sm font-medium">No owners found.</p>
          {search && (
            <p className="text-xs mt-1 opacity-60">Try a different search term.</p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((owner, idx) => (
            <OwnerCard key={owner.ownerName} owner={owner} paletteIdx={idx} />
          ))}
        </div>
      )}
    </div>
  )
}
