import { AttendanceCell } from "../student-attendance/AttendanceCell";

function getDaysInMonth(year, month) {
	return new Date(year, month, 0).getDate();
}

function getWeekdayInitial(year, month, day) {
	return new Date(year, month - 1, day)
		.toLocaleDateString("en-US", { weekday: "short" })
		.charAt(0);
}

function countStatus(row, status) {
	return Object.values(row).filter((v) => v === status).length;
}

export function getStaffAttendanceColumns(selectedMonth) {
	const [year, month] = selectedMonth.split("-").map(Number);
	const daysInMonth = getDaysInMonth(year, month);

	const dateColumns = [];
	for (let day = 1; day <= daysInMonth; day++) {
		const dayKey = String(day).padStart(2, "0");
		const dateKey = `${year}-${String(month).padStart(2, "0")}-${dayKey}`;
		const weekday = getWeekdayInitial(year, month, day);

		dateColumns.push({
			accessorKey: dateKey,
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
			header: "Staff / Date",
			cell: ({ row }) => (
				<div>
					<div className="font-medium">{row.original.Name}</div>

					<div className="text-xs text-muted-foreground">
						ID: {row.original.StaffID}
					</div>
				</div>
			),
			size: 220,
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
