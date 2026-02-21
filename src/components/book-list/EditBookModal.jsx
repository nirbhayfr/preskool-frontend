import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function EditBookModal({ open, onClose, book, onSubmit, loading }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (book) setForm(book)
  }, [book])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSubmit(form)
  }

  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Book Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="BookTitle">Book Title</Label>
            <Input
              id="BookTitle"
              name="BookTitle"
              value={form.BookTitle || ''}
              onChange={handleChange}
            />
          </div>

          {/* Author */}
          <div className="grid gap-1.5">
            <Label htmlFor="AuthorName">Author Name</Label>
            <Input
              id="AuthorName"
              name="AuthorName"
              value={form.AuthorName || ''}
              onChange={handleChange}
            />
          </div>

          {/* Total Copies */}
          <div className="grid gap-1.5">
            <Label htmlFor="TotalCopies">Total Copies</Label>
            <Input
              id="TotalCopies"
              name="TotalCopies"
              type="number"
              value={form.TotalCopies || 0}
              onChange={handleChange}
            />
          </div>

          {/* Available Copies */}
          <div className="grid gap-1.5">
            <Label htmlFor="AvailableCopies">Available Copies</Label>
            <Input
              id="AvailableCopies"
              name="AvailableCopies"
              type="number"
              value={form.AvailableCopies || 0}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
