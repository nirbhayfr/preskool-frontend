import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const inventoryColumns = (onEdit, onDelete) => [
  { header: 'ID', accessorKey: 'InventoryId' },

  {
    header: 'Item Name',
    accessorKey: 'ItemName',
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="font-medium text-primary">{getValue()}</span>
    ),
  },

  { header: 'Category', accessorKey: 'Category' },

  { header: 'Quantity', accessorKey: 'Quantity' },

  {
    header: 'Purchase Price',
    accessorKey: 'PurchasePrice',
    cell: ({ getValue }) => <span>₹ {Number(getValue()).toLocaleString()}</span>,
  },

  { header: 'Vendor', accessorKey: 'VendorName' },
  { header: 'Location', accessorKey: 'Location' },

  {
    header: 'Purchase Date',
    accessorKey: 'PurchaseDate',
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue()).toLocaleDateString() : '-',
  },

  {
    header: 'Condition',
    accessorKey: 'Condition',
  },

  {
    header: 'Status',
    cell: ({ row }) =>
      row.original.Status === 'Active' ? (
        <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
      ) : (
        <Badge variant="destructive">Inactive</Badge>
      ),
  },

  {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onEdit(row.original)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
          Delete
        </Button>
      </div>
    ),
  },
]
