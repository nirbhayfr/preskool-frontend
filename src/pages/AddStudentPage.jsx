import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { User, Shield, Book, ChevronRight, UserPlus } from "lucide-react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateStudent, useStudent } from "@/hooks/useStudents";
import { toast } from "sonner";
import { Section } from "./AddTeacherPage";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const STUDENT_FIELDS = [
	{ name: "fullName", required: true },
	{ name: "dob", required: true },
	{ name: "gender", required: true },
	{ name: "class", required: true },
	{ name: "section", required: true },
	{ name: "rollNo" },
	{ name: "admissionNo" },
	{ name: "joiningDate" },
	{ name: "program" },
	{ name: "yearSemester" },
	{ name: "previousRecord" },
	{ name: "gpa" },
	{ name: "attendance" },
	{ name: "subjects" },
	{ name: "status" },
	{ name: "address", required: true },
	{ name: "contact", required: true },
	{ name: "email" },
	{ name: "nationality" },
	{ name: "photo" },
	{ name: "fatherPhoto" },
	{ name: "motherPhoto" },
	{ name: "guardianPhoto" },
	{ name: "guardianName" },
	{ name: "guardianRelation" },
	{ name: "guardianContact" },
	{ name: "guardianOccupation" },
	{ name: "guardianAddress" },
];

const REQUIRED_FIELDS = STUDENT_FIELDS.filter((f) => f.required).map(
	(f) => f.name,
);

const EMPTY_DEFAULTS = STUDENT_FIELDS.reduce(
	(acc, field) => {
		acc[field.name] = "";
		return acc;
	},
	{ studentId: undefined },
);

const studentSchema = z.object({
	studentId: z.number().optional(),
	fullName: z.string().min(1),
	dob: z.string().min(1),
	gender: z.string().min(1),
	class: z.string().min(1),
	section: z.string().min(1),

	rollNo: z.string().optional(),
	admissionNo: z.string().optional(),
	joiningDate: z.string().optional(),
	program: z.string().optional(),
	yearSemester: z.string().optional(),
	previousRecord: z.string().optional(),
	gpa: z.string().optional(),
	attendance: z.string().optional(),
	subjects: z.string().optional(),
	status: z.string().optional(),

	address: z.string().min(1),
	contact: z.string(),
	email: z.string().optional(),
	nationality: z.string().optional(),

	photo: z.string().optional(),
	fatherPhoto: z.string().optional(),
	motherPhoto: z.string().optional(),
	guardianPhoto: z.string().optional(),
	guardianName: z.string().optional(),
	guardianRelation: z.string().optional(),
	guardianContact: z.string().optional(),
	guardianOccupation: z.string().optional(),
	guardianAddress: z.string().optional(),
});

