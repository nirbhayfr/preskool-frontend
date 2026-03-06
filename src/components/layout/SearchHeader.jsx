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

  const applyFilter = () => {
    column.setFilterValue({ operator, value })
  }

  const clearFilter = () => {
    column.setFilterValue(undefined)
    setValue('')
  }

  return (
    <div className="flex items-center gap-1">
      <span>{title}</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Filter
              className={`h-4 w-4 ${column.getFilterValue() ? 'text-blue-600' : ''}`}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-56 space-y-3">
          {/* operator */}
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
                {type === 'number' && (
                  <>
                    <SelectItem value="greaterThan">Greater Than</SelectItem>
                    <SelectItem value="lessThan">Less Than</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          )}

          {/* value input */}
          {type === 'select' ? (
            <Select
              value={value}
              onValueChange={(v) => {
                setValue(v)
                column.setFilterValue({ operator: 'equals', value: v })
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
              type={type === 'number' ? 'number' : 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value..."
            />
          )}

          <div className="flex justify-between">
            <Button size="sm" variant="outline" onClick={clearFilter}>
              Clear
            </Button>

            {type !== 'select' && (
              <Button size="sm" onClick={applyFilter}>
                Apply
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
