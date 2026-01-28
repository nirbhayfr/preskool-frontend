import { AttendanceCell } from "../student-attendance/AttendanceCell";

function getDaysInMonth(year, month) {
	return new Date(year, month, 0).getDate();
}

function getWeekdayInitial(dateStr) {
	return new Date(dateStr)
		.toLocaleDateString("en-US", { weekday: "short" })
		.charAt(0);
}

function countStatus(row, status) {
	return Object.values(row).filter((v) => v === status).length;
}

export function getTeacherAttendanceColumns(selectedMonth) {
	const [year, month] = selectedMonth.split("-").map(Number);
	const daysInMonth = getDaysInMonth(year, month);

	const dateColumns = [];

	for (let day = 1; day <= daysInMonth; day++) {
		const dayKey = String(day).padStart(2, "0");
		const fullDateKey = `${year}-${String(month).padStart(2, "0")}-${dayKey}`;
		const weekday = getWeekdayInitial(fullDateKey);

		dateColumns.push({
			accessorKey: fullDateKey,
			header: () => (
				<div className="text-center leading-tight">
					<div>{dayKey}</div>
					<div className="text-xs text-muted-foreground">
						{weekday}
					</div>
				</div>
			),
			cell: ({ getValue }) => <AttendanceCell value={getValue()} />,
			size: 48,
		});
	}

	return [
		{
			accessorKey: "Name",
			header: "Teacher / Date",
			cell: ({ row }) => (
				<div>
					<div className="font-medium">{row.original.Name}</div>
					<div className="text-xs text-muted-foreground">
						ID: {row.original.TeacherID}
					</div>
				</div>
			),
			size: 220,
		},

		{
			id: "percentage",
			header: "%",
			cell: ({ row }) => {
				const present = countStatus(row.original, "P");
				const absent = countStatus(row.original, "A");
				const total = present + absent;

				if (!total) return "—";

				return (
					<span className="font-medium">
						{Math.round((present / total) * 100)}%
					</span>
				);
			},
			size: 50,
		},

		{
			id: "presentCount",
			header: "P",
			cell: ({ row }) => (
				<span className="font-medium text-emerald-700">
					{countStatus(row.original, "P")}
				</span>
			),
			size: 40,
		},

		{
			id: "absentCount",
			header: "A",
			cell: ({ row }) => (
				<span className="font-medium text-red-700">
					{countStatus(row.original, "A")}
				</span>
			),
			size: 40,
		},

		...dateColumns,
	];
}
