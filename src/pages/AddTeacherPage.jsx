import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	User,
	Briefcase,
	Phone,
	Shield,
	Car,
	ChevronRight,
	UserPlus,
} from "lucide-react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUpsertTeacher, useTeacher } from "@/hooks/useTeacher";
import { toast } from "sonner";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { decryptData } from "@/utils/crypto";

const teacherSchema = z.object({
	teacherId: z.number().optional(),

	fullName: z.string().min(1),
	subject: z.string().min(1),
	email: z.string().email(),
	contactNumber: z.string(),
	gender: z.string().min(1),

	profilePictureUrl: z.string().optional(),
	profilePhoto: z.string().optional(),
	idProofPhoto: z.string().optional(),

	dateOfBirth: z.string().optional(),
	qualification: z.string().optional(),
	experienceYears: z.coerce.number().optional(),

	address: z.string().min(1),
	city: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	nationality: z.string().optional(),

	dateOfJoining: z.string().optional(),
	bloodGroup: z.string().optional(),
	maritalStatus: z.string().optional(),

	salary: z.coerce.number().optional(),

	emergencyContactName: z.string().optional(),
	emergencyContactNumber: z.string().optional(),

	vehicleNumber: z.string().optional(),
	transportNumber: z.string().optional(),
});

const TEACHER_FIELDS = [
	{ name: "fullName", required: true },
	{ name: "subject", required: true },
	{ name: "email", required: true },
	{ name: "contactNumber", required: true },
	{ name: "gender", required: true },

	{ name: "qualification" },
	{ name: "experienceYears" },

	{ name: "address", required: true },
	{ name: "city" },
	{ name: "state" },
	{ name: "postalCode" },
	{ name: "nationality" },

	{ name: "dateOfBirth" },
	{ name: "dateOfJoining" },

	{ name: "bloodGroup" },
	{ name: "maritalStatus" },

	{ name: "emergencyContactName" },
	{ name: "emergencyContactNumber" },

	{ name: "salary" },

	{ name: "profilePhoto" },
	{ name: "idProofPhoto" },

	{ name: "vehicleNumber" },
	{ name: "transportNumber" },
];

const REQUIRED_FIELDS = TEACHER_FIELDS.filter((f) => f.required).map(
	(f) => f.name,
);

const EMPTY_DEFAULTS = TEACHER_FIELDS.reduce(
	(acc, field) => {
		acc[field.name] = "";
		return acc;
	},
	{ teacherId: undefined },
);

