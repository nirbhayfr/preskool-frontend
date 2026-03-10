import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateTransport, useUpdateTransport } from '@/hooks/useTransport'
import { toast } from 'sonner'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

function AddTransportModal({ open, onClose, editingData }) {
  const { mutate: createTransport } = useCreateTransport()
  const { mutate: updateTransport } = useUpdateTransport()

  const initialState = {
    TransportID: '',
    TransportNumber: '',
    TransportType: '',
    TransporterName: '',
    OwnerName: '',
    JoiningDate: '',
    GPSNumber: '',
    RouteName: '',
    Route: '',
    Price: '',
    Description: '',
    Status: 'Active',
  }

  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (editingData) {
      setForm({
        ...initialState,
        ...editingData,
        JoiningDate: editingData.JoiningDate?.split('T')[0],
      })
    } else {
      setForm(initialState)
    }
  }, [editingData, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    const payload = {
      transportId: form.TransportID,
      transportNumber: form.TransportNumber,
      transportType: form.TransportType,
      transporterName: form.TransporterName,
      ownerName: form.OwnerName,
      joiningDate: form.JoiningDate,
      gpsNumber: form.GPSNumber,
      routeName: form.RouteName,
      route: form.Route,
      price: Number(form.Price) || 0,
      description: form.Description,
      status: form.Status,
    }

    if (editingData) {
      updateTransport(
        {
          id: editingData.TransportID,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success('Transport updated successfully')
            onClose()
          },
          onError: () => {
            toast.error('Failed to update transport')
          },
        }
      )
    } else {
      createTransport(payload, {
        onSuccess: () => {
          toast.success('Transport created successfully')
          onClose()
        },
        onError: () => {
          toast.error('Failed to create transport')
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingData ? 'Edit Transport' : 'Add Transport'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            name="TransportID"
            placeholder="Transport ID"
            value={form.TransportID}
            onChange={handleChange}
            disabled={!!editingData}
          />

          <Input
            name="TransportNumber"
            placeholder="Transport Number (BUS-12)"
            value={form.TransportNumber}
            onChange={handleChange}
          />

          <Input
            name="TransportType"
            placeholder="Transport Type (Bus / Van)"
            value={form.TransportType}
            onChange={handleChange}
          />

          <Input
            name="TransporterName"
            placeholder="Transporter Name"
            value={form.TransporterName}
            onChange={handleChange}
          />

          <Input
            name="OwnerName"
            placeholder="Owner Name"
            value={form.OwnerName}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="JoiningDate"
            value={form.JoiningDate}
            onChange={handleChange}
          />

          <Input
            name="GPSNumber"
            placeholder="GPS Number"
            value={form.GPSNumber}
            onChange={handleChange}
          />

          <Input
            name="RouteName"
            placeholder="Route Name (e.g. Rohini Route)"
            value={form.RouteName}
            onChange={handleChange}
          />

          <Input
            name="Route"
            placeholder="Route Path (Sector → School)"
            value={form.Route}
            onChange={handleChange}
          />

          <Input
            type="number"
            name="Price"
            placeholder="Transport Fee"
            value={form.Price}
            onChange={handleChange}
          />

          <Input
            name="Description"
            placeholder="Description"
            value={form.Description}
            onChange={handleChange}
          />

          <Select
            value={form.Status}
            onValueChange={(value) => setForm((prev) => ({ ...prev, Status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit}>{editingData ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddTransportModal
