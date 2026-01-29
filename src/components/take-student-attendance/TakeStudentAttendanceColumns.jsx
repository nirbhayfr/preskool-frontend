import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const getAvatar = (row) =>
	row.ProfilePhoto ||
	row.ProfilePictureUrl ||
	`https://ui-avatars.com/api/?name=${encodeURIComponent(
		row.FullName || "Student",
	)}`;

export const TakeStudentAttendanceColumns = (
	attendanceMap,
	setAttendanceMap,
) => [
	{
		accessorKey: "StudentID",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-medium text-primary">
				{row.original.StudentID}
			</span>
		),
		size: 80,
	},

	{
		id: "profile",
		header: "Photo",
		cell: ({ row }) => (
			<img
				src={getAvatar(row.original)}
				alt="Profile"
				className="h-9 w-9 rounded-full object-cover border"
			/>
		),
		size: 70,
	},

	{
		accessorKey: "FullName",
		header: "Student",
		cell: ({ row }) => (
			<div>
				<div className="font-medium">{row.original.Name}</div>
				<div className="text-xs text-muted-foreground">
					Class: {row.original.Class || "—"} {"  "} Section:{" "}
					{row.original.Section || "—"}
				</div>
			</div>
		),
		size: 220,
	},

	{
		id: "attendance",
		header: "Attendance",
		cell: ({ row }) => {
			const studentId = row.original.StudentID;

			const entry = attendanceMap.find(
				(x) => x.studentId === studentId,
			);

			const value = entry?.status ?? "";

			const updateAttendance = (status) => {
				setAttendanceMap((prev) => {
					const filtered = prev.filter(
						(x) => x.studentId !== studentId,
					);

					return [...filtered, { studentId, status }];
				});
			};

			return (
				<RadioGroup
					className="flex gap-4"
					value={value}
					onValueChange={updateAttendance}
				>
					{/* Present */}
					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="P" />
						<span className="text-sm">Present</span>
					</label>

					{/* Absent */}
					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="A" />
						<span className="text-sm">Absent</span>
					</label>

					{/* Late */}
					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="L" />
						<span className="text-sm">Late</span>
					</label>

					{/* Half Day */}
					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="H" />
						<span className="text-sm">Half Day</span>
					</label>
				</RadioGroup>
			);
		},
		size: 360,
	},
];
