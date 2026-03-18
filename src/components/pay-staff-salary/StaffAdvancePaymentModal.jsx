// components/staff-salary/StaffAdvancePaymentModal.jsx

import { useState } from 'react'
import { useCreatePayment } from '@/hooks/usePayment'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { PlusCircle } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import AdvanceSlipPDF from '../pdfs/AdvanceSlipPDF'

const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Cheque']

const generateReferenceNo = () => {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ADV-${timestamp}-${random}`
}

const getToday = () => new Date().toISOString().slice(0, 10)

function StaffAdvancePaymentModal({ staffId, staff }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    totalAmount: '',
    paymentMethod: '',
    paymentDate: getToday(),
    referenceNo: generateReferenceNo(),
    remarks: '',
  })

  const { mutate: createPayment, isPending } = useCreatePayment()

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const resetForm = () =>
    setForm({
      totalAmount: '',
      paymentMethod: '',
      paymentDate: getToday(),
      referenceNo: generateReferenceNo(),
      remarks: '',
    })

  // Map staff object to the shape AdvanceSlipPDF expects (same as teacher)
  const staffAsTeacher = {
    FullName: staff?.FullName,
    TeacherID: staff?.StaffID,
    Subject: staff?.Role,
    Salary: staff?.Salary,
    ProfilePhoto: staff?.ProfilePhoto || staff?.ProfilePictureUrl,
  }

  const handleSubmit = () => {
    if (!form.totalAmount || !form.paymentMethod) {
      toast.error('Please fill in all required fields')
      return
    }

    createPayment(
      {
        personType: 'staff',
        personId: staffId,
        paymentCategory: 'Advance',
        totalAmount: Number(form.totalAmount),
        paymentMethod: form.paymentMethod,
        paymentDate: new Date(form.paymentDate).toISOString(),
        referenceNo: form.referenceNo,
        remarks: form.remarks || null,
      },
      {
        onSuccess: async () => {
          toast.success('Advance payment recorded')
          setOpen(false)

          try {
            const payment = {
              TotalAmount: Number(form.totalAmount),
              PaymentMethod: form.paymentMethod,
              PaymentDate: new Date(form.paymentDate).toISOString(),
              ReferenceNo: form.referenceNo,
              Remarks: form.remarks || null,
              PaymentStatus: 'Pending',
              PaymentCategory: 'Advance',
            }
            const blob = await pdf(
              <AdvanceSlipPDF teacher={staffAsTeacher} payment={payment} />
            ).toBlob()
            const url = URL.createObjectURL(blob)
            window.open(url)
          } catch (err) {
            console.error('Failed to print advance slip', err)
          }

          resetForm()
        },
        onError: () => toast.error('Failed to record payment'),
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="size-4 mr-2" />
          Pay Advance
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay in Advance</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Person Type</Label>
              <Input value="Staff" disabled />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Payment Category</Label>
              <Input value="Advance" disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Payment Date</Label>
              <Input value={form.paymentDate} disabled />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Reference No</Label>
              <Input value={form.referenceNo} disabled />
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>
              Amount (₹) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              min="0"
              step="100"
              placeholder="e.g. 5000"
              value={form.totalAmount}
              onChange={(e) => set('totalAmount', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              Payment Method <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.paymentMethod}
              onValueChange={(v) => set('paymentMethod', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>
              Remarks <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              placeholder="Any notes..."
              rows={2}
              value={form.remarks}
              onChange={(e) => set('remarks', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Saving...' : 'Record Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StaffAdvancePaymentModal
