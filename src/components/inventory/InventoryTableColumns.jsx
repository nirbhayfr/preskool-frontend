import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

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
  {
    accessorKey: 'InventoryImage',
    header: '',
    size: 70,
    cell: ({ row }) => {
      const { InventoryImage, ItemName } = row.original

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        ItemName || 'Item'
      )}&background=random&color=fff&size=256`

      const imageUrl = InventoryImage || avatarUrl

      return (
        <div className="w-[60px] min-w-[60px] flex justify-center shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <img
                src={imageUrl}
                alt={ItemName}
                className="h-12 w-10 object-cover rounded-sm border cursor-pointer hover:scale-105 transition"
                onError={(e) => {
                  e.currentTarget.src = avatarUrl
                }}
              />
            </DialogTrigger>

            <DialogContent className="max-w-3xl p-4">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold">{ItemName}</h2>

                <img
                  src={imageUrl}
                  alt={ItemName}
                  className="max-h-[80vh] object-contain rounded-md"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
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
