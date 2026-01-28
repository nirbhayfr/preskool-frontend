import { useState, useMemo } from "react";
import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import { getStaffAttendanceColumns } from "@/components/staff-attendance/StaffAttendanceColumns";
import StaffAttendanceHeader from "@/components/staff-attendance/StaffAttendanceHeader";
import { useStaffAttendanceMatrixAll } from "@/hooks/useStaffAttendance";
import { toast } from "sonner";

export default function StaffAttendance() {
	const { data, isLoading } = useStaffAttendanceMatrixAll();

	const [selectedMonth, setSelectedMonth] = useState(
		new Date().toISOString().slice(0, 7),
	);
	const [search, setSearch] = useState("");

	const filteredData = useMemo(() => {
		if (!data?.Data) return [];

		const [year, month] = selectedMonth.split("-");

		return data.Data.filter((row) => {
			if (!row) return false;
			if (search) {
				const q = search.toLowerCase();
				const match =
					row.Name?.toLowerCase().includes(q) ||
					String(row.StaffID).includes(q);
				if (!match) return false;
			}
			return true;
		}).map((row) => {
			const filteredRow = { ...row };
			// keep only selected month dates
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
		() => getStaffAttendanceColumns(selectedMonth),
		[selectedMonth],
	);

	const handleExport = () => {
		if (!filteredData.length) {
			toast.error("No staff to export");
			return;
		}

		const dateKeys = Object.keys(filteredData[0]).filter((k) =>
			/^\d{4}-\d{2}-\d{2}$/.test(k),
		);

		const headers = ["StaffID", "Name", ...dateKeys];

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
		link.download = `staff_attendance_${selectedMonth}.csv`;
		link.click();
	};

	if (isLoading) return <CircleLoader />;

	return (
		<section className="p-6">
			<StaffAttendanceHeader
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
