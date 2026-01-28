import { writeStaffAttendanceForDate } from "@/api/staffAttendance";
import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import { TakeStaffAttendanceColumns } from "@/components/take-staff-attendance/TakeStaffAttendanceColumns";
import TakeStaffAttendanceHeader from "@/components/take-staff-attendance/TakeStaffAttendanceHeader";
import { Button } from "@/components/ui/button";
import { useStaffs } from "@/hooks/useStaff";
import { useStaffAttendanceToday } from "@/hooks/useStaffAttendance";
import { isToday } from "date-fns/isToday";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function TakeStaffAttendance() {
	const { data, isLoading } = useStaffs();
	const { data: todayAttendance, isLoading: isTodayAttendanceLoading } =
		useStaffAttendanceToday();

	const today = new Date().toISOString().slice(0, 10);

	const [selectedDate, setSelectedDate] = useState(today);
	const [sortBy, setSortBy] = useState("name");

	const [attendanceMap, setAttendanceMap] = useState([]);

	const columns = TakeStaffAttendanceColumns(
		attendanceMap,
		setAttendanceMap,
	);

	const displayedStaff = useMemo(() => {
		if (!data?.data) return [];

		const rows = [...data.data];

		if (sortBy === "name") {
			rows.sort((a, b) =>
				(a.FullName || "").localeCompare(b.FullName || ""),
			);
		}

		if (sortBy === "id") {
			rows.sort((a, b) => a.StaffID - b.StaffID);
		}

		return rows;
	}, [data, sortBy]);

	useEffect(() => {
		if (!todayAttendance || !selectedDate) return;

		const today = isToday(new Date(selectedDate));

		if (!today) {
			setAttendanceMap([]);
			return;
		}

		const mapped = todayAttendance
			.filter((x) => x.Status)
			.map((x) => ({
				staffId: x.StaffID,
				status: x.Status,
			}));

		setAttendanceMap(mapped);
	}, [todayAttendance, selectedDate]);

	if (isLoading || isTodayAttendanceLoading) return <CircleLoader />;

	const handleSubmit = async () => {
		try {
			const payload = attendanceMap.map((x) => ({
				staffID: x.staffId,
				status: x.status,
			}));

			await writeStaffAttendanceForDate(selectedDate, payload);
			toast.success("Staff attendance saved successfully");
		} catch (err) {
			console.error(err);
			toast.error("Failed to save staff attendance");
		}
	};

	return (
		<section className="p-6 space-y-6">
			<TakeStaffAttendanceHeader
				selectedDate={selectedDate}
				sortBy={sortBy}
				onDateChange={setSelectedDate}
				onSortChange={setSortBy}
			/>

			<TableLayout columns={columns} data={displayedStaff} />

			<div className="flex">
				<Button className="ml-auto" onClick={handleSubmit}>
					Submit
				</Button>
			</div>
		</section>
	);
}
