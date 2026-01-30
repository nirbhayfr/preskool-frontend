import { Button } from '@/components/ui/button'
import { Pencil, Trash } from 'lucide-react'

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
import { Link } from 'react-router-dom'

export const studentsColumns = (onDelete, onEdit) => [
  {
    accessorKey: 'StudentID',
    header: 'Student ID',
    cell: ({ row }) => (
      <Link
        to={`/student-details/${row.original.StudentID}`}
        className="text-primary font-medium"
      >
        {row.original.StudentID}
      </Link>
    ),
  },

  {
    accessorKey: 'PhotoUrl',
    header: 'Profile',
    cell: ({ row }) => (
      <img
        src={
          row.original.PhotoUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            row.original.FullName || 'Student'
          )}`
        }
        className="h-10 w-10 rounded-full object-cover border"
      />
    ),
  },

  {
    accessorKey: 'FullName',
    header: 'Full Name',
    cell: ({ row }) => <span className="capitalize">{row.original.FullName}</span>,
  },
  { accessorKey: 'Gender', header: 'Gender' },

  {
    accessorKey: 'DOB',
    header: 'DOB',
    cell: ({ row }) =>
      row.original.DOB ? new Date(row.original.DOB).toLocaleDateString() : '—',
  },

  { accessorKey: 'ClassID', header: 'Class' },
  { accessorKey: 'SectionID', header: 'Section' },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.Status?.toLowerCase()

      const isActive = status === 'active'

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
					${
            isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
				`}
        >
          {row.original.Status ?? 'Inactive'}
        </span>
      )
    },
  },
  {
    accessorKey: 'RollNo',
    header: 'Roll No',
    cell: ({ row }) => row.original.RollNo ?? '—',
  },
  {
    accessorKey: 'AdmissionNo',
    header: 'Admission No',
    cell: ({ row }) => row.original.AdmissionNo ?? '—',
  },

  {
    accessorKey: 'JoiningDate',
    header: 'Joining Date',
    cell: ({ row }) =>
      row.original.JoiningDate
        ? new Date(row.original.JoiningDate).toLocaleDateString()
        : '—',
  },

  {
    accessorKey: 'Program',
    header: 'Program',
    cell: ({ row }) => row.original.Program ?? '—',
  },
  {
    accessorKey: 'YearSemester',
    header: 'Year / Semester',
    cell: ({ row }) => row.original.YearSemester ?? '—',
  },
  {
    accessorKey: 'PreviousRecord',
    header: 'Previous Record',
    cell: ({ row }) => row.original.PreviousRecord ?? '—',
  },
  {
    accessorKey: 'GPA',
    header: 'GPA',
    cell: ({ row }) => row.original.GPA ?? '—',
  },
  {
    accessorKey: 'Attendance',
    header: 'Attendance',
    cell: ({ row }) => row.original.Attendance ?? '—',
  },
  {
    accessorKey: 'Subjects',
    header: 'Subjects',
    cell: ({ row }) => row.original.Subjects ?? '—',
  },

  { accessorKey: 'Address', header: 'Address' },
  { accessorKey: 'ContactNumber', header: 'Contact No' },
  {
    accessorKey: 'EmailAddress',
    header: 'Email',
    cell: ({ row }) => row.original.EmailAddress ?? '—',
  },
  {
    accessorKey: 'Nationality',
    header: 'Nationality',
    cell: ({ row }) => row.original.Nationality ?? '—',
  },

  {
    accessorKey: 'FatherPhoto',
    header: 'Father Photo',
    cell: ({ row }) =>
      row.original.FatherPhoto ? (
        <img src={row.original.FatherPhoto} className="h-10 w-10 rounded-full border" />
      ) : (
        '—'
      ),
  },
  {
    accessorKey: 'MotherPhoto',
    header: 'Mother Photo',
    cell: ({ row }) =>
      row.original.MotherPhoto ? (
        <img src={row.original.MotherPhoto} className="h-10 w-10 rounded-full border" />
      ) : (
        '—'
      ),
  },
  {
    accessorKey: 'GuardianPhoto',
    header: 'Guardian Photo',
    cell: ({ row }) =>
      row.original.GuardianPhoto ? (
        <img src={row.original.GuardianPhoto} className="h-10 w-10 rounded-full border" />
      ) : (
        '—'
      ),
  },

  {
    accessorKey: 'GuardianName',
    header: 'Guardian Name',
    cell: ({ row }) => row.original.GuardianName ?? '—',
  },
  {
    accessorKey: 'GuardianRelation',
    header: 'Guardian Relation',
    cell: ({ row }) => row.original.GuardianRelation ?? '—',
  },
  {
    accessorKey: 'GuardianContact',
    header: 'Guardian Contact',
    cell: ({ row }) => row.original.GuardianContact ?? '—',
  },
  {
    accessorKey: 'GuardianOccupation',
    header: 'Guardian Occupation',
    cell: ({ row }) => row.original.GuardianOccupation ?? '—',
  },
  {
    accessorKey: 'GuardianAddress',
    header: 'Guardian Address',
    cell: ({ row }) => row.original.GuardianAddress ?? '—',
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        {/* Edit */}
        <Button
          size="icon"
          variant="outline"
          onClick={() => onEdit(row.original.StudentID)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="destructive">
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete student?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(row.original.StudentID)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
]
