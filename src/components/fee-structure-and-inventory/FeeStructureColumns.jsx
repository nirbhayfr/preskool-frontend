// feeStructureColumns.ts
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

const months = [
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
  'jan',
  'feb',
  'mar',
]

export const feeStructureColumns = ({ onEdit, onDelete }) => [
  columnHelper.accessor('structure_id', {
    header: 'Structure ID',
    cell: (info) => <span className="text-primary font-medium">{info.getValue()}</span>,
  }),

  columnHelper.accessor('class', {
    header: 'Class',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('academic_year', {
    header: 'Academic Year',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('admission_fee', {
    header: 'Admission Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('annual_fee', {
    header: 'Annual Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('exam_fee', {
    header: 'Exam Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('library_fee', {
    header: 'Library Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('computer_fee', {
    header: 'Computer Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('sports_fee', {
    header: 'Sports Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('lab_fee', {
    header: 'Lab Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  columnHelper.accessor('misc_fee', {
    header: 'Misc Fee',
    cell: (info) => `₹${info.getValue()}`,
  }),

  ...months.map((month) =>
    columnHelper.accessor(`${month}_tuition_fee`, {
      header: `${month.toUpperCase()} Tuition`,
      cell: (info) => `₹${info.getValue()}`,
    })
  ),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex gap-2">
          {/* Edit (no logic yet) */}
          <Button size="icon" variant="outline" onClick={() => onEdit?.(data)}>
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
                <AlertDialogTitle>Delete Fee Structure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the fee
                  structure.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete?.(data.structure_id)}
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
