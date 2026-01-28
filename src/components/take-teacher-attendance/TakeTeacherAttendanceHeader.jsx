import { CheckCheck, X, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function TakeTeacherAttendanceHeader({
	selectedDate,
	onDateChange,
	sortBy,
	onSortChange,
}) {
	const today = new Date().toISOString().slice(0, 10);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<h2 className="text-2xl font-semibold">
					Teacher Attendance
				</h2>

				<div className="flex flex-col sm:flex-row sm:items-end gap-4">
					<Input
						type="date"
						className="w-full sm:w-48"
						max={today}
						value={selectedDate}
						onChange={(e) => onDateChange(e.target.value)}
					/>

					{/* Sort */}
					<Select value={sortBy} onValueChange={onSortChange}>
						<SelectTrigger className="w-full sm:w-44">
							<SelectValue placeholder="Sort By" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="name">
								Name (A–Z)
							</SelectItem>
							<SelectItem value="id">
								Teacher ID
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
