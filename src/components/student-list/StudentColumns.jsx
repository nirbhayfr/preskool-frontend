import { Button } from '@/components/ui/button'
import { Mail, MessageSquare, Pencil, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CollectFeesDialog } from './CollectFeesDialog'
import { decryptData } from '@/utils/crypto'
import { AttendanceCell } from '../student-attendance/AttendanceCell'

const encryptedUser = localStorage.getItem('user')
const user = encryptedUser ? decryptData(encryptedUser) : null

export const studentsColumns = () => [
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
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.Status

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
          ${
            status === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {status ?? 'Inactive'}
        </span>
      )
    },
  },
  {
    accessorKey: 'TodayStatus',
    header: 'Today Status',
    cell: ({ row }) => {
      const value =
        row.original.TodayStatus === 'N' ? undefined : row.original.TodayStatus

      return <AttendanceCell value={value} />
    },
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
    accessorKey: 'GuardianPhoto',
    header: 'Guardian Photo',
    cell: ({ row }) =>
      row.original.GuardianPhoto ? (
        <img
          src={row.original.GuardianPhoto}
          className="h-10 w-10 rounded-full border"
          alt="Guardian"
        />
      ) : (
        '—'
      ),
  },
  {
    accessorKey: 'Attendance',
    header: 'Attendance',
    cell: ({ row }) => row.original.Attendance ?? '—',
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
  // {
  //   accessorKey: 'GuardianPhoto',
  //   header: 'Guardian Photo',
  //   cell: ({ row }) =>
  //     row.original.GuardianPhoto ? (
  //       <img src={row.original.GuardianPhoto} className="h-10 w-10 rounded-full border" />
  //     ) : (
  //       '—'
  //     ),
  // },

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
        {/* Mail */}
        <Button size="icon" variant="outline">
          <Mail className="h-4 w-4" />
        </Button>

        {/* Message */}
        <Button size="icon" variant="outline">
          <MessageSquare className="h-4 w-4" />
        </Button>

        {/* Collect Fees */}
        {user?.Role === 'Admin' && (
          <CollectFeesDialog studentId={row.original.StudentID} />
        )}
      </div>
    ),
  },
]
