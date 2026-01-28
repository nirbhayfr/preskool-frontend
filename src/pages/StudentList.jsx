import { useState, useMemo } from "react";
import { studentsColumns } from "@/components/student-list/StudentColumns";
import StudentsHeader from "@/components/student-list/StudentsHeader";
import TableLayout from "@/components/layout/Table";
import { useDeleteStudent, useStudents } from "@/hooks/useStudents";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CircleLoader } from "@/components/layout/RouteLoader";
import { handleExportPDF } from "@/utils/export";

function StudentList() {
	const { data, isLoading, error } = useStudents();
	const { mutate: deleteStudent } = useDeleteStudent();
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState({
		class: "all",
		section: "all",
		status: "all",
	});
	const [sortOrder, setSortOrder] = useState("asc");

	const handleDelete = (id) => {
		deleteStudent(id, {
			onSuccess: () => {
				toast.success("Student deleted successfully");
			},
			onError: () => {
				toast.error("Failed to delete student");
			},
		});
	};

	const handleEdit = (id) => {
		navigate(`/edit-student/${id}`);
	};

	const displayedStudents = useMemo(() => {
		if (!data?.data) return [];

		let students = [...data.data];

		if (filters.class !== "all") {
			students = students.filter((s) => s.ClassID === filters.class);
		}
		if (filters.section !== "all") {
			students = students.filter(
				(s) => s.SectionID === filters.section.toUpperCase(),
			);
		}
		if (filters.status !== "all") {
			students = students.filter((s) => s.Status === filters.status);
		}

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			students = students.filter(
				(s) =>
					s.FullName.toLowerCase().includes(q) ||
					s.EmailAddress?.toLowerCase().includes(q) ||
					"" ||
					s.StudentID?.toString().includes(q) ||
					"",
			);
		}

		students.sort((a, b) => {
			const nameA = a.FullName?.toLowerCase() || "";
			const nameB = b.FullName?.toLowerCase() || "";
			return sortOrder === "asc"
				? nameA.localeCompare(nameB)
				: nameB.localeCompare(nameA);
		});

		return students;
	}, [data, filters, searchQuery, sortOrder]);

	const handleExport = (format) => {
		if (!displayedStudents.length) {
			toast.error("No students to export");
			return;
		}

		if (format === "excel") {
			const headers = [
				"StudentID",
				"FullName",
				"DOB",
				"Gender",
				"ClassID",
				"SectionID",
				"Address",
				"ContactNumber",
				"EmailAddress",
				"Nationality",
				"IdentificationNumber",
				"EnrollmentNumber",
				"AdmissionDate",
				"ProgramName",
				"YearOrSemester",
				"PreviousAcademicRecord",
				"GPAOrMarks",
				"AttendancePercentage",
				"SubjectsTaken",
				"AcademicStatus",
				"GuardianName",
				"GuardianRelation",
				"GuardianContact",
				"GuardianOccupation",
				"GuardianAddress",
				"PhotoUrl",
				"Status",
				"RollNo",
				"AdmissionNo",
				"JoiningDate",
				"Program",
				"YearSemester",
				"PreviousRecord",
				"GPA",
				"Attendance",
				"Subjects",
				"FatherPhoto",
				"MotherPhoto",
				"GuardianPhoto",
			];

			const rows = displayedStudents.map((s) =>
				headers.map((h) => `"${s[h] ?? ""}"`).join(","),
			);

			const csvContent = [headers.join(","), ...rows].join("\n");
			const blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8;",
			});
			const link = document.createElement("a");
			console.log(link, blob, csvContent);
			link.href = URL.createObjectURL(blob);
			link.download = `students_export_${Date.now()}.csv`;
			link.click();
		}

		if (format === "pdf") {
			handleExportPDF(displayedStudents, "Students");
		}
	};

	if (isLoading) return <CircleLoader />;
	if (error) return "Error loading students";

	return (
		<section className="p-6 capitalize">
			<StudentsHeader
				onSearch={setSearchQuery}
				onFilterChange={setFilters}
				onSortChange={setSortOrder}
				onExport={handleExport}
			/>
			<TableLayout
				columns={studentsColumns(handleDelete, handleEdit)}
				data={displayedStudents}
			/>
		</section>
	);
}

export default StudentList;
