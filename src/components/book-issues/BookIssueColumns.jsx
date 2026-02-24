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

export const bookIssuesColumns = (onDelete, onEdit) => [
  {
    accessorKey: 'BookTitle',
    header: 'Book',
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
    accessorKey: 'FineAmount',
    header: 'Fine',
    cell: ({ row }) => `₹ ${row.original.FineAmount}`,
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
