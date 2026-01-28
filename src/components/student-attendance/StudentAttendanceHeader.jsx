import { CheckCheck, X, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { classes, sections } from "@/data/basicData";

export default function StudentAttendanceHeader({
	selectedMonth,
	onMonthChange,
	selectedClass,
	onClassChange,
	selectedSection,
	onSectionChange,
	search,
	onSearchChange,
	onClear,
	onExport,
}) {
	return (
		<div className="space-y-6">
			{/* STATUS LEGEND */}
			<div className="flex flex-wrap gap-3">
				{/* Present */}
				<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm font-medium">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-700 text-white">
						<CheckCheck className="h-4 w-4" />
					</span>
					Present
				</div>

				{/* Absent */}
				<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm font-medium">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-700 text-white">
						<X className="h-4 w-4" />
					</span>
					Absent
				</div>

				{/* Late */}
				<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm font-medium">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500 text-white">
						<Clock className="h-4 w-4" />
					</span>
					Late
				</div>

				{/* Half Day */}
				<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm font-medium">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-600 text-white">
						<Clock className="h-4 w-4" />
					</span>
					Half Day
				</div>

				{/* Holiday */}
				<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm font-medium">
					<span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-400 text-white">
						<Calendar className="h-4 w-4" />
					</span>
					Holiday
				</div>
			</div>

			{/* FILTERS */}
			<div className="flex flex-col sm:flex-row sm:flex-wrap items-end gap-4">
				<Input
					className="w-full sm:w-64"
					placeholder="Search student / ID"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
				/>

				<Input
					type="month"
					className="w-full sm:w-48"
					value={selectedMonth}
					onChange={(e) => onMonthChange(e.target.value)}
				/>

				<div className="flex w-full sm:w-auto gap-4">
					{/* CLASS */}
					<Select
						value={selectedClass}
						onValueChange={onClassChange}
					>
						<SelectTrigger className="w-full sm:w-40">
							<SelectValue placeholder="Class" />
						</SelectTrigger>
						<SelectContent>
							{classes.map((cls) => (
								<SelectItem key={cls} value={cls}>
									Class {cls}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* SECTION */}
					<Select
						value={selectedSection}
						onValueChange={onSectionChange}
					>
						<SelectTrigger className="w-full sm:w-40">
							<SelectValue placeholder="Section" />
						</SelectTrigger>
						<SelectContent>
							{sections.map((sec) => (
								<SelectItem key={sec} value={sec}>
									{sec}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Button
					variant="outline"
					className="w-full sm:w-auto"
					onClick={onClear}
				>
					Clear
				</Button>

				<Button
					variant="outline"
					className="w-full sm:w-auto"
					onClick={onExport}
				>
					Export CSV
				</Button>
			</div>
		</div>
	);
}
