import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const getAvatar = (row) =>
	row.ProfilePhoto ||
	row.ProfilePictureUrl ||
	`https://ui-avatars.com/api/?name=${encodeURIComponent(row.FullName || "Teacher")}`;

export const TakeTeacherAttendanceColumns = (attendanceMap, setAttendance) => [
	{
		accessorKey: "TeacherID",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-medium text-primary">
				{row.original.TeacherID}
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
		header: "Teacher",
		cell: ({ row }) => (
			<div>
				<div className="font-medium">{row.original.FullName}</div>
				<div className="text-xs text-muted-foreground">
					{row.original.Subject || "—"}
				</div>
			</div>
		),
		size: 220,
	},

	{
		id: "attendance",
		header: "Attendance",
		cell: ({ row }) => {
			const teacherId = row.original.TeacherID;

			// ✅ find current value from ARRAY
			const current = attendanceMap.find(
				(x) => x.teacherId === teacherId,
			);

			const value = current?.status || "";

			const updateAttendance = (status) => {
				setAttendance((prev) => {
					const exists = prev.find(
						(x) => x.teacherId === teacherId,
					);

					if (exists) {
						return prev.map((x) =>
							x.teacherId === teacherId
								? { ...x, status }
								: x,
						);
					}

					return [...prev, { teacherId, status }];
				});
			};

			return (
				<RadioGroup
					className="flex gap-3"
					value={value}
					onValueChange={updateAttendance}
				>
					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="P" />
						<span className="text-sm">Present</span>
					</label>

					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="A" />
						<span className="text-sm">Absent</span>
					</label>

					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="L" />
						<span className="text-sm">Late</span>
					</label>

					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="H" />
						<span className="text-sm">Half Day</span>
					</label>

					<label className="flex items-center gap-1 cursor-pointer">
						<RadioGroupItem value="" />
						<span className="text-sm">Holiday</span>
					</label>
				</RadioGroup>
			);
		},
		size: 320,
	},
];
