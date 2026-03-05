import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateTransport, useUpdateTransport } from '@/hooks/useTransport'
import { toast } from 'sonner'

function AddTransportModal({ open, onClose, editingData }) {
  const { mutate: createTransport } = useCreateTransport()
  const { mutate: updateTransport } = useUpdateTransport()

  const [form, setForm] = useState({
    TransportNumber: '',
    TransportType: '',
    TransporterName: '',
    OwnerName: '',
    JoiningDate: '',
    GPSNumber: '',
    Route: '',
    Description: '',
    Status: 'Active',
  })

  useEffect(() => {
    if (editingData) {
      setForm({
        ...editingData,
        JoiningDate: editingData.JoiningDate?.split('T')[0],
      })
    } else {
      setForm({
        TransportNumber: '',
        TransportType: '',
        TransporterName: '',
        OwnerName: '',
        JoiningDate: '',
        GPSNumber: '',
        Route: '',
        Description: '',
        Status: 'Active',
      })
    }
  }, [editingData])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    const payload = {
      transportNumber: form.TransportNumber,
      transportType: form.TransportType,
      transporterName: form.TransporterName,
      ownerName: form.OwnerName,
      joiningDate: form.JoiningDate,
      gpsNumber: form.GPSNumber,
      route: form.Route,
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
            name="TransportNumber"
            placeholder="Transport Number e.g., BUS-12"
            value={form.TransportNumber}
            onChange={handleChange}
          />

          <Input
            name="TransportType"
            placeholder="Transport Type"
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
            name="Route"
            placeholder="Route"
            value={form.Route}
            onChange={handleChange}
          />

          <Input
            name="Description"
            placeholder="Description"
            value={form.Description}
            onChange={handleChange}
          />

          <Input
            name="Status"
            placeholder="Status"
            value={form.Status}
            onChange={handleChange}
          />

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
