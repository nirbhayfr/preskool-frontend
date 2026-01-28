import { useState } from "react";
import { Search, Filter, ArrowUpDown, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function StudentsHeader({
	onSearch,
	onFilterChange,
	onSortChange,
	onExport,
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState({
		class: "all",
		section: "all",
		status: "all",
	});
	const [_, setSortOrder] = useState("asc");

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);
		onSearch?.(value);
	};

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const applyFilters = () => {
		onFilterChange?.(filters);
	};

	const resetFilters = () => {
		const reset = { class: "all", section: "all", status: "all" };
		setFilters(reset);
		onFilterChange?.(reset);
	};

	const handleSortChange = (order) => {
		setSortOrder(order);
		onSortChange?.(order);
	};

	const handleExport = (format) => {
		onExport?.(format);
	};

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<h1 className="text-xl font-semibold">Students List</h1>

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

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="gap-2">
							<Filter className="h-4 w-4" />
							Filter
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						className="w-72 p-4"
					>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								{/* Class */}
								<div className="space-y-1">
									<Label className="text-xs">
										Class
									</Label>
									<Select
										value={filters.class}
										onValueChange={(val) =>
											handleFilterChange(
												"class",
												val,
											)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select class" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">
												All
											</SelectItem>
											<SelectItem value="1">
												Class 1
											</SelectItem>
											<SelectItem value="2">
												Class 2
											</SelectItem>
											<SelectItem value="3">
												Class 3
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-1">
									<Label className="text-xs">
										Section
									</Label>
									<Select
										value={filters.section}
										onValueChange={(val) =>
											handleFilterChange(
												"section",
												val,
											)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select section" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">
												All
											</SelectItem>
											<SelectItem value="a">
												A
											</SelectItem>
											<SelectItem value="b">
												B
											</SelectItem>
											<SelectItem value="c">
												C
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-1 col-span-2">
									<Label className="text-xs">
										Status
									</Label>
									<Select
										value={filters.status}
										onValueChange={(val) =>
											handleFilterChange(
												"status",
												val,
											)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">
												All
											</SelectItem>
											<SelectItem value="Active">
												Active
											</SelectItem>
											<SelectItem value="Inactive">
												Inactive
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="flex gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									className="flex-1"
									onClick={resetFilters}
								>
									Reset
								</Button>
								<Button
									size="sm"
									className="flex-1"
									onClick={applyFilters}
								>
									Apply
								</Button>
							</div>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>

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
