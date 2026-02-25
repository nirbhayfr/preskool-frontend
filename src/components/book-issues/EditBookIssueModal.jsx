// components/book-issues/EditBookIssueModal.jsx

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function EditBookIssueModal({ open, onClose, issue, onSubmit, loading }) {
  const [formData, setFormData] = useState(null)

  // Load full issue object (including IDs)
  useEffect(() => {
    if (issue) {
      setFormData({
        ...issue, // keep ALL original fields including IDs

        // override editable fields with formatted values
        IssueDate: issue.IssueDate?.split('T')[0] || '',
        DueDate: issue.DueDate?.split('T')[0] || '',
        ReturnDate: issue.ReturnDate ? issue.ReturnDate.split('T')[0] : '',
        FineAmount: issue.FineAmount || 0,
        FinePaid: issue.FinePaid || false,
        IssueStatus: issue.IssueStatus || 'Issued',
        Remarks: issue.Remarks || '',
      })
    }
  }, [issue])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = () => {
    if (!formData) return

    const payload = {
      issueId: formData.IssueId,
      bookId: formData.BookId,
      issuedToId: formData.IssuedToId,
      issuedToType: formData.IssuedToType,

      issueDate: formData.IssueDate,
      dueDate: formData.DueDate,
      returnDate: formData.ReturnDate || null,
      fineAmount: Number(formData.FineAmount),
      finePaid: formData.FinePaid,
      issueStatus: formData.IssueStatus,
      remarks: formData.Remarks,
    }

    onSubmit(payload)
  }

  if (!formData) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Book Issue</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Issue Date</Label>
            <Input
              type="date"
              name="IssueDate"
              value={formData.IssueDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Due Date</Label>
            <Input
              type="date"
              name="DueDate"
              value={formData.DueDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Return Date</Label>
            <Input
              type="date"
              name="ReturnDate"
              value={formData.ReturnDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Fine Amount</Label>
            <Input
              type="number"
              name="FineAmount"
              value={formData.FineAmount}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="FinePaid"
              checked={formData.FinePaid}
              onChange={handleChange}
            />
            <Label>Fine Paid</Label>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={formData.IssueStatus}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  IssueStatus: value,
                }))
              }
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Issued">Issued</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Remarks</Label>
            <Input name="Remarks" value={formData.Remarks} onChange={handleChange} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
