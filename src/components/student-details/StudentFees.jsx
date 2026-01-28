import * as React from "react";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	flexRender,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

const feeColumns = [
	{
		accessorKey: "group",
		header: "Fees Group",
	},
	{
		accessorKey: "code",
		header: "Fees Code",
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
	},
	{
		accessorKey: "amount",
		header: "Amount $",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => <Badge>{row.original.status}</Badge>,
	},
	{
		accessorKey: "refId",
		header: "Ref ID",
	},
	{
		accessorKey: "mode",
		header: "Mode",
	},
	{
		accessorKey: "datePaid",
		header: "Date Paid",
	},
	{
		accessorKey: "discount",
		header: "Discount ($)",
	},
	{
		accessorKey: "fine",
		header: "Fine ($)",
	},
];

const data = [
	{
		group: "Class 1 General (Dec month Fees)",
		code: "dec-month-fees",
		dueDate: "10 Jan 2024",
		amount: 2500,
		status: "Paid",
		refId: "#435443",
		mode: "Cash",
		datePaid: "05 Jan 2024",
		discount: "10%",
		fine: 0,
	},
	{
		group: "Class 1 General (Jan month Fees)",
		code: "jan-month-fees",
		dueDate: "10 Feb 2024",
		amount: 2000,
		status: "Paid",
		refId: "#435443",
		mode: "Cash",
		datePaid: "01 Feb 2024",
		discount: "10%",
		fine: 200,
	},
	{
		group: "Class 1 General (Jul month Fees)",
		code: "jul-month-fees",
		dueDate: "10 Aug 2024",
		amount: 2500,
		status: "Paid",
		refId: "#435449",
		mode: "Cash",
		datePaid: "01 Aug 2024",
		discount: "10%",
		fine: 200,
	},
	{
		group: "Class 1 General (Admission Fees)",
		code: "admission-fees",
		dueDate: "25 Mar 2024",
		amount: 2000,
		status: "Paid",
		refId: "#435454",
		mode: "Cash",
		datePaid: "25 Jan 2024",
		discount: "10%",
		fine: 200,
	},
];

function FeesTable() {
	const [globalFilter, setGlobalFilter] = React.useState("");

	const table = useReactTable({
		data,
		columns: feeColumns,
		state: { globalFilter },
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<Card className="rounded-sm">
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-lg font-semibold">
					Fees
				</CardTitle>
			</CardHeader>

			<CardContent className="pt-0 space-y-4">
				{/* Controls */}
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-2 text-sm">
						<span>Rows Per Page</span>
						<Select
							value={String(
								table.getState().pagination.pageSize
							)}
							onValueChange={(val) =>
								table.setPageSize(Number(val))
							}
						>
							<SelectTrigger className="w-20">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5</SelectItem>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Input
						placeholder="Search"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="max-w-xs"
					/>
				</div>

				{/* Table */}
				<div className="rounded-md border overflow-x-auto">
					<Table>
						<TableHeader>
							{table
								.getHeaderGroups()
								.map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map(
											(header) => (
												<TableHead
													key={header.id}
												>
													{flexRender(
														header
															.column
															.columnDef
															.header,
														header.getContext()
													)}
												</TableHead>
											)
										)}
									</TableRow>
								))}
						</TableHeader>

						<TableBody>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="border-b last:border-b-0"
									>
										{row
											.getVisibleCells()
											.map((cell) => (
												<TableCell
													key={cell.id}
													className="py-3 px-4"
												>
													{flexRender(
														cell
															.column
															.columnDef
															.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={feeColumns.length}
										className="py-6 text-center text-sm"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-end gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Prev
					</Button>

					<span className="text-sm">
						{table.getState().pagination.pageIndex + 1}
					</span>

					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default FeesTable;
