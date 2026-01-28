import { useState } from "react";
import { Search, ArrowUpDown, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StaffHeader({ onSearch, onSortChange, onExport }) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);
		onSearch?.(value);
	};

	const handleSortChange = (order) => {
		onSortChange?.(order);
	};

	const handleExport = (format) => {
		onExport?.(format);
	};

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			{/* Page Title */}
			<h1 className="text-xl font-semibold">Staff List</h1>

			{/* Actions */}
			<div className="flex flex-wrap items-center gap-2">
				{/* Search */}
				<div className="relative w-full md:w-64">
					<Input
						placeholder="Search by name / ID / email"
						className="pr-9"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
					<Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				</div>

				{/* Sort Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="gap-2">
							<ArrowUpDown className="h-4 w-4" />
							Sort
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={() => handleSortChange("asc")}
						>
							Ascending
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSortChange("desc")}
						>
							Descending
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Export Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
							<Download className="h-4 w-4" />
							Export
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => handleExport("pdf")}
						>
							Export as PDF
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleExport("excel")}
						>
							Export as Excel
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
