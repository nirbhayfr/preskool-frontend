import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

const formatValue = (value) => value ?? "—";

export const teachersColumns = (onDelete, onEdit) => [
	{
		accessorKey: "TeacherID",
		header: "Teacher ID",
		cell: ({ row }) => (
			<span className="text-primary font-medium">
				{formatValue(row.original.TeacherID)}
			</span>
		),
	},

	{
		accessorKey: "ProfilePhoto",
		header: "Profile Photo",
		cell: ({ row }) => (
			<img
				src={
					row.original.ProfilePhoto ||
					row.original.ProfilePictureUrl ||
					`https://ui-avatars.com/api/?name=${encodeURIComponent(row.original.FullName || "Teacher")}`
				}
				alt="Profile"
				className="h-10 w-10 rounded-full object-cover border"
			/>
		),
	},

	{
		accessorKey: "FullName",
		header: "Full Name",
		cell: ({ row }) => formatValue(row.original.FullName),
	},
	{
		accessorKey: "Gender",
		header: "Gender",
		cell: ({ row }) => formatValue(row.original.Gender),
	},
	{
		accessorKey: "DateOfBirth",
		header: "DOB",
		cell: ({ row }) =>
			row.original.DateOfBirth
				? new Date(row.original.DateOfBirth).toLocaleDateString()
				: "—",
	},
	{
		accessorKey: "Subject",
		header: "Subject",
		cell: ({ row }) => formatValue(row.original.Subject),
	},
	{
		accessorKey: "Email",
		header: "Email",
		cell: ({ row }) => formatValue(row.original.Email),
	},
	{
		accessorKey: "ContactNumber",
		header: "Contact No",
		cell: ({ row }) => formatValue(row.original.ContactNumber),
	},
	{
		accessorKey: "Qualification",
		header: "Qualification",
		cell: ({ row }) => formatValue(row.original.Qualification),
	},
	{
		accessorKey: "ExperienceYears",
		header: "Experience (Yrs)",
		cell: ({ row }) => formatValue(row.original.ExperienceYears),
	},
	{
		accessorKey: "Address",
		header: "Address",
		cell: ({ row }) => formatValue(row.original.Address),
	},
	{
		accessorKey: "City",
		header: "City",
		cell: ({ row }) => formatValue(row.original.City),
	},
	{
		accessorKey: "State",
		header: "State",
		cell: ({ row }) => formatValue(row.original.State),
	},
	{
		accessorKey: "PostalCode",
		header: "Postal Code",
		cell: ({ row }) => formatValue(row.original.PostalCode),
	},
	{
		accessorKey: "Nationality",
		header: "Nationality",
		cell: ({ row }) => formatValue(row.original.Nationality),
	},
	{
		accessorKey: "DateOfJoining",
		header: "Joining Date",
		cell: ({ row }) =>
			row.original.DateOfJoining
				? new Date(row.original.DateOfJoining).toLocaleDateString()
				: "—",
	},
	{
		accessorKey: "BloodGroup",
		header: "Blood Group",
		cell: ({ row }) => formatValue(row.original.BloodGroup),
	},
	{
		accessorKey: "MaritalStatus",
		header: "Marital Status",
		cell: ({ row }) => formatValue(row.original.MaritalStatus),
	},
	{
		accessorKey: "VehicleNumber",
		header: "Vehicle Number",
		cell: ({ row }) => formatValue(row.original.VehicleNumber),
	},
	{
		accessorKey: "TransportNumber",
		header: "Transport Number",
		cell: ({ row }) => formatValue(row.original.TransportNumber),
	},
	{
		accessorKey: "ProfilePictureUrl",
		header: "Profile Picture URL",
		cell: ({ row }) => formatValue(row.original.ProfilePictureUrl),
	},
	{
		accessorKey: "IDProofPhoto",
		header: "ID Proof Photo",
		cell: ({ row }) => formatValue(row.original.IDProofPhoto),
	},
	{
		accessorKey: "Salary",
		header: "Salary",
		cell: ({ row }) => formatValue(row.original.Salary),
	},

	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => (
			<div className="flex gap-2">
				<Button
					size="icon"
					variant="outline"
					onClick={() => onEdit(row.original.TeacherID)}
				>
					<Pencil className="h-4 w-4" />
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button size="icon" variant="destructive">
							<Trash className="h-4 w-4" />
						</Button>
					</AlertDialogTrigger>

					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Delete teacher?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>

						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() =>
									onDelete(row.original.TeacherID)
								}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		),
	},
];
