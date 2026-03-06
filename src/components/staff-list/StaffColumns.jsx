import { Button } from '@/components/ui/button'
import { Mail, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AttendanceCell } from '../student-attendance/AttendanceCell'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

import SearchHeader from '../layout/SearchHeader'
import { advancedFilter } from '../student-list/StudentColumns'

const formatValue = (value) => value ?? '-'

export const staffColumns = () => [
  {
    accessorKey: 'StaffID',
    header: ({ column }) => <SearchHeader column={column} title="Staff ID" />,
    filterFn: advancedFilter,
    cell: ({ row }) => (
      <Link
        to={`/staff-details/${row.original.StaffID}`}
        className="text-primary font-medium"
      >
        {formatValue(row.original.StaffID)}
      </Link>
    ),
  },

  {
    accessorKey: 'ProfilePhoto',
    header: 'Profile Photo',
    cell: ({ row }) => {
      const { ProfilePhoto, FullName } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        FullName || 'Staff'
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
    accessorKey: 'Role',
    header: ({ column }) => <SearchHeader column={column} title="Role" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Role),
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
    accessorKey: 'Gender',
    header: ({ column }) => <SearchHeader column={column} title="Gender" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Gender),
  },

  {
    accessorKey: 'DateOfBirth',
    header: ({ column }) => <SearchHeader column={column} title="DOB" />,
    filterFn: advancedFilter,
    cell: ({ row }) =>
      row.original.DateOfBirth
        ? new Date(row.original.DateOfBirth).toLocaleDateString()
        : '-',
  },

  {
    accessorKey: 'Qualification',
    header: ({ column }) => <SearchHeader column={column} title="Qualification" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Qualification),
  },

  {
    accessorKey: 'ExperienceYears',
    header: ({ column }) => <SearchHeader column={column} title="Experience (Yrs)" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.ExperienceYears),
  },

  {
    accessorKey: 'DateOfJoining',
    header: ({ column }) => <SearchHeader column={column} title="Joining Date" />,
    filterFn: advancedFilter,
    cell: ({ row }) =>
      row.original.DateOfJoining
        ? new Date(row.original.DateOfJoining).toLocaleDateString()
        : '-',
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
    accessorKey: 'TransportNumber',
    header: ({ column }) => <SearchHeader column={column} title="Transport Number" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.TransportNumber),
  },

  {
    accessorKey: 'Salary',
    header: ({ column }) => <SearchHeader column={column} title="Salary" />,
    filterFn: advancedFilter,
    cell: ({ row }) => formatValue(row.original.Salary),
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
