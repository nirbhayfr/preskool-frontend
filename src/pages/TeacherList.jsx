import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import { teachersColumns } from "@/components/teacher-list/TeachersColumns";
import TeachersHeader from "@/components/teacher-list/TeachersHeader";
import { useDeleteTeacher, useTeachers } from "@/hooks/useTeacher";
import { handleExportPDF } from "@/utils/export";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function TeacherList() {
	const { data, isLoading, error } = useTeachers();
	const { mutate: deleteTeacher } = useDeleteTeacher();
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [sortOrder, setSortOrder] = useState("asc");

	const displayedTeachers = useMemo(() => {
		if (!data?.data) return [];

		let teachers = [...data.data];

		if (searchQuery) {
			const q = searchQuery.toLowerCase();

			teachers = teachers.filter(
				(t) =>
					t.FullName?.toLowerCase().includes(q) ||
					t.Email?.toLowerCase().includes(q) ||
					t.TeacherID?.toString().includes(q) ||
					t.Subject?.toLowerCase().includes(q),
			);
		}

		teachers.sort((a, b) => {
			const nameA = a.FullName?.toLowerCase() || "";
			const nameB = b.FullName?.toLowerCase() || "";

			return sortOrder === "asc"
				? nameA.localeCompare(nameB)
				: nameB.localeCompare(nameA);
		});

		return teachers;
	}, [data, searchQuery, sortOrder]);

	const handleDelete = (id) => {
		deleteTeacher(id, {
			onSuccess: () => {
				toast.success("Teacher deleted successfully");
			},
			onError: () => {
				toast.error("Failed to delete teacher");
			},
		});
	};

	const handleEdit = (id) => {
		navigate(`/edit-teacher/${id}`);
	};

	const TEACHER_EXPORT_HEADERS = [
		"TeacherID",
		"FullName",
		"Subject",
		"Email",
		"ContactNumber",
		"Gender",

		"Qualification",
		"ExperienceYears",

		"Address",
		"City",
		"State",
		"PostalCode",
		"Nationality",

		"DateOfBirth",
		"DateOfJoining",

		"BloodGroup",
		"MaritalStatus",

		"EmergencyContactName",
		"EmergencyContactNumber",

		"VehicleNumber",
		"TransportNumber",

		"Salary",

		"ProfilePictureUrl",
		"ProfilePhoto",
		"IDProofPhoto",
	];

	const handleExport = (format) => {
		if (!displayedTeachers.length) {
			toast.error("No teachers to export");
			return;
		}

		if (format === "excel") {
			const headers = TEACHER_EXPORT_HEADERS;

			const rows = displayedTeachers.map((t) =>
				headers.map((h) => `"${t[h] ?? ""}"`).join(","),
			);

			const csvContent = [headers.join(","), ...rows].join("\n");

			const blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8;",
			});

			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `teachers_export_${Date.now()}.csv`;
			link.click();
		}

		if (format === "pdf") {
			handleExportPDF(displayedTeachers, "Teachers");
		}
	};

	if (isLoading) return <CircleLoader />;
	if (error) return "Error loading students";

	return (
		<section className="p-6 capitalize">
			<TeachersHeader
				onSearch={setSearchQuery}
				onSortChange={setSortOrder}
				onExport={handleExport}
			/>
			<TableLayout
				columns={teachersColumns(handleDelete, handleEdit)}
				data={displayedTeachers}
			/>
		</section>
	);
}

export default TeacherList;
