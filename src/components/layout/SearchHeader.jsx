import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter } from 'lucide-react'
import { useState } from 'react'

export default function SearchHeader({ column, title, type = 'text', options = [] }) {
  const currentFilter = column.getFilterValue()

  const [operator, setOperator] = useState(currentFilter?.operator || 'contains')
  const [value, setValue] = useState(currentFilter?.value || '')
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <span>{title}</span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Filter
              className={`h-4 w-4 ${column.getFilterValue() ? 'text-blue-600' : ''}`}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-56 space-y-3">
          {type !== 'select' && (
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="startsWith">Starts With</SelectItem>
                <SelectItem value="endsWith">Ends With</SelectItem>
              </SelectContent>
            </Select>
          )}

          {type === 'select' ? (
            <Select
              value={value}
              onValueChange={(v) => {
                setValue(v)
                column.setFilterValue({ operator: 'equals', value: v })
                setOpen(false)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>

              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value..."
            />
          )}

          {/* Buttons */}
          <div className="flex justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                column.setFilterValue(undefined)
                setValue('')
                setOpen(false)
              }}
            >
              Clear
            </Button>

            {type !== 'select' && (
              <Button
                size="sm"
                onClick={() => {
                  column.setFilterValue({ operator, value })
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
