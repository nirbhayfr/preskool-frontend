import { useMemo } from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

function ExamsResultsCard() {
	const data = useMemo(
		() => [
			{
				subject: "English (150)",
				max: 100,
				min: 35,
				obtained: 65,
				result: "Pass",
			},
			{
				subject: "Mathematics (214)",
				max: 100,
				min: 35,
				obtained: 73,
				result: "Pass",
			},
			{
				subject: "Physics (120)",
				max: 100,
				min: 35,
				obtained: 55,
				result: "Pass",
			},
			{
				subject: "Chemistry (110)",
				max: 100,
				min: 35,
				obtained: 90,
				result: "Pass",
			},
			{
				subject: "Spanish (140)",
				max: 100,
				min: 35,
				obtained: 88,
				result: "Pass",
			},
		],
		[]
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: "subject",
				header: "Subject",
			},
			{
				accessorKey: "max",
				header: "Max Marks",
			},
			{
				accessorKey: "min",
				header: "Min Marks",
			},
			{
				accessorKey: "obtained",
				header: "Marks Obtained",
			},
			{
				accessorKey: "result",
				header: "Result",
				cell: ({ row }) => {
					const result = row.original.result;

					return (
						<Badge
							className={
								result === "Pass"
									? "bg-green-100 text-green-700 border border-green-200"
									: "bg-red-100 text-red-700 border border-red-200"
							}
						>
							{result}
						</Badge>
					);
				},
			},
		],
		[]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Card className="rounded-sm">
			<CardHeader className="py-3">
				<CardTitle className="text-lg font-semibold">
					Monthly Test (May)
				</CardTitle>
			</CardHeader>

			<CardContent className="pt-0 space-y-6">
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

						<TableBody className="[&>tr>td]:py-3">
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row
											.getVisibleCells()
											.map((cell) => (
												<TableCell
													key={cell.id}
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
										colSpan={columns.length}
										className="text-center text-sm"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className="grid grid-cols-2 gap-4 md:grid-cols-5 px-2">
					<div>
						<p className="text-xs text-muted-foreground">
							Rank
						</p>
						<p className="text-sm font-medium">30</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">
							Total
						</p>
						<p className="text-sm font-medium">500</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">
							Marks Obtained
						</p>
						<p className="text-sm font-medium">395</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">
							Percentage
						</p>
						<p className="text-sm font-medium">79.50%</p>
					</div>

					<div className="">
						<p className="text-xs text-muted-foreground">
							Result
						</p>
						<p className="text-sm font-medium text-green-600">
							Pass
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default ExamsResultsCard;
