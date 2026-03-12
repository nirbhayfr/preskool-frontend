import { Button } from '@/components/ui/button'
import { Mail, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AttendanceCell } from '../student-attendance/AttendanceCell'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

import SearchHeader from '../layout/SearchHeader'

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

const formatValue = (value) => value ?? '—'

export const teachersColumns = () => [
  {
    accessorKey: 'TeacherID',
    header: ({ column }) => <SearchHeader column={column} title="Teacher ID" />,
    filterFn: advancedFilter,
    cell: ({ row }) => (
      <Link
        to={`/teacher-details/${row.original.TeacherID}`}
        className="text-primary font-medium"
      >
        {formatValue(row.original.TeacherID)}
      </Link>
    ),
  },

  {
    accessorKey: 'ProfilePhoto',
    header: 'Profile Photo',
    cell: ({ row }) => {
      const { ProfilePhoto, FullName } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        FullName || 'Teacher'
      )}&size=256`

      const imageUrl = ProfilePhoto || avatarUrl

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
    cell: ({ row }) => formatValue(row.original.FullName),
  },

  {
    accessorKey: 'Gender',
    header: ({ column }) => <SearchHeader column={column} title="Gender" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Gender),
  },

  {
    accessorKey: 'TodayStatus',
    header: ({ column }) => <SearchHeader column={column} title="Today Status" />,
    filterFn: advancedFilter,
    cell: ({ row }) => {
      const status = row.original.TodayStatus

      if (status === 'N') return <p className="text-blue-600">Holiday</p>
      if (status === 'P') return <p className="text-emerald-600">Present</p>
      if (status === 'A') return <p className="text-red-600">Absent</p>
      if (status === 'L') return <p className="text-amber-300">Late</p>
      if (status === 'H') return <p className="text-amber-600">HalfDay</p>

      return '-'
    },
  },

  {
    accessorKey: 'Class',
    header: ({ column }) => <SearchHeader column={column} title="Class" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Class),
  },

  {
    accessorKey: 'Section',
    header: ({ column }) => <SearchHeader column={column} title="Section" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Section),
  },

  {
    accessorKey: 'DateOfBirth',
    header: ({ column }) => <SearchHeader column={column} title="DOB" />,
    filterFn: advancedFilter,
    cell: ({ row }) =>
      row.original.DateOfBirth
        ? new Date(row.original.DateOfBirth).toLocaleDateString()
        : '—',
  },

  {
    accessorKey: 'Subject',
    header: ({ column }) => <SearchHeader column={column} title="Subject" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Subject),
  },

  {
    accessorKey: 'Email',
    header: ({ column }) => <SearchHeader column={column} title="Email" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Email),
  },

  {
    accessorKey: 'ContactNumber',
    header: ({ column }) => <SearchHeader column={column} title="Contact No" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.ContactNumber),
  },

  {
    accessorKey: 'Qualification',
    header: ({ column }) => <SearchHeader column={column} title="Qualification" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Qualification),
  },

  {
    accessorKey: 'ExperienceYears',
    header: ({ column }) => (
      <SearchHeader column={column} title="Experience (Yrs)" type="number" />
    ),
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.ExperienceYears),
  },

  {
    accessorKey: 'Address',
    header: ({ column }) => <SearchHeader column={column} title="Address" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Address),
  },

  {
    accessorKey: 'City',
    header: ({ column }) => <SearchHeader column={column} title="City" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.City),
  },

  {
    accessorKey: 'State',
    header: ({ column }) => <SearchHeader column={column} title="State" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.State),
  },

  {
    accessorKey: 'PostalCode',
    header: ({ column }) => <SearchHeader column={column} title="Postal Code" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.PostalCode),
  },

  {
    accessorKey: 'Nationality',
    header: ({ column }) => <SearchHeader column={column} title="Nationality" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Nationality),
  },

  {
    accessorKey: 'DateOfJoining',
    header: ({ column }) => <SearchHeader column={column} title="Joining Date" />,
    filterFn: advancedFilter,
    cell: ({ row }) =>
      row.original.DateOfJoining
        ? new Date(row.original.DateOfJoining).toLocaleDateString()
        : '—',
  },

  {
    accessorKey: 'BloodGroup',
    header: ({ column }) => <SearchHeader column={column} title="Blood Group" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.BloodGroup),
  },

  {
    accessorKey: 'MaritalStatus',
    header: ({ column }) => <SearchHeader column={column} title="Marital Status" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.MaritalStatus),
  },

  {
    accessorKey: 'VehicleNumber',
    header: ({ column }) => <SearchHeader column={column} title="Vehicle Number" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.VehicleNumber),
  },

  {
    accessorKey: 'TransportNumber',
    header: ({ column }) => <SearchHeader column={column} title="Transport Number" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.TransportNumber),
  },

  // {
  //   accessorKey: 'ProfilePictureUrl',
  //   header: ({ column }) => <SearchHeader column={column} title="Profile Picture URL" />,
  //   filterFn: advancedFilter,
  //   cell: ({ row }) => formatValue(row.original.ProfilePictureUrl),
  // },

  {
    accessorKey: 'IDProofPhoto',
    header: ({ column }) => <SearchHeader column={column} title="ID Proof Photo" />,
    filterFn: advancedFilter,
    cell: ({ row }) => {
      if (row.original.IDProofPhoto === null) return '-'
      return (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={row.original.IDProofPhoto}
              alt="ID PROOF"
              className="h-10 w-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
            />
          </DialogTrigger>

          <DialogContent className="max-w-md p-4">
            <div className="flex flex-col items-center gap-3">
              <img
                src={row.original.IDProofPhoto}
                alt="ID PROOF"
                className="max-h-[70vh] rounded-md object-contain"
              />
              {/* <p className="font-medium">{FullName}</p> */}
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },

  {
    accessorKey: 'Salary',
    header: ({ column }) => <SearchHeader column={column} title="Salary" type="number" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Salary),
  },

  {
    accessorKey: 'Position',
    header: ({ column }) => <SearchHeader column={column} title="Position" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Position),
  },

  {
    accessorKey: 'Caste',
    header: ({ column }) => <SearchHeader column={column} title="Caste" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Caste),
  },

  {
    accessorKey: 'PreviousSalary',
    header: ({ column }) => (
      <SearchHeader column={column} title="Previous Salary" type="number" />
    ),
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.PreviousSalary),
  },

  {
    accessorKey: 'EmergencyContactName',
    header: ({ column }) => (
      <SearchHeader column={column} title="Emergency Contact Name" />
    ),
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.EmergencyContactName),
  },

  {
    accessorKey: 'EmergencyContactNumber',
    header: ({ column }) => <SearchHeader column={column} title="Emergency Contact No" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.EmergencyContactNumber),
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex gap-2">
        <Button size="icon" variant="outline">
          <Mail className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="outline">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
