import { Button } from '@/components/ui/button'
import { Mail, MessageSquare, Pencil, Trash } from 'lucide-react'
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

export const staffColumns = () => [
  {
    accessorKey: 'StaffID',
    header: 'Staff ID',
    cell: ({ row }) => (
      <Link
        to={`/staff-details/${row.original.StaffID}`}
        className="text-primary font-medium"
      >
        {row.original.StaffID ?? '-'}
      </Link>
    ),
  },

  {
    accessorKey: 'ProfilePhoto',
    header: 'Profile',
    cell: ({ row }) => (
      <img
        src={
          row.original.ProfilePhoto ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            row.original.FullName || 'Staff'
          )}`
        }
        className="h-10 w-10 rounded-full object-cover border"
        alt="Profile"
      />
    ),
  },

  {
    accessorKey: 'FullName',
    header: 'Full Name',
    cell: ({ row }) => row.original.FullName ?? '-',
  },
  {
    accessorKey: 'Role',
    header: 'Role',
    cell: ({ row }) => row.original.Role ?? '-',
  },
  {
    accessorKey: 'Email',
    header: 'Email',
    cell: ({ row }) => row.original.Email ?? '-',
  },
  {
    accessorKey: 'ContactNumber',
    header: 'Contact No',
    cell: ({ row }) => row.original.ContactNumber ?? '-',
  },
  {
    accessorKey: 'Gender',
    header: 'Gender',
    cell: ({ row }) => row.original.Gender ?? '-',
  },

  {
    accessorKey: 'DateOfBirth',
    header: 'DOB',
    cell: ({ row }) =>
      row.original.DateOfBirth
        ? new Date(row.original.DateOfBirth).toLocaleDateString()
        : '-',
  },

  {
    accessorKey: 'Qualification',
    header: 'Qualification',
    cell: ({ row }) => row.original.Qualification ?? '-',
  },
  {
    accessorKey: 'ExperienceYears',
    header: 'Experience (Yrs)',
    cell: ({ row }) => row.original.ExperienceYears ?? '-',
  },

  {
    accessorKey: 'DateOfJoining',
    header: 'Joining Date',
    cell: ({ row }) =>
      row.original.DateOfJoining
        ? new Date(row.original.DateOfJoining).toLocaleDateString()
        : '-',
  },

  {
    accessorKey: 'Address',
    header: 'Address',
    cell: ({ row }) => row.original.Address ?? '-',
  },
  {
    accessorKey: 'City',
    header: 'City',
    cell: ({ row }) => row.original.City ?? '-',
  },
  {
    accessorKey: 'State',
    header: 'State',
    cell: ({ row }) => row.original.State ?? '-',
  },
  {
    accessorKey: 'PostalCode',
    header: 'Postal Code',
    cell: ({ row }) => row.original.PostalCode ?? '-',
  },
  {
    accessorKey: 'Nationality',
    header: 'Nationality',
    cell: ({ row }) => row.original.Nationality ?? '-',
  },
  {
    accessorKey: 'MaritalStatus',
    header: 'Marital Status',
    cell: ({ row }) => row.original.MaritalStatus ?? '-',
  },
  {
    accessorKey: 'EmergencyContactName',
    header: 'Emergency Contact Name',
    cell: ({ row }) => row.original.EmergencyContactName ?? '-',
  },
  {
    accessorKey: 'EmergencyContactNumber',
    header: 'Emergency Contact Number',
    cell: ({ row }) => row.original.EmergencyContactNumber ?? '-',
  },
  {
    accessorKey: 'VehicleNumber',
    header: 'Vehicle Number',
    cell: ({ row }) => row.original.VehicleNumber ?? '-',
  },
  {
    accessorKey: 'TransportNumber',
    header: 'Transport Number',
    cell: ({ row }) => row.original.TransportNumber ?? '-',
  },
  {
    accessorKey: 'Salary',
    header: 'Salary',
    cell: ({ row }) => row.original.Salary ?? '-',
  },
  {
    accessorKey: 'IDProofPhoto',
    header: 'ID Proof',
    cell: ({ row }) => row.original.IDProofPhoto ?? '-',
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        {/* Mail */}
        <Button
          size="icon"
          variant="outline"
          // onClick={() => onMail(row.original.StudentID)}
        >
          <Mail className="h-4 w-4" />
        </Button>

        {/* Message */}
        <Button
          size="icon"
          variant="outline"
          // onClick={() => onMessage(row.original.StudentID)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
