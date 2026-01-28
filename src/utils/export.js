import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function handleExportPDF(data, type = "Students") {
	const doc = new jsPDF("l", "mm", "a4");
	doc.setFontSize(16);
	doc.text(`${type} List`, 14, 20);

	let columns = [];
	let headers = [];

	switch (type) {
		case "Students":
			columns = [
				"StudentID",
				"FullName",
				"DOB",
				"Gender",
				"ClassID",
				"SectionID",
				"RollNo",
				"AdmissionNo",

				"ContactNumber",
				"EmailAddress",
			];
			headers = [
				"ID",
				"Name",
				"DOB",
				"Gender",
				"Class",
				"Section",
				"Roll No",
				"Admission No",
				"Contact",
				"Email",
			];
			break;

		case "Teachers":
			columns = [
				"TeacherID",
				"FullName",
				"Email",
				"ContactNumber",
				"Subject",
				"Gender",
			];

			headers = [
				"ID",
				"Name",
				"Email",
				"Contact",
				"Subject",
				"Gender",
			];

			break;

		case "Staff":
			columns = [
				"StaffID",
				"FullName",
				"Email",
				"ContactNumber",
				"Role",
				"Address",
			];

			headers = ["ID", "Name", "Email", "Contact", "Role", "Address"];

			break;

		default:
			columns = Object.keys(data[0] || {});
			headers = columns;
	}

	const rows = data.map((item) => columns.map((col) => item[col] ?? ""));

	autoTable(doc, {
		head: [headers],
		body: rows,
		startY: 30,
		styles: {
			fontSize: 9,
			cellPadding: 3,
			overflow: "linebreak",
		},
		headStyles: {
			fillColor: [0, 123, 255],
			textColor: 255,
			fontStyle: "bold",
		},
		columnStyles: columns.reduce((acc, col, index) => {
			acc[index] = { cellWidth: "wrap" };
			return acc;
		}, {}),
		tableWidth: "auto",
	});

	doc.save(`${type}_Export_${Date.now()}.pdf`);
}
