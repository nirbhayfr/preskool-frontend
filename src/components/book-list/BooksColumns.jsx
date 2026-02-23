import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteBook } from '@/hooks/useBook'
import { toast } from 'sonner'

export const booksColumns = (onEdit) => [
  {
    accessorKey: 'BookTitle',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.BookTitle}</div>,
  },
  {
    accessorKey: 'AuthorName',
    header: 'Author',
  },
  {
    accessorKey: 'BookImage',
    header: '',
    size: 70, // if using tanstack table
    cell: ({ row }) => {
      const { BookImage, BookTitle } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        BookTitle || 'Book'
      )}&background=random&color=fff&size=128`

      return (
        <div className="w-[60px] min-w-[60px] flex justify-center shrink-0">
          <img
            src={BookImage || avatarUrl}
            alt={BookTitle}
            className="h-12 w-10 object-cover rounded-xs border"
            onError={(e) => {
              e.currentTarget.src = avatarUrl
            }}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'Category',
    header: 'Category',
  },
  {
    accessorKey: 'PublishYear',
    header: 'Year',
  },
  {
    header: 'Copies',
    cell: ({ row }) => {
      const { TotalCopies, AvailableCopies, IssuedCopies } = row.original

      return (
        <div className="text-sm">
          <div>Total: {TotalCopies}</div>
          <div className="text-green-600">Available: {AvailableCopies}</div>
          <div className="text-red-600">Issued: {IssuedCopies}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.Status

      return (
        <Badge
          variant="outline"
          className={
            status === 'Available'
              ? 'border-green-500 text-green-600'
              : 'border-red-500 text-red-600'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
      const deleteMutation = useDeleteBook()

      const handleDelete = async () => {
        try {
          await deleteMutation.mutateAsync(row.original.BookId)
          toast.success('Book deleted successfully')
          setOpen(false)
        } catch {
          toast.error('Failed to delete book')
        }
      }

      return (
        <div className="flex gap-2">
          {/* Edit */}
          <Button size="icon" variant="outline" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete with Confirmation */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <Button size="icon" variant="destructive" onClick={() => setOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this book.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]
