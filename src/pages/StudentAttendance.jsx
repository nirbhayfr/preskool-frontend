import { useMemo, useState } from "react";
import { getAttendanceColumns } from "@/components/student-attendance/StudentAttendanceColumns";
import StudentAttendanceHeader from "@/components/student-attendance/StudentAttendanceHeader";
import { useAttendanceMatrixAll } from "@/hooks/useAttendance";
import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import { toast } from "sonner";

export default function StudentAttendance() {
	const [selectedMonth, setSelectedMonth] = useState("2026-01");
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedSection, setSelectedSection] = useState("");
	const [search, setSearch] = useState("");

	const columns = useMemo(
		() => getAttendanceColumns(selectedMonth),
		[selectedMonth],
	);

	const { data, isLoading } = useAttendanceMatrixAll();

	const filteredData = useMemo(() => {
		if (!data?.Data) return [];

		const [year, month] = selectedMonth.split("-");

		return data.Data.filter((row) => {
			if (search) {
				const q = search.toLowerCase();
				const match =
					row.Name?.toLowerCase().includes(q) ||
					String(row.StudentID).includes(q);

				if (!match) return false;
			}

			if (selectedClass && row.Class !== selectedClass) {
				return false;
			}

			if (selectedSection && row.Section !== selectedSection) {
				return false;
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
	}, [data, search, selectedClass, selectedSection, selectedMonth]);

	const handleExport = () => {
		if (!filteredData.length) {
			toast.error("No students to export");
			return;
		}

		const attendanceMap = {
			P: "Present",
			A: "Absent",
			L: "Late",
			H: "Half Day",
			null: "_",
			"": "-",
		};

		const dateKeys = Object.keys(filteredData[0]).filter((k) =>
			/^\d{4}-\d{2}-\d{2}$/.test(k),
		);

		const headers = [
			"StudentID",
			"Name",
			"Class",
			"Section",
			...dateKeys,
			"PresentCount",
			"AbsentCount",
			"AttendancePercentage",
		];

		const rows = filteredData.map((row) => {
			const present = dateKeys.filter((k) => row[k] === "P").length;
			const absent = dateKeys.filter((k) => row[k] === "A").length;
			const total = present + absent;
			const percentage = total
				? Math.round((present / total) * 100)
				: 0;

			return [
				row.StudentID,
				row.Name,
				row.Class,
				row.Section,
				...dateKeys.map(
					(k) => attendanceMap[row[k] ?? null] ?? "Holiday",
				),
				present,
				absent,
				percentage,
			]
				.map((v) => `"${v ?? ""}"`)
				.join(",");
		});

		const csvContent = [headers.join(","), ...rows].join("\n");

		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8;",
		});

		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `attendance_${selectedMonth}_${Date.now()}.csv`;
		link.click();
	};

	if (isLoading) return <CircleLoader />;

	return (
		<section className="p-6">
			<StudentAttendanceHeader
				selectedMonth={selectedMonth}
				onMonthChange={setSelectedMonth}
				selectedClass={selectedClass}
				onClassChange={setSelectedClass}
				selectedSection={selectedSection}
				onSectionChange={setSelectedSection}
				search={search}
				onSearchChange={setSearch}
				onExport={handleExport}
				onClear={() => {
					setSelectedMonth(new Date().toISOString().slice(0, 7));
					setSelectedClass("");
					setSelectedSection("");
					setSearch("");
				}}
			/>

			<TableLayout columns={columns} data={filteredData} />
		</section>
	);
}
