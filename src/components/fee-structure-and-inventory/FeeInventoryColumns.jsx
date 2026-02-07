import { createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash } from 'lucide-react'

const columnHelper = createColumnHelper()

export const feeInventoryColumns = ({ onEdit, onDelete }) => [
  columnHelper.accessor('fee_id', {
    header: 'Fee ID',
    cell: (info) => <span className="font-medium text-primary">{info.getValue()}</span>,
  }),

  columnHelper.accessor('class', {
    header: 'Class',
    cell: (info) => `Class ${info.getValue()}`,
  }),

  columnHelper.accessor('fee_type', {
    header: 'Fee Type',
  }),

  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('academic_year', {
    header: 'Academic Year',
  }),

  // ✅ Actions
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const original = row.original

      return (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <Button size="icon" variant="outline" onClick={() => onEdit(original)}>
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete fee?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(original.fee_id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  }),
]
