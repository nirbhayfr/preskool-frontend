import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Pencil, Trash } from 'lucide-react'

export const transportColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: 'TransportNumber',
    header: 'Transport Number',
  },
  {
    accessorKey: 'TransportType',
    header: 'Type',
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
    accessorKey: 'Route',
    header: 'Route',
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
          {status}
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
