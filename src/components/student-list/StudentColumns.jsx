import { Button } from '@/components/ui/button'
import { Mail, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CollectFeesDialog } from './CollectFeesDialog'
import { decryptData } from '@/utils/crypto'
import { AttendanceCell } from '../student-attendance/AttendanceCell'
import IssueBookDialog from '../book-issues/IssueBookDialog'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import IdCardPDF from '../pdfs/IdCardPDF'
import { pdf } from '@react-pdf/renderer'
import SearchHeader from '../layout/SearchHeader'
import { classes, sections } from '@/data/basicData'

const encryptedUser = localStorage.getItem('user')
const user = encryptedUser ? decryptData(encryptedUser) : null

const handlePrintId = async (student) => {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    student.FullName || 'Student'
  )}&size=256`

  const imageUrl = student.PhotoUrl || avatarUrl

  const blob = await pdf(<IdCardPDF student={student} photo={imageUrl} />).toBlob()

  const url = URL.createObjectURL(blob)
  window.open(url)
}

const advancedFilter = (row, columnId, filterValue) => {
  if (!filterValue) return true

  let rowValue = row.getValue(columnId)

  if (columnId === 'Status' && (rowValue === null || rowValue === undefined)) {
    rowValue = 'Inactive'
  }

  if (columnId === 'TransportStatus' && (rowValue === null || rowValue === undefined)) {
    rowValue = 'No'
  }

  if (rowValue === undefined || rowValue === null) return false

  const value = String(rowValue).toLowerCase()
  const search = String(filterValue.value ?? '').toLowerCase()

  switch (filterValue.operator) {
    case 'equals':
      return value === search

    case 'notEquals':
      return value !== search

    case 'startsWith':
      return value.startsWith(search)

    case 'endsWith':
      return value.endsWith(search)

    case 'greaterThan':
      return Number(rowValue) > Number(filterValue.value)

    case 'lessThan':
      return Number(rowValue) < Number(filterValue.value)

    case 'empty':
      return value === ''

    case 'notEmpty':
      return value !== ''

    default:
      return value.includes(search)
  }
}

export const studentsColumns = (setSelectedStudent) => [
  {
    accessorKey: 'StudentID',
    header: ({ column }) => <SearchHeader column={column} title="Student ID" />,
    filterFn: advancedFilter,
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
    header: ({ column }) => <SearchHeader column={column} title="Full Name" />,
    filterFn: advancedFilter,
    cell: ({ row }) => <span className="capitalize">{row.original.FullName}</span>,
  },

  {
    accessorKey: 'Status',
    header: ({ column }) => (
      <SearchHeader
        column={column}
        title="Status"
        type="select"
        options={['Active', 'Inactive']}
      />
    ),
    filterFn: advancedFilter,
    cell: ({ row }) => {
      const status = row.original.Status

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
          ${
            status === 'Active' || status === 'active'
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
    header: ({ column }) => <SearchHeader column={column} title="Today Status" />,
    filterFn: advancedFilter,
    cell: ({ row }) => {
      const value =
        row.original.TodayStatus === 'N' ? undefined : row.original.TodayStatus

      return <AttendanceCell value={value} />
    },
  },

  {
    accessorKey: 'ClassID',
    header: ({ column }) => (
      <SearchHeader column={column} title="Class" type="select" options={classes} />
    ),
    filterFn: advancedFilter,
  },

  {
    accessorKey: 'SectionID',
    header: ({ column }) => (
      <SearchHeader column={column} title="Section" type="select" options={sections} />
    ),
    filterFn: advancedFilter,
  },

  {
    accessorKey: 'Gender',
    header: ({ column }) => <SearchHeader column={column} title="Gender" />,
    filterFn: advancedFilter,
  },

  {
    accessorKey: 'DOB',
    header: ({ column }) => <SearchHeader column={column} title="DOB" />,
    filterFn: advancedFilter,
    cell: ({ row }) =>
      row.original.DOB ? new Date(row.original.DOB).toLocaleDateString() : '—',
  },

  {
    accessorKey: 'RollNo',
    header: ({ column }) => <SearchHeader column={column} title="Roll No" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.RollNo ?? '—',
  },

  {
    accessorKey: 'IdentificationNumber',
    header: ({ column }) => <SearchHeader column={column} title="ID Number" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.IdentificationNumber ?? '—',
  },

  {
    accessorKey: 'EnrollmentNumber',
    header: ({ column }) => <SearchHeader column={column} title="Enrollment No" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.EnrollmentNumber ?? '—',
  },

  {
    accessorKey: 'AdmissionDate',
    header: ({ column }) => <SearchHeader column={column} title="Admission Date" />,
    filterFn: advancedFilter,
    cell: ({ row }) =>
      row.original.AdmissionDate
        ? new Date(row.original.AdmissionDate).toLocaleDateString()
        : '—',
  },

  {
    accessorKey: 'PreviousAcademicRecord',
    header: ({ column }) => <SearchHeader column={column} title="Previous Record" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.PreviousAcademicRecord ?? '—',
  },

  {
    accessorKey: 'AttendancePercentage',
    header: ({ column }) => (
      <SearchHeader column={column} title="Attendance %" type="number" />
    ),
    filterFn: advancedFilter,
    cell: ({ row }) =>
      row.original.AttendancePercentage ? `${row.original.AttendancePercentage}%` : '—',
  },

  {
    accessorKey: 'AcademicStatus',
    header: ({ column }) => <SearchHeader column={column} title="Academic Status" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.AcademicStatus ?? '—',
  },

  {
    accessorKey: 'ParentEmail',
    header: ({ column }) => <SearchHeader column={column} title="Parent Email" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.ParentEmail ?? '—',
  },

  {
    accessorKey: 'HouseName',
    header: ({ column }) => <SearchHeader column={column} title="House" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.HouseName ?? '—',
  },

  {
    accessorKey: 'Caste',
    header: ({ column }) => <SearchHeader column={column} title="Caste" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.Cast ?? '—',
  },

  {
    accessorKey: 'PendingFee',
    header: ({ column }) => (
      <SearchHeader column={column} title="Pending Fee" type="number" />
    ),
    filterFn: advancedFilter,
    cell: ({ row }) => (row.original.PendingFee ? `₹${row.original.PendingFee}` : '₹0'),
  },

  {
    accessorKey: 'Route',
    header: ({ column }) => <SearchHeader column={column} title="Transport Route" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.Route ?? '—',
  },

  {
    accessorKey: 'TransportStatus',
    header: ({ column }) => (
      <SearchHeader
        column={column}
        title="Transport"
        type="select"
        options={['Yes', 'No']}
      />
    ),
    filterFn: advancedFilter,
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          row.original.TransportStatus === 'Yes'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {row.original.TransportStatus ?? 'No'}
      </span>
    ),
  },

  {
    accessorKey: 'VehicleNo',
    header: ({ column }) => <SearchHeader column={column} title="Vehicle No" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.VehicleNo ?? '—',
  },

  {
    accessorKey: 'AdmissionNo',
    header: ({ column }) => <SearchHeader column={column} title="Admission No" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.AdmissionNo ?? '—',
  },

  {
    accessorKey: 'Attendance',
    header: ({ column }) => <SearchHeader column={column} title="Attendance" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.Attendance ?? '—',
  },

  {
    accessorKey: 'Address',
    header: ({ column }) => <SearchHeader column={column} title="Address" />,
    filterFn: advancedFilter,
  },

  {
    accessorKey: 'ContactNumber',
    header: ({ column }) => <SearchHeader column={column} title="Contact No" />,
    filterFn: advancedFilter,
  },

  {
    accessorKey: 'EmailAddress',
    header: ({ column }) => <SearchHeader column={column} title="Email" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.EmailAddress ?? '—',
  },

  {
    accessorKey: 'Nationality',
    header: ({ column }) => <SearchHeader column={column} title="Nationality" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.Nationality ?? '—',
  },

  {
    accessorKey: 'GuardianName',
    header: ({ column }) => <SearchHeader column={column} title="Guardian Name" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.GuardianName ?? '—',
  },

  {
    accessorKey: 'GuardianRelation',
    header: ({ column }) => <SearchHeader column={column} title="Guardian Relation" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.GuardianRelation ?? '—',
  },

  {
    accessorKey: 'GuardianContact',
    header: ({ column }) => <SearchHeader column={column} title="Guardian Contact" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.GuardianContact ?? '—',
  },

  {
    accessorKey: 'GuardianOccupation',
    header: ({ column }) => <SearchHeader column={column} title="Guardian Occupation" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.GuardianOccupation ?? '—',
  },

  {
    accessorKey: 'GuardianAddress',
    header: ({ column }) => <SearchHeader column={column} title="Guardian Address" />,
    filterFn: advancedFilter,
    cell: ({ row }) => row.original.GuardianAddress ?? '—',
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="icon" variant="outline">
          <Mail className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="outline">
          <MessageSquare className="h-4 w-4" />
        </Button>

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

        {user?.Role === 'Admin' && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => handlePrintId(row.original)}
          >
            Print ID
          </Button>
        )}
      </div>
    ),
  },
]
