import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { useCreateFeeInventory, useUpdateFeeInventory } from '@/hooks/useFeeInventory'
import { classes } from '@/data/basicData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

function AddFeeInventoryModal({ open, onClose, editingData }) {
  const { mutate: createMutate, isPending: isCreating } = useCreateFeeInventory()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateFeeInventory()
  const isEdit = Boolean(editingData)

  const [form, setForm] = useState({
    fee_id: '',
    class: '',
    fee_type: '',
    price: '',
    academic_year: '',
  })

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      price: Number(form.price),
    }

    if (editingData) {
      // EDIT
      updateMutate(
        { id: editingData.fee_id, data: payload },
        {
          onSuccess: () => {
            onClose()
            setForm({
              fee_id: '',
              class: '',
              fee_type: '',
              price: '',
              academic_year: '',
            })
          },
        }
      )
    } else {
      // ADD
      createMutate(payload, {
        onSuccess: () => {
          onClose()
          setForm({
            fee_id: '',
            class: '',
            fee_type: '',
            price: '',
            academic_year: '',
          })
        },
      })
    }
  }

  useEffect(() => {
    if (editingData) {
      setForm({
        fee_id: editingData.fee_id,
        class: editingData.class,
        fee_type: editingData.fee_type,
        price: editingData.price,
        academic_year: editingData.academic_year,
      })
    } else {
      setForm({
        fee_id: '',
        class: '',
        fee_type: '',
        price: '',
        academic_year: '',
      })
    }
  }, [editingData])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Fee Inventory' : 'Add Fee Inventory'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Edit Fee Inventory' : 'Add Fee Inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Fee ID</Label>
            <Input
              name="fee_id"
              value={form.fee_id}
              onChange={onChange}
              required
              disabled={isEdit}
            />
          </div>

          <div className="space-y-1">
            <Label>Class</Label>

            <Select
              value={form.class}
              onValueChange={(value) => setForm({ ...form, class: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>

              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Fee Type</Label>
            <Input name="fee_type" value={form.fee_type} onChange={onChange} required />
          </div>

          <div className="space-y-1">
            <Label>Price</Label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Academic Year</Label>
            <Input
              name="academic_year"
              value={form.academic_year}
              onChange={onChange}
              placeholder="2025-2026"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : editingData ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFeeInventoryModal
