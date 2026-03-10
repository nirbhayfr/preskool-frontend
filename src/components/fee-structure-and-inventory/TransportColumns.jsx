import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash } from 'lucide-react'

export const transportColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: 'TransportNumber',
    header: 'Vehicle No.',
  },
  {
    accessorKey: 'TransportType',
    header: 'Type',
  },
  {
    accessorKey: 'RouteName',
    header: 'Route',
  },
  {
    accessorKey: 'TransporterName',
    header: 'Transporter',
  },
  {
    accessorKey: 'OwnerName',
    header: 'Owner',
  },
  {
    accessorKey: 'Price',
    header: 'Monthly Fee',
    cell: ({ row }) => {
      const price = row.original.Price
      return <span>₹{Number(price).toLocaleString()}</span>
    },
  },
  {
    accessorKey: 'GPSNumber',
    header: 'GPS',
    cell: ({ row }) => {
      const gps = row.original.GPSNumber
      return gps ? gps : '-'
    },
  },
  {
    accessorKey: 'JoiningDate',
    header: 'Joining Date',
    cell: ({ row }) => {
      const date = row.original.JoiningDate
      if (!date) return '-'

      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.Status
      const isActive = status?.toLowerCase() === 'active'

      return (
        <Badge
          className={
            isActive
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-red-100 text-red-700 hover:bg-red-100'
          }
        >
          {status || 'Inactive'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(data)}>
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(data.TransportID)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
