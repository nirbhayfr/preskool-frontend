import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCreateTransport, useUpdateTransport } from '@/hooks/useTransport'
import { Bus, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const TRANSPORT_TYPES = ['School Bus', 'Bus', 'Mini Bus', 'School Van', 'Auto']

const EMPTY_FORM = {
  TransportId: '',
  TransportNumber: '',
  TransportType: '',
  TransporterName: '',
  OwnerName: '',
  JoiningDate: '',
  GPSNumber: '',
  Description: '',
  Status: 'Active',
  route1Name: '',
  route1Route: '',
  route1Price: '',
  route2Name: '',
  route2Route: '',
}

function toInputDate(isoString) {
  if (!isoString) return ''
  return isoString.split('T')[0]
}

function generateTransportId() {
  return Math.floor(1000 + Math.random() * 9000) // 1000–9999
}

function vehicleToForm(vehicle) {
  if (!vehicle) return EMPTY_FORM

  return {
    TransportId: vehicle.TransportID || '',
    TransportNumber: vehicle.TransportNumber ?? '',
    TransportType: vehicle.TransportType ?? '',
    TransporterName: vehicle.TransporterName ?? '',
    OwnerName: vehicle.OwnerName ?? '',
    JoiningDate: toInputDate(vehicle.JoiningDate),
    GPSNumber: vehicle.GPSNumber ?? '',
    Description: vehicle.Description ?? '',
    Status: vehicle.Status ?? 'Active',

    // ✅ First Route
    route1Name: vehicle.RouteName ?? '',
    route1Route: vehicle.Route ?? '',

    // ✅ Second Route
    route2Name: vehicle.RouteName1 ?? '',
    route2Route: vehicle.Route1 ?? '',

    // ✅ Single price
    route1Price: vehicle.Price ?? '',
  }
}

function Field({ label, children, required }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}

function SectionTitle({ icon: Icon, label, color }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
  )
}