export function InputField({ form, name, type = "text", colSpan }) {
	const label = name.replace(/([A-Z])/g, " $1").trim();

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className={colSpan ? "col-span-full" : ""}>
					<FormLabel className="flex items-center gap-1 capitalize">
						{label}
						{REQUIRED_FIELDS.includes(name) && (
							<span className="text-red-500 font-medium">
								*
							</span>
						)}
					</FormLabel>

					<FormControl>
						<Input {...field} type={type} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function Section({ title, icon, children }) {
	const Icon = icon;
	return (
		<div className="rounded-xl border border-border">
			<div className="flex items-center gap-3 px-6 py-4 rounded-t-xl bg-muted/50 border-b border-border">
				<div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center">
					<Icon className="h-5 w-5 text-foreground" />
				</div>
				<h2 className="text-lg font-semibold text-foreground">
					{title}
				</h2>
			</div>

			<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{children}
			</div>
		</div>
	);
}

function formatDateForInput(date) {
	if (!date) return "";
	return date.split("T")[0];
}

export default function TeacherFormPage({ defaultValues }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const encryptedUser = localStorage.getItem("user");
	const user = encryptedUser ? decryptData(encryptedUser) : null;

	const isEdit = Boolean(id);

	const form = useForm({
		resolver: zodResolver(teacherSchema),
		defaultValues: {
			...EMPTY_DEFAULTS,
			...defaultValues,
		},
	});

	const { data: teacher } = useTeacher(id, { enabled: isEdit });
	const { mutate: saveTeacher, isLoading } = useUpsertTeacher();
	
	useEffect(() => {
		if(user?.LinkedID !== Number(id)) {
			toast.error("You are not authorized to edit this teacher's details.");
			navigate(-1);
			return;
		}
		if (teacher) {
			const mappedTeacher = {
				teacherId: teacher.TeacherID ?? undefined,
				fullName: teacher.FullName ?? "",
				subject: teacher.Subject ?? "",
				email: teacher.Email ?? "",
				contactNumber: teacher.ContactNumber ?? "",
				gender: teacher.Gender ?? "",
				profilePictureUrl: teacher.ProfilePictureUrl ?? "",
				profilePhoto: teacher.ProfilePhoto ?? "",
				idProofPhoto: teacher.IDProofPhoto ?? "",
				qualification: teacher.Qualification ?? "",
				experienceYears: teacher.ExperienceYears ?? "",
				address: teacher.Address ?? "",
				city: teacher.City ?? "",
				state: teacher.State ?? "",
				postalCode: teacher.PostalCode ?? "",
				nationality: teacher.Nationality ?? "",
				dateOfBirth: formatDateForInput(teacher.DateOfBirth),
				dateOfJoining: formatDateForInput(teacher.DateOfJoining),

				bloodGroup: teacher.BloodGroup ?? "",
				maritalStatus: teacher.MaritalStatus ?? "",
				salary: teacher.Salary ?? "",
				emergencyContactName: teacher.EmergencyContactName ?? "",
				emergencyContactNumber:
					teacher.EmergencyContactNumber ?? "",
				vehicleNumber: teacher.VehicleNumber ?? "",
				transportNumber: teacher.TransportNumber ?? "",
			};

			form.reset({
				...EMPTY_DEFAULTS,
				...mappedTeacher,
			});
		}
	}, [teacher]);

	const avatar =
		form.watch("profilePhoto") ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(
			form.watch("fullName") || "Teacher",
		)}`;

	const onSubmit = (values) => {
		saveTeacher(
			{ ...values, teacherId: isEdit ? Number(id) : undefined },
			{
				onSuccess: () => {
					toast.success(
						isEdit
							? "Teacher updated successfully"
							: "Teacher saved successfully",
					);
					navigate("/teacher-list");
				},
			},
		);
	};

	return (
		<section className="w-full p-6 space-y-8 text-foreground">
			<div>
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<UserPlus className="h-6 w-6" />
					{isEdit ? "Edit Teacher" : "Add Teacher"}
				</h1>

				<div className="mt-2 flex items-center text-sm text-muted-foreground gap-1">
					<span>Dashboard</span>
					<ChevronRight className="h-4 w-4" />
					<span>Teachers</span>
					<ChevronRight className="h-4 w-4" />
					<span className="font-medium text-foreground">
						{isEdit ? "Edit Teacher" : "Add Teacher"}
					</span>
				</div>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					{/* Profile */}
					<div className="flex flex-col md:flex-row items-center gap-6">
						<img
							src={avatar}
							alt="Profile"
							className="h-28 w-28 rounded-xl border border-border object-cover bg-muted"
						/>
						<div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
							<InputField
								form={form}
								name="profilePhoto"
							/>
							<InputField
								form={form}
								name="idProofPhoto"
							/>
						</div>
					</div>

					<Section title="Personal Information" icon={User}>
						<InputField form={form} name="fullName" />
						<InputField form={form} name="gender" />
						<InputField
							form={form}
							name="dateOfBirth"
							type="date"
						/>
						<InputField form={form} name="bloodGroup" />
						<InputField form={form} name="maritalStatus" />
						<InputField form={form} name="nationality" />
					</Section>

					<Section
						title="Professional Information"
						icon={Briefcase}
					>
						<InputField form={form} name="subject" />
						<InputField form={form} name="qualification" />
						<InputField form={form} name="experienceYears" />
						<InputField
							form={form}
							name="dateOfJoining"
							type="date"
						/>
						<InputField form={form} name="salary" />
					</Section>

					<Section title="Contact Information" icon={Phone}>
						<InputField form={form} name="email" />
						<InputField form={form} name="contactNumber" />
						<InputField form={form} name="address" colSpan />
						<InputField form={form} name="city" />
						<InputField form={form} name="state" />
						<InputField form={form} name="postalCode" />
					</Section>

					<Section title="Emergency Contact" icon={Shield}>
						<InputField
							form={form}
							name="emergencyContactName"
						/>
						<InputField
							form={form}
							name="emergencyContactNumber"
						/>
					</Section>

					<Section title="Transportation" icon={Car}>
						<InputField form={form} name="vehicleNumber" />
						<InputField form={form} name="transportNumber" />
					</Section>

					<div className="flex justify-end gap-3 pt-6">
						<Button type="submit" disabled={isLoading}>
							{isLoading
								? isEdit
									? "Updating..."
									: "Saving..."
								: isEdit
									? "Update Teacher"
									: "Save Teacher"}
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
}
