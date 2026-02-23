'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AddByIsbnModal({ open, onClose, onSubmit }) {
  const [isbn, setIsbn] = useState('')
  const [bookData, setBookData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const searchBook = async () => {
    if (!isbn) return

    setLoading(true)
    setError('')
    setBookData(null)

    try {
      const res = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      )

      const data = await res.json()
      const key = `ISBN:${isbn}`

      if (data[key]) {
        setBookData(data[key])
      } else {
        setError('No results found')
      }
    } catch {
      setError('Error fetching book data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToInventory = async () => {
    if (!bookData) return

    setAdding(true)

    try {
      const payload = {
        ISBN: isbn,
        BookTitle: bookData.title || '',
        AuthorName: bookData.authors?.map((a) => a.name).join(', ') || '',
        PublisherName: bookData.publishers?.map((p) => p.name).join(', ') || '',
        Category: bookData.subjects?.[0]?.name || '',
        Language: bookData.languages?.[0]?.key?.split('/').pop() || '',
        Edition: '',
        PublishYear: bookData.publish_date?.match(/\d{4}/)?.[0] || '',
        TotalCopies: 1,
        AvailableCopies: 1,
        IssuedCopies: 0,
        RackLocation: '',
        PurchaseDate: '',
        PurchasePrice: '',
        VendorName: '',
        Status: 'Available',
      }

      await onSubmit(payload)

      toast.success('Book added to inventory')
      setBookData(null)
      setIsbn('')
      onClose()
    } catch {
      toast.error('Failed to add book')
    } finally {
      setAdding(false)
    }
  }

  console.log(bookData?.cover)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Book by ISBN</DialogTitle>
          <DialogDescription>Add Books By ISBN Number</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* ISBN Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter ISBN number (No Spaces)"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <Button onClick={searchBook} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <Spinner className="size-12" />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Book Preview */}
          {bookData && (
            <Card className="p-4 space-y-3">
              {bookData.cover?.medium && (
                <img
                  src={bookData.cover.medium}
                  alt={bookData.title}
                  className="w-24 mx-auto"
                />
              )}

              <h3 className="font-semibold text-center">{bookData.title}</h3>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Author:</strong>{' '}
                  {bookData.authors?.map((a) => a.name).join(', ') || 'N/A'}
                </p>
                <p>
                  <strong>Publisher:</strong>{' '}
                  {bookData.publishers?.map((p) => p.name).join(', ') || 'N/A'}
                </p>
                <p>
                  <strong>Publish Year:</strong> {bookData.publish_date || 'N/A'}
                </p>
              </div>

              <Button className="w-full" onClick={handleAddToInventory} disabled={adding}>
                {adding ? 'Adding...' : 'Add to Inventory'}
              </Button>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
