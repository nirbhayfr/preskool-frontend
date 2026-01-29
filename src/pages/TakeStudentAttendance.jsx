import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import { TakeStudentAttendanceColumns } from "@/components/take-student-attendance/TakeStudentAttendanceColumns";
import TakeStudentAttendanceHeader from "@/components/take-student-attendance/TakeStudentAttendanceHeader";
import { Button } from "@/components/ui/button";
import {
	useWriteAttendanceByDate,
	useAttendanceMatrixByClass,
} from "@/hooks/useAttendance";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { classes, sections } from "@/data/basicData";

export default function TakeStudentAttendance() {
	const today = new Date().toISOString().slice(0, 10);

	const [selectedClass, setSelectedClass] = useState(classes[0] || "");
	const [selectedSection, setSelectedSection] = useState(sections[0] || "");
	const [selectedDate, setSelectedDate] = useState(today);
	const [sortBy, setSortBy] = useState("name");

	const [attendanceMap, setAttendanceMap] = useState([]);

	const { data: matrixData, isLoading } = useAttendanceMatrixByClass(
		selectedClass,
		selectedSection,
	);

	const writeMutation = useWriteAttendanceByDate();

	const displayedStudents = useMemo(() => {
		if (!matrixData?.Data) return [];

		const rows = [...matrixData.Data];

		if (sortBy === "name") {
			rows.sort((a, b) => (a.Name || "").localeCompare(b.Name || ""));
		}

		if (sortBy === "id") {
			rows.sort((a, b) => a.StudentID - b.StudentID);
		}

		return rows;
	}, [matrixData, sortBy]);

	useEffect(() => {
		if (!matrixData?.Data || !selectedDate) return;

		const mapped = matrixData.Data.filter((row) => row[selectedDate]).map(
			(row) => ({
				studentId: row.StudentID,
				status: row[selectedDate],
			}),
		);

		setAttendanceMap(mapped);
	}, [matrixData, selectedDate]);

	if (isLoading) return <CircleLoader />;

	console.log(matrixData);

	const handleSubmit = async () => {
		try {
			if (!selectedClass || !selectedSection) {
				toast.error("Class and Section are required");
				return;
			}

			const payload = attendanceMap.map((x) => ({
				studentID: x.studentId,
				status: x.status,
			}));

			await writeMutation.mutateAsync({
				date: selectedDate,
				data: payload,
			});

			toast.success("Student attendance saved successfully");
		} catch (err) {
			console.error(err);
			toast.error("Failed to save student attendance");
		}
	};

	return (
		<section className="p-6 space-y-6">
			<TakeStudentAttendanceHeader
				selectedDate={selectedDate}
				sortBy={sortBy}
				selectedClass={selectedClass}
				selectedSection={selectedSection}
				onDateChange={setSelectedDate}
				onSortChange={setSortBy}
				onClassChange={setSelectedClass}
				onSectionChange={setSelectedSection}
			/>

			<TableLayout
				columns={TakeStudentAttendanceColumns(
					attendanceMap,
					setAttendanceMap,
				)}
				data={displayedStudents}
			/>

			<div className="flex">
				<div className="ml-auto space-x-2">
					<Button
						onClick={() => {
							if (!displayedStudents.length) return;
							const allPresent = displayedStudents.map(
								(s) => ({
									studentId: s.StudentID,
									status: "P",
								}),
							);
							setAttendanceMap(allPresent);
							toast.success(
								"All students marked as Present",
							);
						}}
					>
						Mark All Present
					</Button>

					<Button onClick={handleSubmit}>Submit</Button>
				</div>
			</div>
		</section>
	);
}
