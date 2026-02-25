import { useMemo, useState, useCallback } from 'react'
import { CircleLoader } from '@/components/layout/RouteLoader'
import TableLayout from '@/components/layout/Table'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

import { useInventories, useDeleteInventory } from '@/hooks/useInventory'
import { inventoryColumns } from '@/components/inventory/InventoryTableColumns'
import { InventoryHeader } from '@/components/inventory/InventoryHeader'
import { AddEditInventoryDialog } from '@/components/inventory/AddEditInventoryDialog'

export default function InventoryPage() {
  const { data, isLoading, error } = useInventories()
  const { mutate: deleteInventory } = useDeleteInventory()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  const inventories = data?.data ?? []

  const filteredData = useMemo(() => {
    return inventories.filter((item) => {
      const matchesSearch =
        item.ItemName?.toLowerCase().includes(search.toLowerCase()) ||
        item.VendorName?.toLowerCase().includes(search.toLowerCase()) ||
        item.Location?.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = status === 'All' || item.Status === status

      const matchesCategory = category === 'All' || item.Category === category

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [inventories, search, status, category])

  const handleDelete = useCallback(
    (item) => {
      deleteInventory(item.InventoryId, {
        onSuccess: () => toast.success('Inventory deleted'),
        onError: () => toast.error('Delete failed'),
      })
    },
    [deleteInventory]
  )

  const columns = useMemo(
    () => inventoryColumns((item) => setSelectedItem(item), handleDelete),
    [handleDelete]
  )

  if (isLoading) return <CircleLoader />
  if (error) return <div>Error loading inventory</div>

  console.log(data)

  return (
    <section className="p-6 space-y-6">
      <InventoryHeader
        total={filteredData.length}
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        onAddClick={() => setSelectedItem({})}
      />

      <TableLayout columns={columns} data={filteredData} />

      {selectedItem !== null && (
        <AddEditInventoryDialog
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  )
}
