import { writeTeacherAttendanceForDate } from "@/api/teacherAttendance";
import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import { TakeTeacherAttendanceColumns } from "@/components/take-teacher-attendance/TakeTeacherAttendanceColumns";
import TakeTeacherAttendanceHeader from "@/components/take-teacher-attendance/TakeTeacherAttendanceHeader";
import { Button } from "@/components/ui/button";
import { useTeachers } from "@/hooks/useTeacher";
import { useTeacherAttendanceToday } from "@/hooks/useTeacherAttendance";
import { isToday } from "date-fns/isToday";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function TakeTeacherAttendance() {
	const { data, isLoading } = useTeachers();
	const { data: todayAttendance, isLoading: isTodayAttendanceLoading } =
		useTeacherAttendanceToday();

	const today = new Date().toISOString().slice(0, 10);

	const [selectedDate, setSelectedDate] = useState(today);
	const [sortBy, setSortBy] = useState("name");

	const [attendanceMap, setAttendanceMap] = useState([]);

	const columns = TakeTeacherAttendanceColumns(
		attendanceMap,
		setAttendanceMap,
	);

	const displayedTeachers = useMemo(() => {
		if (!data?.data) return [];

		const rows = [...data.data];

		if (sortBy === "name") {
			rows.sort((a, b) =>
				(a.FullName || "").localeCompare(b.FullName || ""),
			);
		}

		if (sortBy === "id") {
			rows.sort((a, b) => a.TeacherID - b.TeacherID);
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
				teacherId: x.TeacherID,
				status: x.Status,
			}));

		setAttendanceMap(mapped);
	}, [todayAttendance, selectedDate]);

	if (isLoading || isTodayAttendanceLoading) return <CircleLoader />;

	const handleSubmit = async () => {
		try {
			const payload = attendanceMap.map((x) => ({
				teacherID: x.teacherId,
				status: x.status,
			}));

			await writeTeacherAttendanceForDate(selectedDate, payload);
			toast.success("Attendance saved successfully");
		} catch (err) {
			console.error(err);
			toast.error("Failed to save attendance");
		}
	};

	console.log(attendanceMap);

	return (
		<section className="p-6 space-y-6">
			<TakeTeacherAttendanceHeader
				selectedDate={selectedDate}
				sortBy={sortBy}
				onDateChange={setSelectedDate}
				onSortChange={setSortBy}
			/>

			<TableLayout columns={columns} data={displayedTeachers} />

			<div className="flex">
				<Button className="ml-auto" onClick={handleSubmit}>
					Submit
				</Button>
			</div>
		</section>
	);
}
