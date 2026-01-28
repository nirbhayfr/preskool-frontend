"use client";

import * as React from "react";
import {
	useReactTable,
	getCoreRowModel,
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

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const data = [
	{
		id: "35013",
		name: "Janet",
		img: "/img/students/student-01.jpg",
		class: "III",
		section: "A",
		marks: "89%",
		cgpa: "4.2",
		status: "Pass",
	},
	{
		id: "35013",
		name: "Joann",
		img: "/img/students/student-02.jpg",
		class: "IV",
		section: "B",
		marks: "88%",
		cgpa: "3.2",
		status: "Pass",
	},
	{
		id: "35011",
		name: "Kathleen",
		img: "/img/students/student-03.jpg",
		class: "II",
		section: "A",
		marks: "69%",
		cgpa: "4.5",
		status: "Pass",
	},
	{
		id: "35010",
		name: "Gifford",
		img: "/img/students/student-04.jpg",
		class: "I",
		section: "B",
		marks: "21%",
		cgpa: "4.5",
		status: "Pass",
	},
	{
		id: "35009",
		name: "Lisa",
		img: "/img/students/student-05.jpg",
		class: "II",
		section: "B",
		marks: "31%",
		cgpa: "3.9",
		status: "Fail",
	},
	{
		id: "35021",
		name: "Janet",
		img: "/img/students/student-01.jpg",
		class: "III",
		section: "A",
		marks: "89%",
		cgpa: "4.2",
		status: "Pass",
	},
	{
		id: "35022",
		name: "Joann",
		img: "/img/students/student-02.jpg",
		class: "IV",
		section: "B",
		marks: "88%",
		cgpa: "3.2",
		status: "Pass",
	},
	{
		id: "35023",
		name: "Kathleen",
		img: "/img/students/student-03.jpg",
		class: "II",
		section: "A",
		marks: "69%",
		cgpa: "4.5",
		status: "Pass",
	},
	{
		id: "35024",
		name: "Gifford",
		img: "/img/students/student-04.jpg",
		class: "I",
		section: "B",
		marks: "21%",
		cgpa: "4.5",
		status: "Pass",
	},
	{
		id: "35025",
		name: "Lisa",
		img: "/img/students/student-05.jpg",
		class: "II",
		section: "B",
		marks: "31%",
		cgpa: "3.9",
		status: "Fail",
	},
];

const columns = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<img
					src={row.original.img}
					className="h-8 w-8 rounded-full object-cover"
				/>
				<span className="font-medium">{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: "class",
		header: "Class",
	},
	{
		accessorKey: "section",
		header: "Section",
	},
	{
		accessorKey: "marks",
		header: "Marks %",
	},
	{
		accessorKey: "cgpa",
		header: "CGPA",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge
				className={
					row.original.status === "Pass"
						? "bg-green-500 text-white"
						: "bg-red-500 text-white"
				}
			>
				{row.original.status}
			</Badge>
		),
	},
];

export function StudentMarksTable() {
	const [classFilter, setClassFilter] = React.useState("all");
	const [sectionFilter, setSectionFilter] = React.useState("all");

	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters: [
				classFilter !== "all"
					? { id: "class", value: classFilter }
					: null,
				sectionFilter !== "all"
					? { id: "section", value: sectionFilter }
					: null,
			].filter(Boolean),
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<Card className="rounded-sm">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-sm font-semibold">
					Student Marks
				</CardTitle>

				<div className="flex gap-2">
					<Select
						onValueChange={setClassFilter}
						defaultValue="all"
					>
						<SelectTrigger className="h-8 w-32.5">
							<SelectValue placeholder="All Classes" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All Classes
							</SelectItem>
							<SelectItem value="I">Class I</SelectItem>
							<SelectItem value="II">Class II</SelectItem>
							<SelectItem value="III">
								Class III
							</SelectItem>
							<SelectItem value="IV">Class IV</SelectItem>
						</SelectContent>
					</Select>

					<Select
						onValueChange={setSectionFilter}
						defaultValue="all"
					>
						<SelectTrigger className="h-8 w-35">
							<SelectValue placeholder="All Sections" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All Sections
							</SelectItem>
							<SelectItem value="A">Section A</SelectItem>
							<SelectItem value="B">Section B</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>

			<CardContent className="max-h-76 overflow-y-scroll">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{flexRender(
											header.column.columnDef
												.header,
											header.getContext()
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef
												.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
