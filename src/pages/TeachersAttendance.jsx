import { useMemo, useState } from "react";

import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import TeacherAttendanceHeader from "@/components/teacher-attendance/TeacherAttendanceHeader";
import { getTeacherAttendanceColumns } from "@/components/teacher-attendance/TeachersAttendanceColumns";
import { useTeacherAttendanceMatrixAll } from "@/hooks/useTeacherAttendance";
import { toast } from "sonner";

function TeacherAttendance() {
	const { data, isLoading } = useTeacherAttendanceMatrixAll();

	const [selectedMonth, setSelectedMonth] = useState(
		new Date().toISOString().slice(0, 7),
	);
	const [search, setSearch] = useState("");

	const filteredData = useMemo(() => {
		if (!data?.Data) return [];

		const [year, month] = selectedMonth.split("-");

		return data.Data.filter((row) => {
			// Search
			if (search) {
				const q = search.toLowerCase();
				const match =
					row.Name?.toLowerCase().includes(q) ||
					String(row.TeacherID).includes(q);

				if (!match) return false;
			}

			return true;
		}).map((row) => {
			const filteredRow = { ...row };

			Object.keys(filteredRow).forEach((key) => {
				if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
					if (!key.startsWith(`${year}-${month}`)) {
						delete filteredRow[key];
					}
				}
			});

			return filteredRow;
		});
	}, [data, search, selectedMonth]);

	const columns = useMemo(
		() => getTeacherAttendanceColumns(selectedMonth),
		[selectedMonth],
	);

	const handleExport = () => {
		if (!filteredData.length) {
			toast.error("No teachers to export");
			return;
		}

		const dateKeys = Object.keys(filteredData[0]).filter((k) =>
			/^\d{4}-\d{2}-\d{2}$/.test(k),
		);

		const headers = ["TeacherID", "Name", ...dateKeys];

		const attendanceMap = {
			P: "Present",
			A: "Absent",
			L: "Late",
			H: "Half Day",
			null: "-",
			"": "-",
		};

		const rows = filteredData.map((row) =>
			headers
				.map((h) => {
					let value = row[h] ?? "-";

					if (/^\d{4}-\d{2}-\d{2}$/.test(h)) {
						value = attendanceMap[row[h] ?? null] ?? "-";
						return `"${value}"`;
					}

					return `"${value}"`;
				})
				.join(","),
		);

		const csvContent = [headers.join(","), ...rows].join("\n");

		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8;",
		});

		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `teacher_attendance_${selectedMonth}_${Date.now()}.csv`;
		link.click();
	};

	if (isLoading) return <CircleLoader />;

	return (
		<section className="p-6">
			<TeacherAttendanceHeader
				selectedMonth={selectedMonth}
				onMonthChange={setSelectedMonth}
				search={search}
				onSearchChange={setSearch}
				onExport={handleExport}
			/>

			<TableLayout columns={columns} data={filteredData} />
		</section>
	);
}

export default TeacherAttendance;
