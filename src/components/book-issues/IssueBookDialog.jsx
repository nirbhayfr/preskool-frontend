import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useBooks } from '@/hooks/useBook'
import { useCreateBookIssue } from '@/hooks/useBookIssues'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'

import { CircleLoader } from '../layout/RouteLoader'
import { decryptData } from '@/utils/crypto'
import { toast } from 'sonner'

function IssueBookDialog({ student, open, onClose }) {
  const encryptedUser = localStorage.getItem('user')
  const user = encryptedUser ? decryptData(encryptedUser) : null

  const { data: booksResponse, isLoading, error } = useBooks()
  const { mutate: createBookIssue } = useCreateBookIssue()

  const books = booksResponse?.data || []

  const [selectedBook, setSelectedBook] = useState(null)
  const [openSelect, setOpenSelect] = useState(false)

  const [formData, setFormData] = useState({
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: '',
    remarks: '',
  })

  // Reset on open
  useEffect(() => {
    if (open) {
      setSelectedBook(null)
      setFormData({
        issueDate: format(new Date(), 'yyyy-MM-dd'),
        dueDate: '',
        remarks: '',
      })
    }
  }, [open])

  const availableBooks = books.filter(
    (b) => b.AvailableCopies > 0 && b.Status === 'Available'
  )

  const handleSubmit = () => {
    if (!student?.StudentID) return toast.error('Invalid student')
    if (!selectedBook) return toast.error('Select a book')

    const payload = {
      bookId: selectedBook.BookId,
      issuedToId: student.StudentID,
      issuedToType: 'Student',
      issueDate: formData.issueDate,
      dueDate: formData.dueDate || null,
      returnDate: null,
      fineAmount: 0,
      finePaid: false,
      issueStatus: 'Issued',
      remarks: formData.remarks || null,
      createdBy: user?.Role || 'Admin',
    }

    createBookIssue(payload, {
      onSuccess: () => {
        toast.success('Book issued successfully')
        onClose()
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to issue book')
      },
    })
  }

  if (isLoading) return <CircleLoader />
  if (error) return <div>Error loading books</div>

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Issue Book to {student?.FullName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info */}
          <div className="text-sm bg-muted p-3 rounded-md">
            <p>
              <strong>Student ID:</strong> {student?.StudentID || '-'}
            </p>
            <p>
              <strong>Name:</strong> {student?.FullName}
            </p>
            <p>
              <strong>Status:</strong> {student?.Status || 'Inactive'}
            </p>
          </div>

          {/* Book Select */}
          <div>
            <label className="text-sm font-medium">Select Book</label>

            <Popover open={openSelect} onOpenChange={setOpenSelect}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedBook ? selectedBook.BookTitle : 'Search book...'}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-full">
                <Command>
                  <CommandInput placeholder="Type to search..." />
                  <CommandEmpty>No books found.</CommandEmpty>

                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {availableBooks.map((book) => (
                      <CommandItem
                        key={book.BookId}
                        value={book.BookTitle}
                        onSelect={() => {
                          setSelectedBook(book)
                          setOpenSelect(false)
                        }}
                      >
                        <div className="flex flex-col">
                          <span>{book.BookTitle}</span>
                          <span className="text-xs text-muted-foreground">
                            {book.AuthorName} • Available: {book.AvailableCopies}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Issue Date */}
          <div>
            <label className="text-sm font-medium">Issue Date</label>
            <Input
              type="date"
              value={formData.issueDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  issueDate: e.target.value,
                }))
              }
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              min={formData.issueDate}
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dueDate: e.target.value,
                }))
              }
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="text-sm font-medium">Remarks</label>
            <Input
              placeholder="Optional notes..."
              value={formData.remarks}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Issue Book</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default IssueBookDialog
