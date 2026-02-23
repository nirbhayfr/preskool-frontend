import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

export function InventoryHeader({
  total,
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  onAddClick,
}) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Inventory
          {total != null && (
            <span className="ml-2 text-sm text-muted-foreground">({total})</span>
          )}
        </h2>

        <Button onClick={onAddClick}>+ Add Item</Button>
      </div>

      <div className="flex gap-4 flex-wrap pb-2">
        <Input
          placeholder="Search by Item, Vendor or Location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-[220px]"
        />

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="min-w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="min-w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
            <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
