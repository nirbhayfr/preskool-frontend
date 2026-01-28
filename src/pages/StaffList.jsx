import { CircleLoader } from "@/components/layout/RouteLoader";
import TableLayout from "@/components/layout/Table";
import { staffColumns } from "@/components/staff-list/StaffColumns";
import StaffHeader from "@/components/staff-list/StaffHeader";
import { useDeleteStaff, useStaffs } from "@/hooks/useStaff";
import { handleExportPDF } from "@/utils/export";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function StaffList() {
	const { data, isLoading, error } = useStaffs();
	const { mutate: deleteStaff } = useDeleteStaff();
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [sortOrder, setSortOrder] = useState("asc");

	const displayedStaff = useMemo(() => {
		if (!data?.data?.length) return [];

		let staff = [...data.data];

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			staff = staff.filter((s) => {
				const fullName = s.FullName ?? "";
				const email = s.Email ?? "";
				const staffId = s.StaffID?.toString() ?? "";
				const role = s.Role ?? "";

				return (
					fullName.toLowerCase().includes(q) ||
					email.toLowerCase().includes(q) ||
					staffId.toLowerCase().includes(q) ||
					role.toLowerCase().includes(q)
				);
			});
		}

		staff.sort((a, b) => {
			const nameA = (a.FullName ?? "").toLowerCase();
			const nameB = (b.FullName ?? "").toLowerCase();

			if (sortOrder === "asc") return nameA.localeCompare(nameB);
			return nameB.localeCompare(nameA);
		});

		return staff;
	}, [data, searchQuery, sortOrder]);

	const handleDelete = (id) => {
		deleteStaff(id, {
			onSuccess: () => toast.success("Staff deleted successfully"),
			onError: () => toast.error("Failed to delete staff"),
		});
	};

	const handleEdit = (id) => {
		navigate(`/edit-staff/${id}`);
	};

	const STAFF_EXPORT_HEADERS = [
		"StaffID",
		"FullName",
		"Role",
		"Email",
		"ContactNumber",
		"Gender",
		"DateOfBirth",
		"Qualification",
		"ExperienceYears",
		"Address",
		"City",
		"State",
		"PostalCode",
		"Nationality",
		"DateOfJoining",
		"MaritalStatus",
		"EmergencyContactName",
		"EmergencyContactNumber",
		"Status",
		"ProfilePictureUrl",
		"ProfilePhoto",
		"VehicleNumber",
		"TransportNumber",
		"IDProofPhoto",
		"Salary",
	];

	const handleExport = (format) => {
		if (!displayedStaff.length) {
			toast.error("No staff to export");
			return;
		}

		if (format === "excel") {
			const rows = displayedStaff.map((s) =>
				STAFF_EXPORT_HEADERS.map((h) => `"${s[h] ?? "-"}"`).join(
					",",
				),
			);

			const csvContent = [
				STAFF_EXPORT_HEADERS.join(","),
				...rows,
			].join("\n");
			const blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8;",
			});

			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `staff_export_${Date.now()}.csv`;
			link.click();
		}

		if (format === "pdf") {
			handleExportPDF(displayedStaff, "Staff");
		}
	};

	if (isLoading) return <CircleLoader />;
	if (error) return "Error loading staff";

	return (
		<section className="p-6 capitalize">
			<StaffHeader
				onSearch={setSearchQuery}
				onSortChange={setSortOrder}
				onExport={handleExport}
			/>
			<TableLayout
				columns={staffColumns(handleDelete, handleEdit)}
				data={displayedStaff}
			/>
		</section>
	);
}

export default StaffList;
