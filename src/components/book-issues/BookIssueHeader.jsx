// components/book-issues/BookIssuesHeader.jsx

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function BookIssuesHeader({ onSearch, onMonthChange, month }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-xl font-semibold">Book Issues</h1>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Input
            type="text"
            placeholder="Search by Book / Type / Created By"
            className="pr-9"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Month Filter */}
        <Input
          type="month"
          value={month}
          className="w-[160px]"
          onChange={(e) => onMonthChange(e.target.value)}
        />

        {/* Add Issue Button */}
        <Button>+ Add Issue (Not Implemented Yet)</Button>
      </div>
    </div>
  )
}
