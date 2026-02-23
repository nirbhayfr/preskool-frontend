import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function AddBookModal({ open, onClose, onSubmit, loading }) {
  const initialState = {
    ISBN: '',
    BookTitle: '',
    AuthorName: '',
    PublisherName: '',
    Category: '',
    Language: '',
    Edition: '',
    PublishYear: '',
    TotalCopies: '',
    AvailableCopies: '',
    IssuedCopies: 0,
    RackLocation: '',
    PurchaseDate: '',
    PurchasePrice: '',
    VendorName: '',
    Status: 'Available',
  }

  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (!open) {
      setFormData(initialState)
    }
  }, [open])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: ['TotalCopies', 'AvailableCopies', 'PublishYear', 'PurchasePrice'].includes(
        name
      )
        ? value === ''
          ? ''
          : Number(value)
        : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
        >
          {/* ISBN */}
          <div>
            <Label>ISBN *</Label>
            <Input name="ISBN" value={formData.ISBN} onChange={handleChange} required />
          </div>

          {/* Title */}
          <div>
            <Label>Book Title *</Label>
            <Input
              name="BookTitle"
              value={formData.BookTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Author */}
          <div>
            <Label>Author *</Label>
            <Input
              name="AuthorName"
              value={formData.AuthorName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Publisher */}
          <div>
            <Label>Publisher</Label>
            <Input
              name="PublisherName"
              value={formData.PublisherName}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Input name="Category" value={formData.Category} onChange={handleChange} />
          </div>

          {/* Language */}
          <div>
            <Label>Language</Label>
            <Input name="Language" value={formData.Language} onChange={handleChange} />
          </div>

          {/* Publish Year */}
          <div>
            <Label>Publish Year</Label>
            <Input
              type="number"
              name="PublishYear"
              value={formData.PublishYear}
              onChange={handleChange}
            />
          </div>

          {/* Total Copies */}
          <div>
            <Label>Total Copies *</Label>
            <Input
              type="number"
              name="TotalCopies"
              value={formData.TotalCopies}
              onChange={handleChange}
              required
            />
          </div>

          {/* Available Copies */}
          <div>
            <Label>Available Copies *</Label>
            <Input
              type="number"
              name="AvailableCopies"
              value={formData.AvailableCopies}
              onChange={handleChange}
              required
            />
          </div>

          {/* Rack */}
          <div>
            <Label>Rack Location</Label>
            <Input
              name="RackLocation"
              value={formData.RackLocation}
              onChange={handleChange}
            />
          </div>

          {/* Purchase Date */}
          <div>
            <Label>Purchase Date</Label>
            <Input
              type="date"
              name="PurchaseDate"
              value={formData.PurchaseDate}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div>
            <Label>Purchase Price</Label>
            <Input
              type="number"
              step="0.01"
              name="PurchasePrice"
              value={formData.PurchasePrice}
              onChange={handleChange}
            />
          </div>

          {/* Vendor */}
          <div>
            <Label>Vendor</Label>
            <Input
              name="VendorName"
              value={formData.VendorName}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-full flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
