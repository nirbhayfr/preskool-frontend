import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const getAvatar = (row) =>
	row.ProfilePhoto ||
	row.ProfilePictureUrl ||
	`https://ui-avatars.com/api/?name=${encodeURIComponent(
		row.FullName || row.Name || "Staff",
	)}`;

export const TakeStaffAttendanceColumns = (attendanceMap, setAttendance) => [
	{
		accessorKey: "StaffID",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-medium text-primary">
				{row.original.StaffID}
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
		header: "Staff",
		cell: ({ row }) => (
			<div>
				<div className="font-medium">
					{row.original.FullName || row.original.Name}
				</div>
				<div className="text-xs text-muted-foreground">
					{row.original.Department || row.original.Role || "—"}
				</div>
			</div>
		),
		size: 220,
	},

	{
		id: "attendance",
		header: "Attendance",
		cell: ({ row }) => {
			const staffId = row.original.StaffID;

			// ✅ find current value from array
			const record = attendanceMap.find((x) => x.staffId === staffId);
			const value = record?.status ?? "";

			const setValue = (val) => {
				setAttendance((prev) => {
					// remove old
					const filtered = prev.filter(
						(x) => x.staffId !== staffId,
					);

					// holiday (null / empty) = remove
					if (!val) return filtered;

					return [...filtered, { staffId, status: val }];
				});
			};

			return (
				<RadioGroup
					className="flex gap-3"
					value={value}
					onValueChange={setValue}
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
