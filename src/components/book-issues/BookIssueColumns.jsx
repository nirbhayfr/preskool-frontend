// components/book-issues/BookIssuesColumns.jsx

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
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const bookIssuesColumns = (onDelete, onEdit) => [
  {
    accessorKey: 'BookTitle',
    header: 'Book',
  },

  {
    accessorKey: 'IssuedToId',
    header: 'Issued To ID',
    cell: ({ row }) => (
      <Link
        to={`/student-details/${row.original.IssuedToId}`}
        className="text-primary font-medium"
      >
        {row.original.IssuedToId}
      </Link>
    ),
  },

  {
    accessorKey: 'IssuedToType',
    header: 'Type',
  },

  {
    accessorKey: 'IssueDate',
    header: 'Issue Date',
    cell: ({ row }) => new Date(row.original.IssueDate).toLocaleDateString(),
  },

  {
    accessorKey: 'DueDate',
    header: 'Due Date',
    cell: ({ row }) => new Date(row.original.DueDate).toLocaleDateString(),
  },

  {
    accessorKey: 'ReturnDate',
    header: 'Return Date',
    cell: ({ row }) => {
      const returnDate = row.original.ReturnDate

      if (!returnDate) {
        return <span className="text-muted-foreground">—</span>
      }

      return new Date(returnDate).toLocaleDateString()
    },
  },

  {
    accessorKey: 'FineAmount',
    header: 'Fine',
    cell: ({ row }) => `₹ ${row.original.FineAmount}`,
  },

  // ✅ NEW — Fine Paid Status (only if fine > 0)
  {
    id: 'FinePaidStatus',
    header: 'Fine Status',
    cell: ({ row }) => {
      const { FineAmount, FinePaid } = row.original

      if (!FineAmount || Number(FineAmount) === 0) {
        return <span className="text-muted-foreground">—</span>
      }

      return (
        <Badge
          variant="outline"
          className={
            FinePaid ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
          }
        >
          {FinePaid ? 'Paid' : 'Unpaid'}
        </Badge>
      )
    },
  },

  {
    accessorKey: 'IssueStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.IssueStatus

      return (
        <Badge
          variant="outline"
          className={
            status === 'Issued'
              ? 'border-yellow-500 text-yellow-600'
              : 'border-green-500 text-green-600'
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

      return (
        <div className="flex gap-2">
          {/* Edit */}
          <Button size="icon" variant="outline" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <Button size="icon" variant="destructive" onClick={() => setOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this issue.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    onDelete(row.original.IssueId)
                    setOpen(false)
                  }}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]