export default function AddTransportModal({ open, onClose, editingData }) {
  const isEdit = !!editingData

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const { mutate: addTransport, isPending: isAdding } = useCreateTransport()
  const { mutate: updateTransport, isPending: isUpdating } = useUpdateTransport()
  const isPending = isAdding || isUpdating

  console.log(editingData)

  useEffect(() => {
    if (open) {
      setForm(vehicleToForm(editingData))
      setErrors({})
    }
  }, [open, editingData])

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target?.value ?? e }))

  function validate() {
    const errs = {}
    if (!form.TransportNumber.trim()) errs.TransportNumber = 'Required'
    if (!form.TransportType) errs.TransportType = 'Required'
    if (!form.route1Name.trim()) errs.route1Name = 'Required'
    if (!form.route1Route.trim()) errs.route1Route = 'Required'
    if (!form.route2Name.trim()) errs.route2Name = 'Required'
    if (!form.route2Route.trim()) errs.route2Route = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function buildPayload() {
    return {
      transportId: form.TransportId || generateTransportId(),

      transportNumber: form.TransportNumber.trim(),
      transportType: form.TransportType,
      transporterName: form.TransporterName.trim() || 'N/A',
      ownerName: form.OwnerName.trim() || 'N/A',
      joiningDate: form.JoiningDate || null,
      gpsNumber: form.GPSNumber.trim() || null,
      description: form.Description.trim() || null,
      status: form.Status,

      // ✅ First Route
      routeName: form.route1Name.trim() || null,
      route: form.route1Route.trim() || null,

      // ✅ Second Route
      routeName1: form.route2Name.trim() || null,
      route1: form.route2Route.trim() || null,

      // ⚠️ Single price (based on your backend)
      price: form.route1Price !== '' ? Number(form.route1Price) : null,
    }
  }

  async function handleSubmit() {
    if (!validate()) return

    const payload = buildPayload()

    if (isEdit) {
      updateTransport(
        { id: form.TransportId, data: payload },
        {
          onSuccess: () => {
            toast.success('Transport updated successfully')
            onClose()
          },
          onError: () => toast.error('Failed to update transport'),
        }
      )
    } else {
      addTransport(payload, {
        onSuccess: () => {
          toast.success('Transport added successfully')
          onClose()
        },
        onError: () => toast.error('Failed to add transport'),
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto px-7 pb-12">
        {/* Header */}
        <SheetHeader className="mb-8 pt-1">
          <SheetTitle className="flex items-center gap-3 text-base">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bus className="h-4 w-4" />
            </div>
            {isEdit ? 'Edit vehicle' : 'Add new vehicle'}
          </SheetTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Each vehicle gets two routes — a first and a second route (e.g. morning &
            evening).
          </p>
        </SheetHeader>

        <div className="space-y-8">
          {/* Vehicle details */}
          <div className="space-y-5">
            <SectionTitle
              icon={Bus}
              label="Vehicle details"
              color="bg-blue-50 text-blue-700"
            />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Vehicle number" required>
                <Input
                  placeholder="e.g. DL01AB1234"
                  value={form.TransportNumber}
                  onChange={set('TransportNumber')}
                  disabled={isEdit}
                  className={errors.TransportNumber ? 'border-destructive' : ''}
                />
                {errors.TransportNumber && (
                  <p className="mt-1 text-[11px] text-destructive">
                    {errors.TransportNumber}
                  </p>
                )}
              </Field>

              <Field label="Vehicle type" required>
                <Select value={form.TransportType} onValueChange={set('TransportType')}>
                  <SelectTrigger
                    className={errors.TransportType ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.TransportType && (
                  <p className="mt-1 text-[11px] text-destructive">
                    {errors.TransportType}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Transporter name">
                <Input
                  placeholder="e.g. Delhi School Transport"
                  value={form.TransporterName}
                  onChange={set('TransporterName')}
                />
              </Field>
              <Field label="Owner name">
                <Input
                  placeholder="e.g. Ramesh Kumar"
                  value={form.OwnerName}
                  onChange={set('OwnerName')}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="GPS number">
                <Input
                  placeholder="e.g. GPS-778899"
                  value={form.GPSNumber}
                  onChange={set('GPSNumber')}
                />
              </Field>
              <Field label="Joining date">
                <Input
                  type="date"
                  value={form.JoiningDate}
                  onChange={set('JoiningDate')}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <Select value={form.Status} onValueChange={set('Status')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Description">
                <Input
                  placeholder="Optional note"
                  value={form.Description}
                  onChange={set('Description')}
                />
              </Field>
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* First route */}
          <div className="space-y-5">
            <SectionTitle icon={Sun} label="First route" color="bg-sky-50 text-sky-700" />

            {/* <p className="text-[11px] text-muted-foreground">
              Saved as{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                {form.route1Name ? `${form.route1Name}-first` : '<name>-first'}
              </code>
            </p> */}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Route name" required>
                <Input
                  placeholder="e.g. Rohini Route"
                  value={form.route1Name}
                  onChange={set('route1Name')}
                  className={errors.route1Name ? 'border-destructive' : ''}
                />
                {errors.route1Name && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.route1Name}</p>
                )}
              </Field>
              <Field label="Monthly fee (₹)">
                <Input
                  type="number"
                  placeholder="e.g. 2500"
                  value={form.route1Price}
                  onChange={set('route1Price')}
                  min={0}
                />
              </Field>
            </div>

            <Field label="Route / area" required>
              <Input
                placeholder="e.g. North Delhi"
                value={form.route1Route}
                onChange={set('route1Route')}
                className={errors.route1Route ? 'border-destructive' : ''}
              />
              {errors.route1Route && (
                <p className="mt-1 text-[11px] text-destructive">{errors.route1Route}</p>
              )}
            </Field>
          </div>

          <div className="h-px bg-border/40" />

          {/* Second route */}
          <div className="space-y-5">
            <SectionTitle
              icon={Moon}
              label="Second route"
              color="bg-indigo-50 text-indigo-700"
            />

            {/* <p className="text-[11px] text-muted-foreground">
              Saved as{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                {form.route2Name ? `${form.route2Name}-second` : '<name>-second'}
              </code>
            </p> */}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Route name" required>
                <Input
                  placeholder="e.g. Rohini Route"
                  value={form.route2Name}
                  onChange={set('route2Name')}
                  className={errors.route2Name ? 'border-destructive' : ''}
                />
                {errors.route2Name && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.route2Name}</p>
                )}
              </Field>
            </div>

            <Field label="Route / area" required>
              <Input
                placeholder="e.g. North Delhi"
                value={form.route2Route}
                onChange={set('route2Route')}
                className={errors.route2Route ? 'border-destructive' : ''}
              />
              {errors.route2Route && (
                <p className="mt-1 text-[11px] text-destructive">{errors.route2Route}</p>
              )}
            </Field>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-border/40 pt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isPending}>
              {isPending
                ? isEdit
                  ? 'Saving…'
                  : 'Adding…'
                : isEdit
                  ? 'Save changes'
                  : 'Add vehicle'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
