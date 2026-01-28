import { Search, ArrowUpDown, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TeachersHeader({ onSearch, onSortChange, onExport }) {
	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<h1 className="text-xl font-semibold">Teachers List</h1>

			<div className="flex flex-wrap items-center gap-2">
				{/* Search */}
				<div className="relative w-full md:w-64">
					<Input
						placeholder="Search by name / ID / email"
						className="pr-9"
						onChange={(e) => onSearch(e.target.value)}
					/>
					<Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				</div>

				{/* Sort */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="gap-2">
							<ArrowUpDown className="h-4 w-4" />
							Sort
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={() => onSortChange("asc")}
						>
							Ascending
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => onSortChange("desc")}
						>
							Descending
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Export */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
							<Download className="h-4 w-4" />
							Export
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onExport("pdf")}>
							Export as PDF
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => onExport("excel")}
						>
							Export as Excel
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
