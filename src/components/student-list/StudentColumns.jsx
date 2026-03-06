import { Button } from '@/components/ui/button'
import { Mail, MessageSquare, Pencil, Trash } from 'lucide-react'
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

export const advancedFilter = (row, columnId, filterValue) => {
  if (!filterValue) return true

  const rowValue = row.getValue(columnId)

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
    cell: ({ row }) => <span className="capitalize">{row.original.FullName}</span>,
    filterFn: advancedFilter,
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
    header: 'DOB',
    cell: ({ row }) =>
      row.original.DOB ? new Date(row.original.DOB).toLocaleDateString() : '—',
  },

  {
    accessorKey: 'RollNo',
    header: 'Roll No',
    cell: ({ row }) => row.original.RollNo ?? '—',
  },
  {
    accessorKey: 'IdentificationNumber',
    header: 'ID Number',
    cell: ({ row }) => row.original.IdentificationNumber ?? '—',
  },
  {
    accessorKey: 'EnrollmentNumber',
    header: 'Enrollment No',
    cell: ({ row }) => row.original.EnrollmentNumber ?? '—',
  },
  {
    accessorKey: 'AdmissionDate',
    header: 'Admission Date',
    cell: ({ row }) =>
      row.original.AdmissionDate
        ? new Date(row.original.AdmissionDate).toLocaleDateString()
        : '—',
  },

  {
    accessorKey: 'PreviousAcademicRecord',
    header: 'Previous Record',
    cell: ({ row }) => row.original.PreviousAcademicRecord ?? '—',
  },

  {
    accessorKey: 'AttendancePercentage',
    header: 'Attendance %',
    cell: ({ row }) =>
      row.original.AttendancePercentage ? `${row.original.AttendancePercentage}%` : '—',
  },

  {
    accessorKey: 'AcademicStatus',
    header: 'Academic Status',
    cell: ({ row }) => row.original.AcademicStatus ?? '—',
  },
  {
    accessorKey: 'ParentEmail',
    header: 'Parent Email',
    cell: ({ row }) => row.original.ParentEmail ?? '—',
  },
  {
    accessorKey: 'HouseName',
    header: 'House',
    cell: ({ row }) => row.original.HouseName ?? '—',
  },
  {
    accessorKey: 'Caste',
    header: 'Caste',
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
    header: 'Transport Route',
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
    header: 'Vehicle No',
    cell: ({ row }) => row.original.VehicleNo ?? '—',
  },
  {
    accessorKey: 'GuardianPhoto',
    header: 'Guardian Photo',
    cell: ({ row }) => {
      const { GuardianPhoto, GuardianName } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        GuardianName || 'Guardian'
      )}&size=256`

      const imageUrl = GuardianPhoto || avatarUrl

      return (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={imageUrl}
              alt="Guardian"
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
                alt="Guardian"
                className="max-h-[70vh] rounded-md object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )
    },
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
