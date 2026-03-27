import { CircleLoader } from '@/components/layout/RouteLoader'
import AddTransportModal from '@/components/manage-transport/AddTransportModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDeleteTransport, useTransport } from '@/hooks/useTransport'
import {
  Bus,
  CheckCircle2,
  Download,
  LayoutGrid,
  List,
  MapPin,
  Moon,
  Pencil,
  Plus,
  Route,
  Search,
  Trash2,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Sun icon (inline — avoids lucide tree-shake issues)
// ---------------------------------------------------------------------------
function Sun({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

function formatCurrency(val) {
  if (val === null || val === undefined) return '—'
  return `₹${Number(val).toLocaleString('en-IN')}`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Helpers to check whether a vehicle has a first / second route populated.
 */
function hasFirstRoute(v) {
  return !!(v.RouteName || v.Route)
}

function hasSecondRoute(v) {
  return !!(v.RouteName1 || v.Route1)
}

function countRoutes(v) {
  return (hasFirstRoute(v) ? 1 : 0) + (hasSecondRoute(v) ? 1 : 0)
}

const CARD_ACCENTS = [
  { bg: 'bg-blue-50', icon: 'text-blue-600', fee: 'text-blue-700' },
  { bg: 'bg-violet-50', icon: 'text-violet-600', fee: 'text-violet-700' },
  { bg: 'bg-teal-50', icon: 'text-teal-600', fee: 'text-teal-700' },
  { bg: 'bg-amber-50', icon: 'text-amber-600', fee: 'text-amber-700' },
  { bg: 'bg-rose-50', icon: 'text-rose-600', fee: 'text-rose-700' },
  { bg: 'bg-emerald-50', icon: 'text-emerald-600', fee: 'text-emerald-700' },
]

function accent(i) {
  return CARD_ACCENTS[i % CARD_ACCENTS.length]
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------
function downloadCSV(vehicles) {
  if (!vehicles?.length) return

  const headers = [
    'Vehicle No',
    'Type',
    'Transporter',
    'Owner',
    'First Route Name',
    'First Route Area',
    'First Route Fee',
    'Second Route Name',
    'Second Route Area',
    'Second Route Fee',
    'GPS',
    'Joined',
    'Status',
  ]

  const rows = vehicles.map((vehicle) => [
    vehicle.TransportNumber,
    vehicle.TransportType,
    vehicle.TransporterName,
    vehicle.OwnerName,
    vehicle.RouteName ?? '',
    vehicle.Route ?? '',
    vehicle.Price ?? '',
    vehicle.RouteName1 ?? '',
    vehicle.Route1 ?? '',
    vehicle.Price1 ?? '',
    vehicle.GPSNumber ?? '',
    vehicle.JoiningDate ? new Date(vehicle.JoiningDate).toLocaleDateString('en-IN') : '',
    vehicle.Status ?? '',
  ])

  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transport-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card px-4 py-3">
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${colorClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold leading-tight">{value}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Route pill — now accepts flat props instead of a routeObj
// ---------------------------------------------------------------------------
function RoutePill({ type, routeName, route }) {
  const isFirst = type === 'first'
  const displayName = routeName || route || '—'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium
        ${isFirst ? 'bg-sky-50 text-sky-700' : 'bg-indigo-50 text-indigo-700'}`}
    >
      {isFirst ? <Sun className="h-2.5 w-2.5" /> : <Moon className="h-2.5 w-2.5" />}
      {isFirst ? 'First' : 'Second'} · {displayName}
      {route && route !== displayName ? ` (${route})` : ''}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Vehicle Card
// ---------------------------------------------------------------------------
function VehicleCard({ vehicle, index, onEdit, onDelete }) {
  const ac = accent(index)
  const isActive = vehicle.Status?.toLowerCase() === 'active'

  const hasRoute1 = hasFirstRoute(vehicle)
  const hasRoute2 = hasSecondRoute(vehicle)

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md
        ${isActive ? 'border-border/50' : 'border-border/30 opacity-75'}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${ac.bg} ${ac.icon}`}
          >
            <Bus className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{vehicle.TransportNumber}</p>
            <p className="text-xs text-muted-foreground">
              {vehicle.TransportType}
              {vehicle.GPSNumber ? ` · ${vehicle.GPSNumber}` : ' · No GPS'}
            </p>
          </div>
        </div>
        <Badge
          className={`flex-shrink-0 text-[11px] ${
            isActive
              ? 'bg-green-50 text-green-700 hover:bg-green-50'
              : 'bg-red-50 text-red-700 hover:bg-red-50'
          }`}
        >
          {isActive ? (
            <CheckCircle2 className="mr-1 h-3 w-3" />
          ) : (
            <XCircle className="mr-1 h-3 w-3" />
          )}
          {vehicle.Status ?? 'Inactive'}
        </Badge>
      </div>

      <div className="h-px bg-border/40" />

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-1.5 text-xs">
        <span className="text-muted-foreground">Transporter</span>
        <span className="text-right font-medium truncate" title={vehicle.TransporterName}>
          {vehicle.TransporterName === 'N/A' ? '—' : vehicle.TransporterName}
        </span>

        <span className="text-muted-foreground">Owner</span>
        <span className="text-right font-medium truncate" title={vehicle.OwnerName}>
          {vehicle.OwnerName === 'N/A' ? '—' : vehicle.OwnerName}
        </span>

        <span className="text-muted-foreground">Fee (first route)</span>
        <span
          className={`text-right font-semibold ${isActive ? ac.fee : 'text-muted-foreground'}`}
        >
          {formatCurrency(vehicle.Price)}
        </span>

        <span className="text-muted-foreground">Joined</span>
        <span className="text-right font-medium">{formatDate(vehicle.JoiningDate)}</span>
      </div>

      {/* Routes */}
      {(hasRoute1 || hasRoute2) && (
        <>
          <div className="h-px bg-border/40" />
          <div>
            <p className="mb-1.5 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Route className="h-3 w-3" /> Routes
            </p>
            <div className="flex flex-col gap-1">
              {hasRoute1 && (
                <RoutePill
                  type="first"
                  routeName={vehicle.RouteName}
                  route={vehicle.Route}
                />
              )}
              {hasRoute2 && (
                <RoutePill
                  type="second"
                  routeName={vehicle.RouteName1}
                  route={vehicle.Route1}
                />
              )}
              {!hasRoute2 && (
                <span className="text-[11px] text-muted-foreground/60 italic">
                  Second route not added yet
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          className="h-7 flex-1 text-xs"
          onClick={() => onEdit(vehicle)}
        >
          <Pencil className="mr-1 h-3 w-3" /> Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 flex-1 border-red-100 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(vehicle)}
        >
          <Trash2 className="mr-1 h-3 w-3" /> Delete
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Table row
// ---------------------------------------------------------------------------
function VehicleTableRow({ vehicle, index, onEdit, onDelete }) {
  const ac = accent(index)
  const isActive = vehicle.Status?.toLowerCase() === 'active'

  const hasRoute1 = hasFirstRoute(vehicle)
  const hasRoute2 = hasSecondRoute(vehicle)

  return (
    <tr className="border-b border-border/30 transition-colors hover:bg-muted/30">
      <td className="py-3 pl-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${ac.bg} ${ac.icon}`}
          >
            <Bus className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold">{vehicle.TransportNumber}</span>
        </div>
      </td>
      <td className="py-3 px-3 text-sm text-muted-foreground">{vehicle.TransportType}</td>
      <td className="py-3 px-3 text-sm">
        {vehicle.TransporterName === 'N/A' ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          vehicle.TransporterName
        )}
      </td>
      <td className="py-3 px-3 text-sm">
        {vehicle.OwnerName === 'N/A' ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          vehicle.OwnerName
        )}
      </td>
      {/* First route */}
      <td className="py-3 px-3">
        {hasRoute1 ? (
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
              <Sun className="h-2.5 w-2.5" />
              {vehicle.RouteName || vehicle.Route}
            </span>
            {vehicle.Route && vehicle.Route !== vehicle.RouteName && (
              <p className="mt-0.5 text-[11px] text-muted-foreground pl-1">
                {vehicle.Route}
              </p>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      {/* Second route */}
      <td className="py-3 px-3">
        {hasRoute2 ? (
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
              <Moon className="h-2.5 w-2.5" />
              {vehicle.RouteName1 || vehicle.Route1}
            </span>
            {vehicle.Route1 && vehicle.Route1 !== vehicle.RouteName1 && (
              <p className="mt-0.5 text-[11px] text-muted-foreground pl-1">
                {vehicle.Route1}
              </p>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/50 italic">—</span>
        )}
      </td>
      <td
        className={`py-3 px-3 text-sm font-semibold ${isActive ? ac.fee : 'text-muted-foreground'}`}
      >
        {formatCurrency(vehicle.Price)}
      </td>
      <td className="py-3 px-3 text-sm text-muted-foreground">
        {vehicle.GPSNumber ?? '—'}
      </td>
      <td className="py-3 px-3">
        <Badge
          className={`text-[11px] ${
            isActive
              ? 'bg-green-50 text-green-700 hover:bg-green-50'
              : 'bg-red-50 text-red-700 hover:bg-red-50'
          }`}
        >
          {vehicle.Status ?? 'Inactive'}
        </Badge>
      </td>
      <td className="py-3 pl-3 pr-4">
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2"
            onClick={() => onEdit(vehicle)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-red-100 px-2 text-red-500 hover:bg-red-50"
            onClick={() => onDelete(vehicle)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
function TransportManagement() {
  const [view, setView] = useState('cards')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openModal, setOpenModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  const { data: rawTransport, isLoading, isError } = useTransport()
  const { mutate: deleteTransport } = useDeleteTransport()

  const vehicles = rawTransport ?? []

  // Filtered list
  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        v.TransportNumber?.toLowerCase().includes(q) ||
        v.TransporterName?.toLowerCase().includes(q) ||
        v.OwnerName?.toLowerCase().includes(q) ||
        v.TransportType?.toLowerCase().includes(q) ||
        v.RouteName?.toLowerCase().includes(q) ||
        v.Route?.toLowerCase().includes(q) ||
        v.RouteName1?.toLowerCase().includes(q) ||
        v.Route1?.toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && v.Status?.toLowerCase() === 'active') ||
        (statusFilter === 'inactive' && v.Status?.toLowerCase() !== 'active')

      return matchesSearch && matchesStatus
    })
  }, [vehicles, search, statusFilter])

  // Stats
  const activeCount = vehicles.filter((v) => v.Status?.toLowerCase() === 'active').length
  const inactiveCount = vehicles.length - activeCount
  const totalRoutes = vehicles.reduce((acc, v) => acc + countRoutes(v), 0)
  const monthlyRevenue = vehicles
    .filter((v) => v.Status?.toLowerCase() === 'active')
    .reduce((acc, v) => acc + Number(v.Price ?? 0), 0)

  const onEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setOpenModal(true)
  }

  const onDelete = (vehicle) => {
    deleteTransport(vehicle.TransportID, {
      onSuccess: () => toast.success('Transport deleted successfully'),
      onError: () => toast.error('Failed to delete transport'),
    })
  }

  if (isLoading) return <CircleLoader />
  if (isError)
    return <p className="p-6 text-sm text-destructive">Error loading transport data.</p>

  return (
    <section className="p-6 space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-0.5 text-xs text-muted-foreground">School Management</p>
          <h1 className="text-2xl font-semibold">Transport management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadCSV(filtered)}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button
            onClick={() => {
              setEditingVehicle(null)
              setOpenModal(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add vehicle
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={Bus}
          label="Total vehicles"
          value={vehicles.length}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Active"
          value={activeCount}
          colorClass="bg-green-50 text-green-600"
        />
        <StatCard
          icon={XCircle}
          label="Inactive"
          value={inactiveCount}
          colorClass="bg-red-50 text-red-500"
        />
        <StatCard
          icon={MapPin}
          label="Total routes"
          value={totalRoutes}
          colorClass="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly revenue"
          value={`₹${Number(monthlyRevenue).toLocaleString('en-IN')}`}
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* View toggle */}
        <div className="flex w-fit gap-1 rounded-lg border border-border/50 bg-muted/40 p-1">
          <button
            onClick={() => setView('cards')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors
              ${
                view === 'cards'
                  ? 'bg-background font-medium text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Cards
          </button>
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors
              ${
                view === 'table'
                  ? 'bg-background font-medium text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <List className="h-3.5 w-3.5" /> Table
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vehicle, route, owner…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full pl-8 text-sm sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full text-sm sm:w-36">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Bus className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No vehicles found</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first vehicle to get started'}
          </p>
        </div>
      )}

      {/* ── Card view ── */}
      {view === 'cards' && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle, i) => (
            <VehicleCard
              key={vehicle.TransportID}
              vehicle={vehicle}
              index={i}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* ── Table view ── */}
      {view === 'table' && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border/50 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {[
                  'Vehicle',
                  'Type',
                  'Transporter',
                  'Owner',
                  'First route',
                  'Second route',
                  'Fee',
                  'GPS',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground first:pl-4 last:pr-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle, i) => (
                <VehicleTableRow
                  key={vehicle.TransportID}
                  vehicle={vehicle}
                  index={i}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      <AddTransportModal
        open={openModal}
        editingData={editingVehicle}
        onClose={() => {
          setOpenModal(false)
          setEditingVehicle(null)
        }}
      />
    </section>
  )
}

export default TransportManagement
