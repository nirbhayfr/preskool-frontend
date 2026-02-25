import { Button } from '@/components/ui/button'
import { Mail, MessageSquare, Pencil, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CollectFeesDialog } from './CollectFeesDialog'
import { decryptData } from '@/utils/crypto'
import { AttendanceCell } from '../student-attendance/AttendanceCell'
import IssueBookDialog from '../book-issues/IssueBookDialog'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

const encryptedUser = localStorage.getItem('user')
const user = encryptedUser ? decryptData(encryptedUser) : null

export const studentsColumns = (setSelectedStudent) => [
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
    cell: ({ row }) => {
      const { PhotoUrl, FullName } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        FullName || 'Student'
      )}&size=256`

      const imageUrl = PhotoUrl || avatarUrl

      return (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={imageUrl}
              alt={FullName}
              className="h-10 w-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
              onError={(e) => {
                e.currentTarget.src = avatarUrl
              }}
            />
          </DialogTrigger>

          <DialogContent className="max-w-md p-4">
            <div className="flex flex-col items-center gap-3">
              <img
                src={imageUrl}
                alt={FullName}
                className="max-h-[70vh] rounded-md object-contain"
              />
              <p className="font-medium">{FullName}</p>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
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
    cell: ({ row }) => {
      const { FatherPhoto, GuardianName } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        GuardianName || 'Father'
      )}&size=256`

      const imageUrl = FatherPhoto || avatarUrl

      return (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={imageUrl}
              alt="Father"
              className="h-10 w-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
              onError={(e) => {
                e.currentTarget.src = avatarUrl
              }}
            />
          </DialogTrigger>

          <DialogContent className="max-w-md p-4">
            <div className="flex flex-col items-center gap-3">
              <img
                src={imageUrl}
                alt="Father"
                className="max-h-[70vh] rounded-md object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
  {
    accessorKey: 'MotherPhoto',
    header: 'Mother Photo',
    cell: ({ row }) => {
      const { MotherPhoto, GuardianName } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        GuardianName || 'Mother'
      )}&size=256`

      const imageUrl = MotherPhoto || avatarUrl

      return (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={imageUrl}
              alt="Mother"
              className="h-10 w-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
              onError={(e) => {
                e.currentTarget.src = avatarUrl
              }}
            />
          </DialogTrigger>

          <DialogContent className="max-w-md p-4">
            <div className="flex flex-col items-center gap-3">
              <img
                src={imageUrl}
                alt="Mother"
                className="max-h-[70vh] rounded-md object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )
    },
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

        {(user?.Role === 'Admin' || user?.Role === 'Librarian') && (
          <Button
            size="sm"
            className="text-xs"
            onClick={() => setSelectedStudent(row.original)}
          >
            Issue Book
          </Button>
        )}
      </div>
    ),
  },
]
