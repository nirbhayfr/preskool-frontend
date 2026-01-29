import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// import your constants
import { classes, sections } from "@/data/basicData";

export default function TakeStudentAttendanceHeader({
	selectedDate,
	sortBy,
	selectedClass,
	selectedSection,
	onDateChange,
	onSortChange,
	onClassChange,
	onSectionChange,
}) {
	return (
		<div className="flex flex-wrap items-end gap-4">
			{/* Date */}
			<div className="flex flex-col gap-1">
				<label className="text-sm font-medium">Date</label>
				<Input
					type="date"
					value={selectedDate}
					onChange={(e) => onDateChange(e.target.value)}
					className="w-45"
				/>
			</div>

			{/* Class */}
			<div className="flex flex-col gap-1">
				<label className="text-sm font-medium">Class</label>
				<Select value={selectedClass} onValueChange={onClassChange}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Select Class" />
					</SelectTrigger>
					<SelectContent>
						{classes.map((cls) => (
							<SelectItem key={cls} value={cls}>
								{cls}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Section */}
			<div className="flex flex-col gap-1">
				<label className="text-sm font-medium">Section</label>
				<Select
					value={selectedSection}
					onValueChange={onSectionChange}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Select Section" />
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

			{/* Sort */}
			<div className="flex flex-col gap-1">
				<label className="text-sm font-medium">Sort By</label>
				<Select value={sortBy} onValueChange={onSortChange}>
					<SelectTrigger className="w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="name">Name</SelectItem>
						<SelectItem value="id">Student ID</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
