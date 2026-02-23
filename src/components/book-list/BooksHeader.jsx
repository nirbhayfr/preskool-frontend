import { Search, ArrowUpDown, Download, Filter, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function BooksHeader({
  onSearch,
  onSortChange,
  onExport,
  onFilterChange,
  setIsAddOpen,
  setIsIsbnOpen,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-xl font-semibold">Books Management</h1>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Input
            placeholder="Search by Title / ISBN / Author"
            className="pr-9"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFilterChange(null)}>All</DropdownMenuItem>

            <DropdownMenuItem onClick={() => onFilterChange('Available')}>
              Available
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onFilterChange('Not Available')}>
              Not Available
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSortChange('title_asc')}>
              Title (A–Z)
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSortChange('title_desc')}>
              Title (Z–A)
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSortChange('year_desc')}>
              Newest First
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSortChange('year_asc')}>
              Oldest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export Excel Only */}
        <Button
          onClick={() => onExport('excel')}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Export Excel
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="text-white flex items-center gap-2">
              Add Book
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setIsAddOpen(true)}>
              Add Manually
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setIsIsbnOpen(true)}>
              Add by ISBN Number
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