function InputField({ form, name, type = "text", colSpan, options }) {
	const isSelect = Array.isArray(options);
	const label = name.replace(/([A-Z])/g, " $1").trim();

	const required = REQUIRED_FIELDS.includes(name);

	const fieldId = `field-${name}`;

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className={colSpan ? "col-span-full" : ""}>
					{/* Accessible label */}
					<FormLabel
						htmlFor={isSelect ? undefined : fieldId}
						id={`${fieldId}-label`}
						className="flex items-center gap-1 capitalize"
					>
						{label}
						{required && (
							<span className="text-red-500 font-medium">
								*
							</span>
						)}
					</FormLabel>

					<FormControl>
						{isSelect ? (
							<Select
								value={field.value || ""}
								onValueChange={field.onChange}
							>
								{/* Link label for screen readers */}
								<SelectTrigger
									aria-labelledby={`${fieldId}-label`}
									id={fieldId}
								>
									<SelectValue
										placeholder={`Select ${label}`}
									/>
								</SelectTrigger>
								<SelectContent>
									{options.map((opt) => (
										<SelectItem
											key={opt}
											value={opt}
										>
											{opt}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<Input
								{...field}
								type={type}
								id={fieldId}
								aria-labelledby={`${fieldId}-label`}
							/>
						)}
					</FormControl>

					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function formatDateForInput(date) {
	if (!date) return "";
	return date.split("T")[0];
}

export default function StudentFormPage({ defaultValues }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = Boolean(id);

	const form = useForm({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			...EMPTY_DEFAULTS,
			status: "Active",
			...defaultValues,
		},
	});

	const { data: student } = useStudent(id, { enabled: isEdit });
	const { mutate: saveStudent, isLoading } = useCreateStudent();

	useEffect(() => {
		if (student) {
			const mappedStudent = {
				studentId: student.StudentID ?? undefined,
				fullName: student.FullName ?? "",
				dob: formatDateForInput(student.DOB),
				gender: student.Gender ?? "",
				class: student.ClassID ?? "",
				section: student.SectionID ?? "",
				rollNo: student.RollNo ?? "",
				admissionNo: student.AdmissionNo ?? "",
				joiningDate: formatDateForInput(student.JoiningDate),
				program: student.Program ?? "",
				yearSemester: student.YearSemester ?? "",
				previousRecord: student.PreviousRecord ?? "",
				gpa: student.GPA ?? "",
				attendance: student.Attendance ?? "",
				subjects: student.Subjects ?? "",
				status: student.Status ?? "Active",
				address: student.Address ?? "",
				contact: student.ContactNumber ?? "",
				email: student.EmailAddress ?? "",
				nationality: student.Nationality ?? "",
				photo: student.PhotoUrl ?? "",
				fatherPhoto: student.FatherPhoto ?? "",
				motherPhoto: student.MotherPhoto ?? "",
				guardianPhoto: student.GuardianPhoto ?? "",
				guardianName: student.GuardianName ?? "",
				guardianRelation: student.GuardianRelation ?? "",
				guardianContact: student.GuardianContact ?? "",
				guardianOccupation: student.GuardianOccupation ?? "",
				guardianAddress: student.GuardianAddress ?? "",
			};

			form.reset({
				...EMPTY_DEFAULTS,
				...mappedStudent,
			});
		}
	}, [student]);

	const avatar =
		form.watch("photo") ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(
			form.watch("fullName") || "Student",
		)}`;

	const onSubmit = (values) => {
		saveStudent(
			{ ...values, studentId: isEdit ? Number(id) : undefined },
			{
				onSuccess: () => {
					toast.success(
						isEdit
							? "Student updated successfully"
							: "Student saved successfully",
					);
					navigate("/student-list");
				},
			},
		);
	};

	return (
		<section className="w-full p-6 space-y-8 text-foreground">
			<div>
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<UserPlus className="h-6 w-6" />
					{isEdit ? "Edit Student" : "Add Student"}
				</h1>
				<div className="mt-2 flex items-center text-sm text-muted-foreground gap-1">
					<span>Dashboard</span>
					<ChevronRight className="h-4 w-4" />
					<span>Students</span>
					<ChevronRight className="h-4 w-4" />
					<span className="font-medium text-foreground">
						{isEdit ? "Edit Student" : "Add Student"}
					</span>
				</div>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					{/* Profile Images */}
					<div className="flex flex-col md:flex-row items-center gap-6">
						<img
							src={avatar}
							alt="Profile"
							className="h-28 w-28 rounded-xl border border-border object-cover bg-muted"
						/>
						<div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
							<InputField form={form} name="photo" />
							<InputField form={form} name="fatherPhoto" />
							<InputField form={form} name="motherPhoto" />
							<InputField
								form={form}
								name="guardianPhoto"
							/>
						</div>
					</div>

					{/* Personal Information */}
					<Section title="Personal Information" icon={User}>
						<InputField form={form} name="fullName" />
						<InputField form={form} name="dob" type="date" />
						<InputField form={form} name="gender" />
						<InputField form={form} name="class" />
						<InputField form={form} name="section" />
					</Section>

					{/* Academic Information */}
					<Section title="Academic Information" icon={Book}>
						<InputField form={form} name="rollNo" />
						<InputField form={form} name="admissionNo" />
						<InputField
							form={form}
							name="joiningDate"
							type="date"
						/>
						<InputField form={form} name="program" />
						<InputField form={form} name="yearSemester" />
						<InputField form={form} name="previousRecord" />
						<InputField form={form} name="gpa" />
						<InputField form={form} name="attendance" />
						<InputField form={form} name="subjects" colSpan />
						<InputField
							form={form}
							name="status"
							options={["Active", "Inactive"]}
						/>
					</Section>

					{/* Contact Information */}
					<Section title="Contact Information" icon={Shield}>
						<InputField form={form} name="address" colSpan />
						<InputField form={form} name="contact" />
						<InputField form={form} name="email" />
						<InputField form={form} name="nationality" />
					</Section>

					{/* Guardian Information */}
					<Section title="Guardian Information" icon={User}>
						<InputField form={form} name="guardianName" />
						<InputField form={form} name="guardianRelation" />
						<InputField form={form} name="guardianContact" />
						<InputField
							form={form}
							name="guardianOccupation"
						/>
						<InputField
							form={form}
							name="guardianAddress"
							colSpan
						/>
					</Section>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-6">
						<Button type="submit" disabled={isLoading}>
							{isLoading
								? isEdit
									? "Updating..."
									: "Saving..."
								: isEdit
									? "Update Student"
									: "Save Student"}
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
}
