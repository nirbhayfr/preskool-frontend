import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

import { useCreateInventory, useUpdateInventory } from '@/hooks/useInventory'

export function AddEditInventoryDialog({ item, onClose }) {
  const isEdit = !!item?.InventoryId

  const { mutate: createInventory, isPending: isCreating } = useCreateInventory()
  const { mutate: updateInventory, isPending: isUpdating } = useUpdateInventory()

  const [form, setForm] = useState({
    itemName: '',
    category: '',
    quantity: '',
    vendorName: '',
    purchaseDate: '',
    purchasePrice: '',
    location: '',
    condition: '',
    lastMaintenanceDate: '',
    status: 'Active',
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        itemName: item.ItemName ?? '',
        category: item.Category ?? '',
        quantity: item.Quantity ?? '',
        vendorName: item.VendorName ?? '',
        purchaseDate: item.PurchaseDate ? item.PurchaseDate.split('T')[0] : '',
        purchasePrice: item.PurchasePrice ?? '',
        location: item.Location ?? '',
        condition: item.Condition ?? '',
        lastMaintenanceDate: item.LastMaintenanceDate
          ? item.LastMaintenanceDate.split('T')[0]
          : '',
        status: item.Status ?? 'Active',
      })
    }
  }, [item, isEdit])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    // Map camelCase → Backend format
    const payload = {
      itemName: form.itemName,
      category: form.category,
      quantity: Number(form.quantity),
      vendorName: form.vendorName,
      purchaseDate: form.purchaseDate || null,
      purchasePrice: Number(form.purchasePrice),
      location: form.location,
      condition: form.condition,
      lastMaintenanceDate: form.lastMaintenanceDate || null,
      status: form.status,
    }

    if (isEdit) {
      updateInventory(
        { id: item.InventoryId, data: payload },
        {
          onSuccess: () => {
            toast.success('Inventory updated successfully')
            onClose()
          },
          onError: () => toast.error('Failed to update inventory'),
        }
      )
    } else {
      createInventory(payload, {
        onSuccess: () => {
          toast.success('Inventory added successfully')
          onClose()
        },
        onError: () => toast.error('Failed to add inventory'),
      })
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Inventory Item' : 'Add Inventory Item'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Edit' : 'Add'} items in school inventory
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Item Name</Label>
            <Input
              value={form.itemName}
              onChange={(e) => handleChange('itemName', e.target.value)}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Input
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={form.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
            />
          </div>

          <div>
            <Label>Purchase Price</Label>
            <Input
              type="number"
              value={form.purchasePrice}
              onChange={(e) => handleChange('purchasePrice', e.target.value)}
            />
          </div>

          <div>
            <Label>Vendor Name</Label>
            <Input
              value={form.vendorName}
              onChange={(e) => handleChange('vendorName', e.target.value)}
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div>
            <Label>Purchase Date</Label>
            <Input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => handleChange('purchaseDate', e.target.value)}
            />
          </div>

          <div>
            <Label>Last Maintenance Date</Label>
            <Input
              type="date"
              value={form.lastMaintenanceDate}
              onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
            />
          </div>

          <div>
            <Label>Condition</Label>
            <Input
              value={form.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) => handleChange('status', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner /> : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
